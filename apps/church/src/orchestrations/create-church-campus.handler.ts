import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChurchCampusCommand } from "../cqrs/commands/create-church-campus-command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { ChurchCampusCreationDto } from "@app/libs";
import { DataSource, QueryRunner } from "typeorm";
import { Church } from "../entities/church.entity";
import { ChurchCampus } from "../entities/church-campus.entity";
import { RandomNumberGeneratorService } from "../service/random-number-generator.service";
import { ChurchCampusClosureService } from "../service/church-campus-closure.service";

@CommandHandler(CreateChurchCampusCommand)
export class CreateChurchCampusHandler extends AbstractOrchestrator<ChurchCampusCreationDto, any> implements ICommandHandler<CreateChurchCampusCommand> {

    constructor(
        protected readonly dataSource: DataSource,
        private readonly randomNumberGeneratorService: RandomNumberGeneratorService,
        private readonly churchCampusClosureService: ChurchCampusClosureService
    ) {
        super(dataSource);
    }
  

    execute(command: CreateChurchCampusCommand): Promise<any> {
        return this.orchestrate(command.churchCampusCreationDto);
    }


    protected async preProcess(request: ChurchCampusCreationDto): Promise<ChurchCampusCreationDto> {
        return request;
    }
    
    protected async doProcess(request: ChurchCampusCreationDto): Promise<any> {

        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        // Start a transaction
        await queryRunner.connect(); // Establish a database connection
        await queryRunner.startTransaction();

        try {

            const createChurch = new Church();
            createChurch.name = request.church.name;
            createChurch.timezone = request.church.timezone;

            const church = await queryRunner.manager.save(Church, createChurch);

            const churchCampus = new ChurchCampus();
            churchCampus.church = church;
            churchCampus.church_campus_type = request.church_campus_type;
            churchCampus.reference_id = this.randomNumberGeneratorService.generateUnique8DigitNumber();
            const savedChurchCampus = await queryRunner.manager.save(ChurchCampus, churchCampus);


              // **Dynamically Create the Table**
            // await this.churchCampusClosureService.ensureChurchCampusClosureTable(queryRunner, savedChurchCampus.reference_id); //move this to members microservice
            
            await queryRunner.commitTransaction();
            return savedChurchCampus;
        } catch (error) {
            // Rollback the transaction in case of an error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner to free up resources
            await queryRunner.release();
        }
    }


    protected async postProcess(data: any): Promise<any> {
        return data;
    }

}   