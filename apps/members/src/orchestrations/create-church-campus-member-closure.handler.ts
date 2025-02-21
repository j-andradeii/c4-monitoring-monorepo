import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChurchCampusMemberClosureCommand } from "../cqrs/commands/create-church-campus-member-closure.command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource, QueryRunner } from "typeorm";
import { ChurchCampusClosureService } from "../service/church-campus-closure.service";

@CommandHandler(CreateChurchCampusMemberClosureCommand)
export class CreateChurchCampusMemberClosureHandler extends AbstractOrchestrator<any, any> implements ICommandHandler<CreateChurchCampusMemberClosureCommand> {


    constructor(protected readonly dataSource: DataSource,
                private readonly churchCampusClosureService: ChurchCampusClosureService) {
        super(dataSource);
    }

    execute(command: CreateChurchCampusMemberClosureCommand): Promise<any> {
        return this.orchestrate(command.referenceId);
    }

    protected preProcess(request: any): Promise<any> {
        return request;
    }
    protected async doProcess(request: any): Promise<any> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        // Start a transaction
        await queryRunner.connect(); // Establish a database connection
        await queryRunner.startTransaction();

        try {
            await this.churchCampusClosureService.ensureChurchCampusClosureTable(queryRunner, request); //move this to members microservice
            await queryRunner.commitTransaction();

        } catch (error) {
            // Rollback the transaction in case of an error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner to free up resources
            await queryRunner.release();
        }

        return request;
    }
    protected async  postProcess(data: any): Promise<any> {
        return {
                message: "Church Campus Closure Created"
        };  
    }

}