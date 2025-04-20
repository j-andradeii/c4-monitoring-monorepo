# Using TypeORM QueryRunner to Remove a Member by ID

The `QueryRunner` in TypeORM allows you to execute database operations within a transaction, giving you fine-grained control over the transaction lifecycle. Here's how to use it to safely remove a Member entity by ID:

## Basic Implementation

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(private dataSource: DataSource) {}

  async removeMemberById(id: string): Promise<boolean> {
    // Create a query runner
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Execute the delete operation
      const deleteResult = await queryRunner.manager.delete(Member, { id });
      
      // Check if any rows were affected
      const success = deleteResult.affected > 0;
      
      // If successful, commit the transaction
      await queryRunner.commitTransaction();
      
      return success;
    } catch (error) {
      // If an error occurs, roll back the transaction
      await queryRunner.rollbackTransaction();
      throw error; // Re-throw the error for handling at a higher level
    } finally {
      // Always release the query runner, regardless of success or failure
      await queryRunner.release();
    }
  }
}
```

## Advanced Implementation with Soft Delete and Related Entities

If you need to handle soft deletes or remove related entities, you can use a more advanced approach:

```typescript
async removeMemberWithRelations(id: string): Promise<boolean> {
  const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // 1. First, find the member to ensure it exists
    const member = await queryRunner.manager.findOne(Member, {
      where: { id },
      relations: ['churchCampusMembers', 'memberProfiles'], // Include any related entities
    });
    
    if (!member) {
      return false; // Member not found
    }
    
    // 2. Remove related entities first (if needed)
    if (member.churchCampusMembers?.length) {
      await queryRunner.manager.remove(member.churchCampusMembers);
    }
    
    if (member.memberProfiles?.length) {
      await queryRunner.manager.remove(member.memberProfiles);
    }
    
    // 3. Remove the member
    await queryRunner.manager.remove(member);
    
    // 4. Commit the transaction
    await queryRunner.commitTransaction();
    
    return true;
  } catch (error) {
    // Roll back on error
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    // Always release the query runner
    await queryRunner.release();
  }
}
```

## Soft Delete Implementation

If your `Member` entity uses TypeORM's soft delete feature (`@DeleteDateColumn`), you can use the `softDelete` method:

```typescript
async softDeleteMember(id: string): Promise<boolean> {
  const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Execute soft delete
    const result = await queryRunner.manager.softDelete(Member, { id });
    
    // Check if any rows were affected
    const success = result.affected > 0;
    
    // Commit the transaction
    await queryRunner.commitTransaction();
    
    return success;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

## Using Raw SQL (If Needed)

For more complex delete operations, you can use raw SQL:

```typescript
async removeMemberWithRawSQL(id: string): Promise<boolean> {
  const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Execute custom SQL (be careful with SQL injection!)
    const result = await queryRunner.query(
      'DELETE FROM members WHERE id = $1 RETURNING id', 
      [id]
    );
    
    const success = result && result.length > 0;
    
    await queryRunner.commitTransaction();
    
    return success;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

## Best Practices

1. **Always use try/catch/finally**: Ensure the query runner is released even if an error occurs.
2. **Check for existence**: Consider checking if the entity exists before attempting to delete it.
3. **Handle related entities**: Delete or update related entities as needed to maintain referential integrity.
4. **Return meaningful results**: Return a boolean or other value to indicate success or failure.
5. **Log errors**: Consider logging errors before re-throwing them.

## Complete Example with Error Handling and Logging

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);

  constructor(private dataSource: DataSource) {}

  async removeMemberById(id: string): Promise<boolean> {
    this.logger.log(`Attempting to remove member with ID: ${id}`);
    
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // First check if the member exists
      const memberExists = await queryRunner.manager.exists(Member, { where: { id } });
      
      if (!memberExists) {
        this.logger.warn(`Member with ID ${id} not found`);
        throw new NotFoundException(`Member with ID ${id} not found`);
      }
      
      // Execute the delete operation
      const deleteResult = await queryRunner.manager.delete(Member, { id });
      
      // Check if any rows were affected
      const success = deleteResult.affected > 0;
      
      if (success) {
        this.logger.log(`Successfully removed member with ID: ${id}`);
        await queryRunner.commitTransaction();
      } else {
        this.logger.warn(`Failed to remove member with ID: ${id}`);
        await queryRunner.rollbackTransaction();
      }
      
      return success;
    } catch (error) {
      this.logger.error(`Error removing member with ID ${id}: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      
      // Re-throw the error, but preserve its type if it's a NestJS exception
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to remove member: ${error.message}`);
    } finally {
      // Always release the query runner
      await queryRunner.release();
    }
  }
}
```

This implementation provides a robust way to remove a Member entity by ID using TypeORM's QueryRunner, with proper transaction handling, error management, and logging.