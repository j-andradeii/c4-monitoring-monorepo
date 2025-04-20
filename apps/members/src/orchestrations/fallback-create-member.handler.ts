import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { FallbackCreateMemberCommand } from "../cqrs/commands/fallback-create-member.command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource, QueryRunner } from "typeorm";
import { Member } from "../entities/member.entity";

@CommandHandler(FallbackCreateMemberCommand)
export class FallbackCreateMemberHandler extends AbstractOrchestrator<string, any> implements ICommandHandler<FallbackCreateMemberCommand> {


    constructor(protected readonly dataSource: DataSource) {
        super(dataSource);
    }

    
    execute(command: FallbackCreateMemberCommand): Promise<any> {
        return this.orchestrate(command.member_id);
    }

    protected async preProcess(request: string): Promise<string> {
        return request;
    }
    protected async doProcess(request: string): Promise<any> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
               // Start a transaction
        await queryRunner.connect(); // Establish a database connection
        await queryRunner.startTransaction();

        try {
            const deleteResult = await queryRunner.manager.delete(Member, { id: request });
      
            // Check if any rows were affected
            const success = deleteResult.affected > 0;
            
            // If successful, commit the transaction
            await queryRunner.commitTransaction();
            
            return success;
        } catch (error) {
            // Rollback the transaction in case of an error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner to free up resources
            await queryRunner.release();
        }
        
    }
    protected postProcess(data: any): Promise<any> {
      return data;
    }

}