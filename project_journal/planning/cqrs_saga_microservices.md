# CQRS and Distributed Transactions (Saga Pattern) in NestJS Microservices

This document outlines an architectural approach for handling transactions that span multiple microservices in a NestJS environment, specifically addressing the scenario involving an **Order Service** and a **Credit Service**. While CQRS (Command Query Responsibility Segregation) is a valuable pattern for structuring services internally, managing consistency *across* services requires a distributed transaction pattern like **Saga**.

## 1. The Challenge: Distributed Transactions

In a microservices architecture, each service typically owns its database. Standard ACID transactions do not span across multiple databases or services. When an operation requires changes in multiple services (like creating an order and deducting credit), ensuring that either *all* operations succeed or *none* of them take effect (atomicity) becomes complex.

**Scenario:**

1.  A user places an order.
2.  The system needs to check if the user has sufficient credit (Credit Service).
3.  If credit is sufficient, the order should be saved (Order Service), and the credit balance should be deducted (Credit Service).
4.  If any step fails (e.g., insufficient credit, database error during order save, error during credit deduction), the entire operation must be rolled back to maintain data consistency.

## 2. CQRS vs. Saga

*   **CQRS:** Primarily focuses on separating the read (Query) and write (Command) operations *within* a single service or bounded context. This can optimize performance and scalability by allowing different models and data stores for reads and writes. It *doesn't* inherently solve the problem of coordinating transactions across *multiple* services. You might implement CQRS within the Order Service and the Credit Service independently.
*   **Saga Pattern:** A pattern for managing data consistency across microservices in distributed transactions. A saga is a sequence of local transactions. Each local transaction updates the database within a single service and publishes a message or event to trigger the next local transaction in the saga. If a local transaction fails, the saga executes compensating transactions to undo the preceding transactions.

## 3. Implementing the Saga Pattern

There are two main ways to implement Sagas:

*   **Choreography:** Each service participating in the saga publishes events after completing its local transaction. Other services listen to these events and perform their actions. There's no central coordinator.
*   **Orchestration:** A central orchestrator (which could be a dedicated service or part of the initiating service) tells the participating services what local transactions to execute. The orchestrator keeps track of the saga's state.

**Orchestration is often preferred** as it centralizes the logic, makes the workflow explicit, and simplifies monitoring and debugging. We will focus on the Orchestration approach here.

### 3.1. Orchestration-Based Saga for Order Creation

**Components:**

1.  **API Gateway (Optional but Recommended):** Entry point for client requests.
2.  **Order Service:** Manages orders (owns `Purchase` entity/table). Hosts the Saga Orchestrator logic.
3.  **Credit Service:** Manages user credits (owns `Credit` entity/table).
4.  **Message Broker (e.g., RabbitMQ, Kafka, NATS):** Facilitates reliable, asynchronous communication between services.

**Example DTOs (Shared Library or Defined in Each Service):**

```typescript
// libs/shared/dto/create-order.dto.ts
export class CreateOrderDto {
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
}

// libs/shared/dto/check-credit.command.ts
export class CheckCreditCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly orderId: string, // Link back to the saga/order
    public readonly correlationId: string // For tracing
  ) {}
}

// libs/shared/dto/credit-check-result.event.ts
export class CreditCheckResultEvent {
  constructor(
    public readonly orderId: string,
    public readonly correlationId: string,
    public readonly success: boolean,
    public readonly reason?: string // Optional reason for failure
  ) {}
}

// libs/shared/dto/deduct-credit.command.ts
export class DeductCreditCommand {
   constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly orderId: string,
    public readonly correlationId: string
  ) {}
}

// libs/shared/dto/credit-deduction-result.event.ts
export class CreditDeductionResultEvent {
   constructor(
    public readonly orderId: string,
    public readonly correlationId: string,
    public readonly success: boolean,
    public readonly reason?: string
  ) {}
}

// libs/shared/dto/release-credit.command.ts (Compensating)
export class ReleaseCreditCommand {
   constructor(
    public readonly userId: string,
    public readonly amount: number, // Amount to release/un-reserve
    public readonly orderId: string,
    public readonly correlationId: string
  ) {}
}
```

**Order Service (Orchestrator Example):**

```typescript
// apps/order/src/order.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderSaga } from './sagas/create-order.saga'; // Saga orchestrator logic
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { SagaState } from './entities/saga-state.entity'; // Entity to persist saga state

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, SagaState]), // Import repositories
    ClientsModule.register([
      {
        name: 'CREDIT_SERVICE', // Injection token
        transport: Transport.RMQ, // Example: RabbitMQ
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'credit_queue', // Queue the Credit Service listens to
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, CreateOrderSaga], // Include the Saga
})
export class OrderModule {}

// apps/order/src/order.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '@app/shared/dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderSaga } from './sagas/create-order.saga';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly createOrderSaga: CreateOrderSaga,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const correlationId = uuidv4(); // Unique ID for this transaction attempt
    console.log(`[OrderService] Creating order ${correlationId}`);

    // 1. Create Order entity in PENDING state
    const order = this.orderRepository.create({
      ...createOrderDto,
      status: OrderStatus.PENDING,
      correlationId: correlationId,
    });
    await this.orderRepository.save(order);
    console.log(`[OrderService] Order ${order.id} saved as PENDING.`);

    // 2. Start the Saga
    try {
      await this.createOrderSaga.start(order, correlationId);
      // Note: Saga runs asynchronously. This method returns the initial order.
      // The actual completion/failure happens via events handled by the saga.
      console.log(`[OrderService] Saga started for order ${order.id}.`);
    } catch (error) {
      console.error(`[OrderService] Failed to start saga for order ${order.id}`, error);
      // Immediately mark order as failed if saga start fails critically
      order.status = OrderStatus.FAILED;
      await this.orderRepository.save(order);
      throw error; // Re-throw or handle appropriately
    }

    return order;
  }

  // Methods to update order status based on saga events (called by the saga)
  async confirmOrder(orderId: string, correlationId: string): Promise<void> {
     console.log(`[OrderService] Confirming order ${orderId} (${correlationId})`);
     await this.orderRepository.update({ id: orderId, correlationId }, { status: OrderStatus.CONFIRMED });
  }

  async completeOrder(orderId: string, correlationId: string): Promise<void> {
     console.log(`[OrderService] Completing order ${orderId} (${correlationId})`);
     await this.orderRepository.update({ id: orderId, correlationId }, { status: OrderStatus.COMPLETED });
  }

  async failOrder(orderId: string, correlationId: string, reason: string): Promise<void> {
     console.warn(`[OrderService] Failing order ${orderId} (${correlationId}). Reason: ${reason}`);
     await this.orderRepository.update({ id: orderId, correlationId }, { status: OrderStatus.FAILED });
  }

   async cancelOrder(orderId: string, correlationId: string): Promise<void> {
     console.warn(`[OrderService] Cancelling order ${orderId} (${correlationId}) due to rollback.`);
     await this.orderRepository.update({ id: orderId, correlationId }, { status: OrderStatus.CANCELLED });
  }
}


// apps/order/src/sagas/create-order.saga.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { SagaState, SagaStatus } from '../entities/saga-state.entity'; // Persist saga state
import { CheckCreditCommand } from '@app/shared/dto/check-credit.command';
import { CreditCheckResultEvent } from '@app/shared/dto/credit-check-result.event';
import { DeductCreditCommand } from '@app/shared/dto/deduct-credit.command';
import { CreditDeductionResultEvent } from '@app/shared/dto/credit-deduction-result.event';
import { ReleaseCreditCommand } from '@app/shared/dto/release-credit.command';
import { OrderService } from '../order.service'; // To update order status
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class CreateOrderSaga {
  constructor(
    @Inject('CREDIT_SERVICE') private readonly creditClient: ClientProxy,
    @InjectRepository(SagaState) private sagaStateRepository: Repository<SagaState>,
    private readonly orderService: OrderService, // Inject OrderService
  ) {}

  async start(order: Order, correlationId: string): Promise<void> {
    console.log(`[Saga ${correlationId}] Starting for Order ${order.id}`);
    const sagaState = this.sagaStateRepository.create({
      correlationId,
      orderId: order.id,
      status: SagaStatus.STARTED,
      payload: JSON.stringify(order), // Store initial context if needed
      currentStep: 'CHECK_CREDIT',
    });
    await this.sagaStateRepository.save(sagaState);

    // Step 1: Check Credit
    await this.sendCheckCreditCommand(order, correlationId);
  }

  private async sendCheckCreditCommand(order: Order, correlationId: string): Promise<void> {
    console.log(`[Saga ${correlationId}] Sending CheckCreditCommand for Order ${order.id}`);
    const command = new CheckCreditCommand(order.userId, order.totalAmount, order.id, correlationId);
    // Send command and wait for reply (or handle via event listener)
    // Using firstValueFrom for request-reply pattern example
    try {
       // Send command and expect a CreditCheckResultEvent back
       // The pattern 'credit.check' should be handled by Credit Service
       const result = await firstValueFrom(
         this.creditClient.send<CreditCheckResultEvent, CheckCreditCommand>('credit.check', command)
           .pipe(timeout(5000)) // Add timeout
       );
       await this.handleCreditCheckResult(result);
    } catch (error) {
       console.error(`[Saga ${correlationId}] Error/Timeout sending CheckCreditCommand or receiving reply`, error);
       await this.handleFailure(correlationId, order.id, 'CHECK_CREDIT_TIMEOUT', 'Timeout or error checking credit');
    }
  }

  // This method could also be an @EventPattern handler if using event-based replies
  async handleCreditCheckResult(event: CreditCheckResultEvent): Promise<void> {
    const { orderId, correlationId, success, reason } = event;
    console.log(`[Saga ${correlationId}] Received CreditCheckResultEvent for Order ${orderId}: Success=${success}`);

    const sagaState = await this.sagaStateRepository.findOneBy({ correlationId });
    if (!sagaState || sagaState.status !== SagaStatus.STARTED) {
        console.warn(`[Saga ${correlationId}] Received event for inactive/unknown saga.`);
        return; // Ignore or handle appropriately
    }

    if (success) {
      // Update saga state
      sagaState.currentStep = 'CONFIRM_ORDER';
      await this.sagaStateRepository.save(sagaState);

      // Step 2: Confirm Order (Local)
      await this.orderService.confirmOrder(orderId, correlationId);

      // Step 3: Deduct Credit
      sagaState.currentStep = 'DEDUCT_CREDIT';
      await this.sagaStateRepository.save(sagaState);
      await this.sendDeductCreditCommand(sagaState.payload, orderId, correlationId); // Assuming payload has needed info
    } else {
      // Handle failure: Insufficient credit
      await this.handleFailure(correlationId, orderId, 'INSUFFICIENT_CREDIT', reason || 'Insufficient credit');
    }
  }

 private async sendDeductCreditCommand(orderPayload: string, orderId: string, correlationId: string): Promise<void> {
    const order = JSON.parse(orderPayload) as Order; // Rehydrate order data
    console.log(`[Saga ${correlationId}] Sending DeductCreditCommand for Order ${orderId}`);
    const command = new DeductCreditCommand(order.userId, order.totalAmount, orderId, correlationId);
    try {
        // Send command and expect CreditDeductionResultEvent
        const result = await firstValueFrom(
            this.creditClient.send<CreditDeductionResultEvent, DeductCreditCommand>('credit.deduct', command)
            .pipe(timeout(5000))
        );
        await this.handleCreditDeductionResult(result);
    } catch (error) {
        console.error(`[Saga ${correlationId}] Error/Timeout sending DeductCreditCommand or receiving reply`, error);
        // Initiate Rollback for Deduct Credit failure
        await this.rollbackFromDeductCreditFailure(correlationId, orderId, 'Timeout or error deducting credit');
    }
 }

 async handleCreditDeductionResult(event: CreditDeductionResultEvent): Promise<void> {
    const { orderId, correlationId, success, reason } = event;
    console.log(`[Saga ${correlationId}] Received CreditDeductionResultEvent for Order ${orderId}: Success=${success}`);

    const sagaState = await this.sagaStateRepository.findOneBy({ correlationId });
     if (!sagaState || sagaState.status !== SagaStatus.STARTED) {
        console.warn(`[Saga ${correlationId}] Received event for inactive/unknown saga.`);
        return;
    }

    if (success) {
        // Step 4: Complete Order (Local)
        sagaState.currentStep = 'COMPLETE_ORDER';
        await this.sagaStateRepository.save(sagaState);
        await this.orderService.completeOrder(orderId, correlationId);

        // Saga successful
        sagaState.status = SagaStatus.COMPLETED;
        await this.sagaStateRepository.save(sagaState);
        console.log(`[Saga ${correlationId}] Saga completed successfully for Order ${orderId}.`);
    } else {
        // Handle failure: Credit deduction failed
        await this.rollbackFromDeductCreditFailure(correlationId, orderId, reason || 'Credit deduction failed');
    }
 }

 // --- Rollback Logic ---

 async handleFailure(correlationId: string, orderId: string, step: string, reason: string): Promise<void> {
    console.warn(`[Saga ${correlationId}] Handling failure at step ${step} for Order ${orderId}. Reason: ${reason}`);
    const sagaState = await this.sagaStateRepository.findOneBy({ correlationId });
    if (sagaState && sagaState.status === SagaStatus.STARTED) {
        sagaState.status = SagaStatus.FAILED;
        sagaState.failureReason = reason;
        await this.sagaStateRepository.save(sagaState);
        // Mark order as failed
        await this.orderService.failOrder(orderId, correlationId, reason);
        // No compensation needed if failure happened before any cross-service changes (like credit check fail)
    }
 }

 async rollbackFromDeductCreditFailure(correlationId: string, orderId: string, reason: string): Promise<void> {
    console.warn(`[Saga ${correlationId}] Initiating rollback from Deduct Credit failure for Order ${orderId}. Reason: ${reason}`);
    const sagaState = await this.sagaStateRepository.findOneBy({ correlationId });
    if (!sagaState || sagaState.status !== SagaStatus.STARTED) {
        console.warn(`[Saga ${correlationId}] Cannot rollback inactive/unknown saga.`);
        return;
    }

    sagaState.status = SagaStatus.ROLLING_BACK;
    sagaState.failureReason = reason;
    await this.sagaStateRepository.save(sagaState);

    // Compensating Action 1: Cancel Order (Local)
    await this.orderService.cancelOrder(orderId, correlationId);

    // Compensating Action 2: Release Credit (Remote)
    const order = JSON.parse(sagaState.payload) as Order;
    await this.sendReleaseCreditCommand(order.userId, order.totalAmount, orderId, correlationId);

    // Mark saga as failed after attempting rollback
    sagaState.status = SagaStatus.FAILED;
    await this.sagaStateRepository.save(sagaState);
    console.log(`[Saga ${correlationId}] Rollback attempted for Order ${orderId}. Saga marked as FAILED.`);
 }

 private async sendReleaseCreditCommand(userId: string, amount: number, orderId: string, correlationId: string): Promise<void> {
    console.log(`[Saga ${correlationId}] Sending ReleaseCreditCommand (Compensation) for Order ${orderId}`);
    const command = new ReleaseCreditCommand(userId, amount, orderId, correlationId);
    // Send compensation command - often fire-and-forget, but might need confirmation/retry
    this.creditClient.emit('credit.release', command); // Use emit for event-style
 }

 // TODO: Implement handling for other failure points (e.g., Confirm Order failure)
 // TODO: Implement retry logic for sending commands/compensations
 // TODO: Implement idempotency checks in handlers
}
```

**Credit Service (Handler Example):**

```typescript
// apps/credit/src/credit.module.ts
import { Module } from '@nestjs/common';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { CreditReservation } from './entities/credit-reservation.entity'; // For tracking reservations

@Module({
  imports: [TypeOrmModule.forFeature([Credit, CreditReservation])],
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}


// apps/credit/src/credit.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CreditService } from './credit.service';
import { CheckCreditCommand } from '@app/shared/dto/check-credit.command';
import { CreditCheckResultEvent } from '@app/shared/dto/credit-check-result.event';
import { DeductCreditCommand } from '@app/shared/dto/deduct-credit.command';
import { CreditDeductionResultEvent } from '@app/shared/dto/credit-deduction-result.event';
import { ReleaseCreditCommand } from '@app/shared/dto/release-credit.command';

@Controller()
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  // Handler for Request-Reply pattern
  @MessagePattern('credit.check') // Matches the pattern used in creditClient.send
  async handleCheckCredit(
    @Payload() command: CheckCreditCommand,
    @Ctx() context: RmqContext, // Example context for RabbitMQ
  ): Promise<CreditCheckResultEvent> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(`[CreditService] Received CheckCreditCommand: ${JSON.stringify(command)}`);
    try {
      const { hasSufficientCredit, reason } = await this.creditService.reserveCredit(
        command.userId,
        command.amount,
        command.orderId, // Use orderId for reservation tracking
        command.correlationId
      );
      // Acknowledge message processed successfully
      channel.ack(originalMsg);
      return new CreditCheckResultEvent(command.orderId, command.correlationId, hasSufficientCredit, reason);
    } catch (error) {
      console.error(`[CreditService] Error processing CheckCreditCommand for ${command.correlationId}`, error);
      // Optionally Nack (negative acknowledgement) the message for retry or dead-lettering
      // channel.nack(originalMsg, false, false); // Don't requeue
      // Return failure event
      return new CreditCheckResultEvent(command.orderId, command.correlationId, false, 'Internal server error during credit check');
    }
  }

  // Handler for Deduct Credit
  @MessagePattern('credit.deduct')
  async handleDeductCredit(
    @Payload() command: DeductCreditCommand,
    @Ctx() context: RmqContext,
  ): Promise<CreditDeductionResultEvent> {
     const channel = context.getChannelRef();
     const originalMsg = context.getMessage();
     console.log(`[CreditService] Received DeductCreditCommand: ${JSON.stringify(command)}`);
     try {
        await this.creditService.confirmCreditDeduction(
            command.userId,
            command.amount,
            command.orderId,
            command.correlationId
        );
        channel.ack(originalMsg);
        return new CreditDeductionResultEvent(command.orderId, command.correlationId, true);
     } catch (error) {
        console.error(`[CreditService] Error processing DeductCreditCommand for ${command.correlationId}`, error);
        // channel.nack(originalMsg, false, false);
        return new CreditDeductionResultEvent(command.orderId, command.correlationId, false, 'Internal server error during credit deduction');
     }
  }

  // Handler for Compensation (Event-based example)
  @MessagePattern('credit.release') // Matches the pattern used in creditClient.emit
  async handleReleaseCredit(
    @Payload() command: ReleaseCreditCommand,
    @Ctx() context: RmqContext,
  ): Promise<void> { // No return value needed for emit/event
     const channel = context.getChannelRef();
     const originalMsg = context.getMessage();
     console.log(`[CreditService] Received ReleaseCreditCommand (Compensation): ${JSON.stringify(command)}`);
     try {
        await this.creditService.releaseCreditReservation(
            command.userId,
            command.amount,
            command.orderId,
            command.correlationId
        );
        channel.ack(originalMsg);
     } catch (error) {
        console.error(`[CreditService] Error processing ReleaseCreditCommand for ${command.correlationId}`, error);
        // Decide on error handling for compensation failure (e.g., log, alert, retry?)
        // channel.nack(originalMsg, false, true); // Maybe requeue compensation? Risky.
        channel.ack(originalMsg); // Acknowledge to prevent infinite loops if requeue is bad
     }
  }
}

// apps/credit/src/credit.service.ts
// ... (Implementation for reserveCredit, confirmCreditDeduction, releaseCreditReservation)
// This service would interact with Credit and CreditReservation entities/repositories.
// It needs to handle idempotency (e.g., check if reservation for orderId/correlationId already exists).
```

**Workflow (Success Path - Code Perspective):**

1.  **Initiate Order:** `OrderController` calls `orderService.createOrder(dto)`.
2.  **Start Saga:** `orderService.createOrder` saves the initial `Order` (PENDING) and calls `createOrderSaga.start(order, correlationId)`.
3.  **Check Credit:** `createOrderSaga.start` saves `SagaState` (STARTED) and calls `sendCheckCreditCommand`. This uses `creditClient.send('credit.check', command)` to send the command via RabbitMQ (or other transporter) and awaits a reply.
4.  **Reserve Credit:** `CreditController.handleCheckCredit` receives the command, calls `creditService.reserveCredit`. This service checks balance, creates a `CreditReservation` record (or similar mechanism), and returns success/failure. The controller sends back a `CreditCheckResultEvent`.
5.  **Confirm Order:** `createOrderSaga` receives the `CreditCheckResultEvent` via the `send` reply mechanism in `sendCheckCreditCommand`. If successful, it calls `orderService.confirmOrder` (local update) and updates `SagaState`.
6.  **Deduct Credit:** `createOrderSaga` calls `sendDeductCreditCommand`, again using `creditClient.send('credit.deduct', command)`.
7.  **Finalize Credit:** `CreditController.handleDeductCredit` receives the command, calls `creditService.confirmCreditDeduction` (updates balance, removes/confirms reservation). Controller sends back `CreditDeductionResultEvent`.
8.  **Complete Saga:** `createOrderSaga` receives `CreditDeductionResultEvent`. If successful, it calls `orderService.completeOrder` (local update) and updates `SagaState` to COMPLETED.

**Workflow (Failure & Rollback - Code Perspective):**

*   **Scenario A (Insufficient Credit):** `creditService.reserveCredit` returns failure. `CreditController.handleCheckCredit` sends `CreditCheckResultEvent` with `success: false`. `createOrderSaga.handleCreditCheckResult` receives this, calls `handleFailure`, which updates `SagaState` (FAILED) and calls `orderService.failOrder`.
*   **Scenario C (Deduct Credit Fails):** `creditService.confirmCreditDeduction` throws error. `CreditController.handleDeductCredit` catches error, sends `CreditDeductionResultEvent` with `success: false`. `createOrderSaga.handleCreditDeductionResult` receives this, calls `rollbackFromDeductCreditFailure`.
    *   `rollbackFromDeductCreditFailure` updates `SagaState` (ROLLING_BACK), calls `orderService.cancelOrder` (local compensation), calls `sendReleaseCreditCommand` (remote compensation using `creditClient.emit('credit.release', command)`).
    *   `CreditController.handleReleaseCredit` receives the compensation command, calls `creditService.releaseCreditReservation`.
    *   `rollbackFromDeductCreditFailure` finally updates `SagaState` to FAILED.

### 3.2. Choreography-Based Saga (Alternative)

(Conceptual - Code examples omitted for brevity, but would involve more `@EventPattern` handlers reacting to events published by other services using `client.emit()`).

## 4. Implementation Considerations in NestJS

*   **Communication:** Use NestJS microservice capabilities (`@nestjs/microservices`) with a suitable transporter (RabbitMQ, Kafka, NATS). Define clear DTOs for commands and events (as shown above). Use `ClientProxy` (`@Inject('SERVICE_NAME')`) for sending messages/events. Use `@MessagePattern` (for request/reply) or `@EventPattern` (for event-based) decorators in controllers to handle incoming messages.
*   **Idempotency:** Ensure message handlers (`handleCheckCredit`, `handleDeductCredit`, `handleReleaseCredit`) are idempotent.
    *   **Example:** In `creditService.reserveCredit`, check if a reservation for the given `orderId` or `correlationId` already exists before creating a new one. If it exists and matches, return success without creating duplicates. Similarly, check if credit was already released before attempting release again.
*   **Saga State Management (Orchestration):** The orchestrator (`CreateOrderSaga`) needs to persist its state. The example uses a `SagaState` TypeORM entity. This allows the saga to resume correctly if the Order Service restarts. Load the state using `correlationId` when handling replies/events.
*   **Error Handling:** Use `try...catch` blocks around `client.send()` or within handlers. Implement timeouts (`rxjs/operators/timeout`). Use message broker features like dead-letter queues (DLQ) by configuring queue options and potentially NACKing messages (`channel.nack(msg, false, false)`).
*   **Compensating Transactions:** Design `ReleaseCreditCommand` and its handler (`handleReleaseCredit`) carefully. Ensure `creditService.releaseCreditReservation` correctly undoes the reservation. Compensations should ideally succeed, but plan for failures (logging, alerts).
*   **Observability:** Use `correlationId` across all commands/events related to a single saga instance. Pass this ID in logs. Integrate with distributed tracing libraries compatible with NestJS and your message broker.

## 5. Conclusion

While CQRS helps structure individual services, the **Saga pattern** (especially Orchestration) provides a robust way to manage distributed transactions across microservices like your Order and Credit services. It ensures eventual consistency by defining a sequence of local transactions and corresponding compensating transactions for rollbacks. Implementing Sagas requires careful consideration of communication, state management, idempotency, and error handling, leveraging tools like message brokers and NestJS's microservice features, as illustrated in the code examples.