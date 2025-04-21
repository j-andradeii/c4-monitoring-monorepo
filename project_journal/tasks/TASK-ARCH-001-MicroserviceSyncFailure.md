# Task Log: TASK-ARCH-001 - Microservice Synchronous Call Failure Analysis

**Goal:** Analyze and resolve the failure of the `POST /createStaffs` endpoint under consecutive load in the NestJS microservice architecture deployed on Railway.

**Context:**
*   Architecture: API Gateway, Church Service (+DB), Members Service (+DB), RabbitMQ.
*   Deployment: Railway Pro Plan.
*   Problem: `POST /createStaffs` involves synchronous calls (`API Gateway -> Church -> Member`). Works initially but fails after ~5 consecutive calls.
*   Initial Hypothesis: Resource exhaustion (DB connections, container limits) or timeouts due to synchronous chaining bottleneck.

**Analysis (2025-04-21):**
*   Identified the synchronous, chained request pattern as a likely architectural smell causing the issue under load.
*   This pattern leads to resource contention, poor resilience, and limited scalability.

**Proposed Solutions:**
1.  **Recommended:** Refactor to an asynchronous, event-driven pattern using RabbitMQ.
    *   API Gateway publishes `StaffCreationRequested` event.
    *   Church & Members services subscribe independently and process the event.
    *   API Gateway returns `202 Accepted` quickly.
    *   Benefits: Decoupling, Resilience, Scalability, Responsiveness.
2.  **Alternative (Investigation):** Debug the current synchronous setup.
    *   Check Railway logs & metrics for all services.
    *   Review DB connection pool sizes (`orm-config.ts`/`*.module.ts`).
    *   Review NestJS microservice client timeouts in API Gateway.

**Next Steps:**
*   Waiting for user decision on whether to investigate the current setup or plan the refactor.
---
**Investigation (2025-04-21):**
*   Decision: Investigate the current synchronous setup before considering a refactor.
*   Plan:
    1.  Check DB connection pool configurations (`church`, `members`).
    2.  Check microservice client timeouts in API Gateway.
    3.  Request user to check Railway logs and metrics.
*   **Finding 1 (Church Service DB Pool):** `apps/church/src/orm-config.ts` does not specify a connection pool size. It likely defaults to 10 (based on `pg` driver default). This is a potential bottleneck.
*   **Finding 2 (Members Service DB Pool):** `apps/members/src/orm-config.ts` also does not specify a connection pool size. It likely defaults to 10. This reinforces the pool exhaustion hypothesis.
*   **Finding 3 (API GW Client Timeout - Church):** The RMQ client configuration for `CHURCH_SERVICE` in `apps/api-gateway/src/microservices/church-microservice/church-microservice.module.ts` does not specify a timeout. It likely defaults to 30 seconds (NestJS default).
*   **Finding 4 (API GW Client Timeout - Members):** The RMQ client configuration for `MEMBERS_SERVICE` in `apps/api-gateway/src/microservices/members-microservice/members-microservice.module.ts` also does not specify a timeout, likely defaulting to 30 seconds.
*   **Investigation Update (2025-04-21):** User provided PostgreSQL server checkpoint logs. Clarified need for *application* logs from API Gateway, Church, and Members services on Railway to identify connection pool, timeout, or resource limit errors.