# Comprehensive Dynamic Disciple Closure Table Tutorial for NestJS (Raw SQL)

This tutorial explains how to implement the Closure Table pattern for managing a discipleship hierarchy (where a Member can disciple other Members) within a NestJS application. It assumes you have a `Member` TypeORM entity and that the closure table itself is **dynamically named** and managed **without a dedicated TypeORM entity**, using raw SQL queries via `QueryRunner`.

## 1. What is the Closure Table Pattern?

The Closure Table pattern stores all ancestor-descendant relationships explicitly in a separate table. In this context, "ancestor" represents a discipler (or discipler's discipler, etc.) and "descendant" represents a disciple (or disciple's disciple, etc.). This allows efficient querying of the entire discipleship lineage or downline.

**Example Hierarchy:**

```
Paul (1)
  └── Timothy (2)
      ├── Linus (3)
      └── Claudia (4)
```

**Dynamic Closure Table Entries (e.g., `member_disciple_closure_groupA`)**

| ancestor_id (Discipler Lineage) | descendant_id (Disciple Lineage) | depth |
| :------------------------------ | :------------------------------- | :---- |
| 1 (Paul)                        | 1 (Paul)                         | 0     |
| 1 (Paul)                        | 2 (Timothy)                      | 1     |
| 1 (Paul)                        | 3 (Linus)                        | 2     |
| 1 (Paul)                        | 4 (Claudia)                      | 2     |
| 2 (Timothy)                     | 2 (Timothy)                      | 0     |
| 2 (Timothy)                     | 3 (Linus)                        | 1     |
| 2 (Timothy)                     | 4 (Claudia)                      | 1     |
| 3 (Linus)                       | 3 (Linus)                        | 0     |
| 4 (Claudia)                     | 4 (Claudia)                      | 0     |

## 2. Database Schema (PostgreSQL)

**Main `Member` Entity Table (Managed by TypeORM):**

```sql
-- Assuming pgcrypto extension is enabled for uuid_generate_v4()
CREATE TABLE members ( -- Your existing Member table
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    -- other member-specific fields
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Dynamic Disciple Closure Table (Managed via Raw SQL):**

The name of this table (e.g., `member_disciple_closure_groupA`, `member_disciple_closure_churchX`) will be determined dynamically by your application logic.

```sql
-- Example: Schema for a table named 'member_disciple_closure_dynamic'
CREATE TABLE member_disciple_closure_dynamic (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Optional but often useful

    ancestor_id UUID NOT NULL,    -- Represents the discipler in the path
    descendant_id UUID NOT NULL,  -- Represents the disciple in the path
    depth INT NOT NULL,           -- 0 = self, 1 = direct disciple, etc.

    -- Foreign key constraints are HIGHLY recommended
    CONSTRAINT fk_disciple_closure_ancestor
        FOREIGN KEY (ancestor_id)
        REFERENCES members (id)
        ON DELETE CASCADE, -- If a member is deleted, remove their discipleship links

    CONSTRAINT fk_disciple_closure_descendant
        FOREIGN KEY (descendant_id)
        REFERENCES members (id)
        ON DELETE CASCADE,

    -- Ensure unique paths
    CONSTRAINT uq_disciple_closure_path UNIQUE (ancestor_id, descendant_id)
);

-- Indexes are crucial for performance
CREATE INDEX idx_disciple_closure_ancestor ON member_disciple_closure_dynamic (ancestor_id);
CREATE INDEX idx_disciple_closure_descendant ON member_disciple_closure_dynamic (descendant_id);
CREATE INDEX idx_disciple_closure_depth ON member_disciple_closure_dynamic (depth);
```

**Note:** You need a mechanism to create these dynamic tables when needed (e.g., when a new discipleship group or context is created). The SQL provided in the user prompt is suitable for this creation step within a `QueryRunner`.

## 3. TypeORM Entity (`Member` Only)

Only the `Member` entity needs a TypeORM definition.

```typescript
// src/entities/member.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('members') // Matches the main table name
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName: string; // Use camelCase in entity

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName: string; // Use camelCase in entity

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  // No direct TypeORM relationships to the dynamic closure table

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 4. NestJS Service Implementation (Raw SQL via QueryRunner)

This service manages the discipleship hierarchy using raw SQL for the closure table.

```typescript
// src/member/discipleship.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Member } from '../entities/member.entity'; // Your Member entity

@Injectable()
export class DiscipleshipService {
  private readonly logger = new Logger(DiscipleshipService.name);

  constructor(
    // Inject Member repository if needed for fetching member details
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly dataSource: DataSource, // Inject DataSource for QueryRunner
  ) {}

  // --- Helper to get the dynamic closure table name ---
  // Implement your logic (e.g., based on church, group, context)
  private getDiscipleClosureTableName(context?: any): string {
    // Example: return `member_disciple_closure_${context.groupId}`;
    // For this example, using a fixed name. REPLACE THIS.
    return 'member_disciple_closure'; // Replace with dynamic logic
  }

  // --- Helper to safely quote table name ---
  private quote(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  // ==================================================
  // Scenario 1: Adding a Root Disciple
  // (Adding a member to the hierarchy without a direct discipler in this context)
  // ==================================================
  async addRootDisciple(memberId: string, context?: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    this.logger.log(`Starting transaction to add root disciple '${memberId}' (Closure Table: ${closureTable})`);

    try {
      // 1. Validate member exists in the main 'members' table
      const memberExists = await queryRunner.manager.exists(Member, { where: { id: memberId } });
      if (!memberExists) {
        throw new NotFoundException(`Member with ID ${memberId} not found.`);
      }

      // 2. Check if the member already has a self-reference in this closure table
      const selfExists = await queryRunner.query(
          `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $1 LIMIT 1`,
          [memberId]
      );

      // 3. If self-reference doesn't exist, insert it.
      if (selfExists.length === 0) {
           await queryRunner.query(
            `INSERT INTO ${closureTable} (ancestor_id, descendant_id, depth) VALUES ($1, $1, 0)`,
            [memberId]
          );
          this.logger.debug(`Inserted self-closure for root disciple ${memberId} into ${closureTable}`);
      } else {
          this.logger.warn(`Member ${memberId} already exists in closure table ${closureTable}. No action taken.`);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Committed transaction for adding root disciple ${memberId}`);

    } catch (error) {
      this.logger.error(`Error adding root disciple ${memberId}: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to add root disciple: ${error.message}`);
    } finally {
      await queryRunner.release();
      this.logger.log(`Released query runner for add root disciple`);
    }
  }


  // ==================================================
  // Scenario 2: Adding a Disciple Relationship Under a Discipler
  // (Assigning a member under a specific discipler)
  // Note: Assumes both members already exist in the 'members' table.
  // ==================================================
  async addDisciple(disciplerId: string, discipleId: string, context?: any): Promise<void> {
    if (disciplerId === discipleId) {
      throw new BadRequestException('A member cannot disciple themselves.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    this.logger.log(`Starting transaction to add disciple '${discipleId}' under discipler '${disciplerId}' (Closure Table: ${closureTable})`);

    try {
      // 1. Validate members exist
      const disciplerExists = await queryRunner.manager.exists(Member, { where: { id: disciplerId } });
      if (!disciplerExists) throw new NotFoundException(`Discipler member with ID ${disciplerId} not found.`);
      const discipleExists = await queryRunner.manager.exists(Member, { where: { id: discipleId } });
      if (!discipleExists) throw new NotFoundException(`Disciple member with ID ${discipleId} not found.`);

      // 2. Check if relationship already exists (optional but good practice)
      const existingPath = await queryRunner.query(
        `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $2 AND depth = 1 LIMIT 1`,
        [disciplerId, discipleId]
      );
      if (existingPath.length > 0) {
        this.logger.warn(`Disciple relationship between ${disciplerId} and ${discipleId} already exists.`);
        await queryRunner.commitTransaction(); // Commit as no change needed
        return;
      }

      // 3. Prevent cycles (check if the new disciple is already an ancestor of the discipler)
       const isAncestorResult = await queryRunner.query(
          `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $2 LIMIT 1`,
          [discipleId, disciplerId] // Check if disciple is ancestor of discipler
        );
        if (isAncestorResult.length > 0) {
          throw new BadRequestException(`Cannot make member ${discipleId} a disciple of ${disciplerId} as this would create a cycle.`);
        }

      // 4. Ensure the disciple has a self-reference first. If not, they cannot be added under someone.
      // This assumes a member must exist in the hierarchy (at least as a root) before being assigned.
      const selfExists = await queryRunner.query(
          `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $1 LIMIT 1`,
          [discipleId]
      );
      if (selfExists.length === 0) {
           // Optionally call addRootDisciple first, or throw error:
           // await this.addRootDisciple(discipleId, context); // Requires separate transaction or careful nesting
           throw new BadRequestException(`Disciple member ${discipleId} must exist in the hierarchy (have a self-reference) before being assigned a discipler.`);
           /* Alternatively, insert self-reference here:
            await queryRunner.query(
              `INSERT INTO ${closureTable} (ancestor_id, descendant_id, depth) VALUES ($1, $1, 0)`,
              [discipleId]
            );
            this.logger.debug(`Inserted missing self-closure for disciple ${discipleId} into ${closureTable}`);
           */
      }

      // 5. Insert the new paths using the closure table logic
      // Connects all ancestors of the discipler to the new disciple (and their descendants)
      await queryRunner.query(
        `INSERT INTO ${closureTable} (ancestor_id, descendant_id, depth)
         SELECT p.ancestor_id, c.descendant_id, p.depth + c.depth + 1
         FROM ${closureTable} p, ${closureTable} c
         WHERE p.descendant_id = $1 AND c.ancestor_id = $2`,
        [disciplerId, discipleId]
      );
      this.logger.debug(`Inserted discipleship paths for disciple ${discipleId} via discipler ${disciplerId} into ${closureTable}`);


      await queryRunner.commitTransaction();
      this.logger.log(`Committed transaction for adding disciple ${discipleId} under ${disciplerId}`);

    } catch (error) {
      this.logger.error(`Error adding disciple relationship: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(`Failed to add disciple relationship: ${error.message}`);
    } finally {
      await queryRunner.release();
      this.logger.log(`Released query runner for add disciple`);
    }
  }

  // ==================================================
  // Scenario 3: Getting All Disciples (Downline)
  // ==================================================
  async getDisciples(disciplerId: string, includeSelf: boolean = false, maxDepth?: number, context?: any): Promise<Member[]> {
    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    const parameters: any[] = [disciplerId];
    let paramIndex = 1;

    let sql = `
      SELECT mem.*
      FROM members mem
      JOIN ${closureTable} closure ON mem.id = closure.descendant_id
      WHERE closure.ancestor_id = $${paramIndex++}
    `;

    if (!includeSelf) {
      sql += ` AND closure.depth > 0`;
    }

    if (maxDepth !== undefined && maxDepth >= 0) {
      sql += ` AND closure.depth <= $${paramIndex++}`;
      parameters.push(maxDepth);
    }

    sql += ` ORDER BY closure.depth ASC`; // Optional ordering

    this.logger.debug(`Executing getDisciples query for ${disciplerId} on ${closureTable}`);
    const results = await this.dataSource.query(sql, parameters);
    return results as Member[];
  }

  // ==================================================
  // Scenario 4: Getting Immediate Disciples
  // ==================================================
  async getImmediateDisciples(disciplerId: string, context?: any): Promise<Member[]> {
    // Descendants at depth 1
    return this.getDisciples(disciplerId, false, 1, context);
  }

  // ==================================================
  // Scenario 5: Getting Discipler Lineage (Upline)
  // ==================================================
  async getDisciplerLineage(discipleId: string, includeSelf: boolean = false, context?: any): Promise<Member[]> {
    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    const parameters: any[] = [discipleId];
    let paramIndex = 1;

    let sql = `
      SELECT mem.*
      FROM members mem
      JOIN ${closureTable} closure ON mem.id = closure.ancestor_id
      WHERE closure.descendant_id = $${paramIndex++}
    `;

    if (!includeSelf) {
      sql += ` AND closure.depth > 0`;
    }

    sql += ` ORDER BY closure.depth DESC`; // Order from root (highest discipler) down

    this.logger.debug(`Executing getDisciplerLineage query for ${discipleId} on ${closureTable}`);
    const results = await this.dataSource.query(sql, parameters);
    return results as Member[];
  }

  // ==================================================
  // Scenario 6: Getting the Direct Discipler
  // ==================================================
  async getDirectDiscipler(discipleId: string, context?: any): Promise<Member | null> {
    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    const sql = `
      SELECT mem.*
      FROM members mem
      JOIN ${closureTable} closure ON mem.id = closure.ancestor_id
      WHERE closure.descendant_id = $1 AND closure.depth = 1
    `;
    this.logger.debug(`Executing getDirectDiscipler query for ${discipleId} on ${closureTable}`);
    const results = await this.dataSource.query(sql, [discipleId]);
    return results.length > 0 ? results[0] as Member : null;
  }

  // ==================================================
  // Scenario 7: Changing Discipler (Moving a Member)
  // ==================================================
  async changeDiscipler(discipleId: string, newDisciplerId: string | null, context?: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    this.logger.log(`Starting transaction to move disciple '${discipleId}' under new discipler '${newDisciplerId || 'ROOT'}' (Closure Table: ${closureTable})`);

    try {
      // --- Validation ---
      const discipleExists = await queryRunner.manager.exists(Member, { where: { id: discipleId } });
      if (!discipleExists) throw new NotFoundException(`Disciple member with ID ${discipleId} not found.`);

      // Ensure disciple exists in the current hierarchy context before moving
       const selfExists = await queryRunner.query(
          `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $1 LIMIT 1`,
          [discipleId]
      );
       if (selfExists.length === 0) {
           throw new BadRequestException(`Disciple member ${discipleId} does not exist in this hierarchy context.`);
       }


      if (newDisciplerId) {
         if (discipleId === newDisciplerId) throw new BadRequestException('A member cannot disciple themselves.');
        const parentExists = await queryRunner.manager.exists(Member, { where: { id: newDisciplerId } });
        if (!parentExists) throw new NotFoundException(`New discipler member with ID ${newDisciplerId} not found.`);

         // Ensure new discipler also exists in the current hierarchy context
        const newDisciplerSelfExists = await queryRunner.query(
            `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $1 LIMIT 1`,
            [newDisciplerId]
        );
        if (newDisciplerSelfExists.length === 0) {
            throw new BadRequestException(`New discipler member ${newDisciplerId} does not exist in this hierarchy context.`);
        }


        // Prevent cycles
        const isDescendantResult = await queryRunner.query(
          `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $2 LIMIT 1`,
          [discipleId, newDisciplerId] // Check if discipleId is already ancestor of newDisciplerId
        );
        if (isDescendantResult.length > 0) {
          throw new BadRequestException(`Cannot move member ${discipleId} under ${newDisciplerId} as this would create a cycle.`);
        }
      }
      // --- End Validation ---

      // 1. Delete old paths connecting the disciple's subtree to the old ancestors
      // This query correctly disconnects the entire subtree being moved from its old parentage.
      this.logger.debug(`Deleting old paths for subtree of ${discipleId} from ${closureTable}`);
      await queryRunner.query(
        `DELETE FROM ${closureTable}
         WHERE descendant_id IN (SELECT descendant_id FROM ${closureTable} WHERE ancestor_id = $1)
           AND ancestor_id NOT IN (SELECT descendant_id FROM ${closureTable} WHERE ancestor_id = $1)`,
        [discipleId]
      );

      // 2. Insert new paths based on the new discipler
      if (newDisciplerId) {
        this.logger.debug(`Inserting new paths for subtree ${discipleId} under new discipler ${newDisciplerId} into ${closureTable}`);
        await queryRunner.query(
          `INSERT INTO ${closureTable} (ancestor_id, descendant_id, depth)
           SELECT super_path.ancestor_id, sub_path.descendant_id, super_path.depth + sub_path.depth + 1
           FROM ${closureTable} super_path, ${closureTable} sub_path
           WHERE super_path.descendant_id = $1 AND sub_path.ancestor_id = $2`,
          [newDisciplerId, discipleId]
        );
      } else {
        // Moving to root (no direct discipler)
        this.logger.debug(`Member ${discipleId} moved to have no direct discipler (root of their own line).`);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Committed transaction for moving disciple ${discipleId}`);

    } catch (error) {
      this.logger.error(`Error moving disciple ${discipleId}: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(`Failed to move disciple: ${error.message}`);
    } finally {
      await queryRunner.release();
      this.logger.log(`Released query runner for move disciple`);
    }
  }

  // ==================================================
  // Scenario 8: Removing a Member from the Hierarchy
  // (Does NOT delete the Member entity, just their hierarchy links in this context)
  // ==================================================
   async removeMemberFromHierarchy(memberId: string, context?: any): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const closureTable = this.quote(this.getDiscipleClosureTableName(context));
        this.logger.log(`Starting transaction to remove member '${memberId}' from hierarchy (Closure Table: ${closureTable})`);

        try {
            // Check if member exists in this hierarchy first
            const selfExists = await queryRunner.query(
                `SELECT 1 FROM ${closureTable} WHERE ancestor_id = $1 AND descendant_id = $1 LIMIT 1`,
                [memberId]
            );
            if (selfExists.length === 0) {
                this.logger.warn(`Member ${memberId} not found in hierarchy ${closureTable}. No action needed.`);
                await queryRunner.commitTransaction();
                return;
            }

            // Complex part: Re-parenting the immediate disciples of the removed member.
            // Option 1: Make them roots (simplest).
            // Option 2: Attach them to the removed member's discipler (more complex).
            // Option 3: Delete the entire downline (potentially destructive).

            // --- Implementing Option 1: Make immediate disciples roots ---

            // 1. Find immediate disciples
            const immediateDisciplesResult = await queryRunner.query(
                `SELECT descendant_id FROM ${closureTable} WHERE ancestor_id = $1 AND depth = 1`,
                [memberId]
            );
            const immediateDiscipleIds = immediateDisciplesResult.map((row: any) => row.descendant_id);

            // 2. Delete all paths involving the member being removed (ancestor or descendant)
            this.logger.debug(`Deleting all paths involving member ${memberId} from ${closureTable}`);
            await queryRunner.query(
                `DELETE FROM ${closureTable} WHERE ancestor_id = $1 OR descendant_id = $1`,
                [memberId]
            );

            // 3. For each immediate disciple, re-insert their subtree paths *as if they are roots*
            //    (This assumes their downline structure remains intact relative to them)
            //    This step is complex and often avoided by simply letting them become roots
            //    or handling re-parenting manually outside this function.
            //    If ON DELETE CASCADE is used correctly, deleting the member record handles this.
            //    If only removing links, the downline becomes detached unless re-linked.
            //    Let's stick to the simpler approach: deleting links makes the downline roots.
            this.logger.warn(`Member ${memberId} removed. Their immediate disciples [${immediateDiscipleIds.join(', ')}] are now roots in this context unless re-parented.`);


            await queryRunner.commitTransaction();
            this.logger.log(`Committed transaction for removing member ${memberId} from hierarchy`);

        } catch (error) {
            this.logger.error(`Error removing member ${memberId} from hierarchy: ${error.message}`, error.stack);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(`Failed to remove member from hierarchy: ${error.message}`);
        } finally {
            await queryRunner.release();
            this.logger.log(`Released query runner for remove member from hierarchy`);
        }
    }


  // ==================================================
  // Scenario 9: Deleting a Member (and removing from hierarchy)
  // ==================================================
  async deleteMember(memberId: string, context?: any): Promise<void> {
    // Assumes ON DELETE CASCADE is set on the closure table foreign keys.
    // Deleting the member from the 'members' table will automatically clean up
    // all related rows in the dynamic closure table.

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const closureTable = this.quote(this.getDiscipleClosureTableName(context)); // For logging
    this.logger.log(`Starting transaction to delete member '${memberId}' and associated hierarchy links (Closure Table: ${closureTable})`);

    try {
      const member = await queryRunner.manager.findOneBy(Member, { id: memberId });
      if (!member) {
        throw new NotFoundException(`Member with ID ${memberId} not found.`);
      }

      // Deleting the main entity triggers cascades defined in the DB schema
      await queryRunner.manager.remove(Member, member);
      this.logger.debug(`Deleted member ${memberId}. DB Cascades should handle ${closureTable} cleanup.`);

      await queryRunner.commitTransaction();
      this.logger.log(`Committed transaction for deleting member ${memberId}`);

    } catch (error) {
      this.logger.error(`Error deleting member ${memberId}: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to delete member: ${error.message}`);
    } finally {
      await queryRunner.release();
      this.logger.log(`Released query runner for delete member`);
    }
  }

  // ==================================================
  // Helper: Find Members with No Discipler (Roots in this context)
  // ==================================================
  async findRootMembers(context?: any): Promise<Member[]> {
    const closureTable = this.quote(this.getDiscipleClosureTableName(context));
    // Find members who exist in the closure table (have self-reference)
    // but do not appear as descendants with depth > 0
    const sql = `
      SELECT mem.*
      FROM members mem
      JOIN ${closureTable} self_check ON self_check.ancestor_id = mem.id AND self_check.descendant_id = mem.id
      LEFT JOIN ${closureTable} parent_check ON parent_check.descendant_id = mem.id AND parent_check.depth > 0
      WHERE parent_check.ancestor_id IS NULL
    `;
    this.logger.debug(`Executing findRootMembers query on ${closureTable}`);
    const results = await this.dataSource.query(sql);
    return results as Member[];
  }
}
```

## 5. Module Integration

Integrate the service into your NestJS module.

```typescript
// src/member/member.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { DiscipleshipService } from './discipleship.service';
// import { DiscipleshipController } from './discipleship.controller'; // Optional

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]), // Only import the Member entity repository
  ],
  providers: [DiscipleshipService],
  // controllers: [DiscipleshipController], // Optional: If exposing via HTTP
  exports: [DiscipleshipService], // Export if used by other modules
})
export class MemberModule {} // Or a dedicated DiscipleshipModule
```

## 6. Conclusion

This tutorial provides a detailed guide for managing a discipleship hierarchy using a dynamically named Closure Table and raw SQL in NestJS. It includes a specific method `addRootDisciple` for adding members without a direct discipler into a specific hierarchy context. Remember the importance of transactions, validation (including cycle checks), and careful SQL construction when managing hierarchies this way.