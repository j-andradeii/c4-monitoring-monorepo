import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChurchCampusStaffCommand, CreateChurchCampusStaffCommandDto } from "../cqrs/commands/create-church-campus-staff.command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource, QueryRunner } from "typeorm";
import { ChurchCampusStaff } from "../entities/church-campus-staff.entity";
import { ChurchCampussesRepository } from "../repositories/church-campus.repositories";
import { BadRequestException } from "@nestjs/common";
import { ChurchCampusStaffDto } from "@app/libs/dto/church/chuch-campus-staff.dto";

@CommandHandler(CreateChurchCampusStaffCommand)
export class CreateChurchCampusStaffHandler extends AbstractOrchestrator<CreateChurchCampusStaffCommandDto, ChurchCampusStaffDto> implements ICommandHandler<CreateChurchCampusStaffCommand> {
    
    constructor(
        protected readonly dataSource: DataSource,
        private readonly churchCampussesRepository: ChurchCampussesRepository) {
        super(dataSource);
    }

    execute(command: CreateChurchCampusStaffCommand): Promise<any> {
        return this.orchestrate(command.createChurchCampusStaffCommandDto)
    }

    protected async preProcess(request: CreateChurchCampusStaffCommandDto): Promise<CreateChurchCampusStaffCommandDto> {
        return await request;
    }

    protected async doProcess(request: CreateChurchCampusStaffCommandDto): Promise<any> {
            const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    
            // Start a transaction
            await queryRunner.connect(); // Establish a database connection
            await queryRunner.startTransaction();

            try {
                const churchCampus = await this.churchCampussesRepository.findOne(request.campus_id);
                const churchCampusStaff = new ChurchCampusStaff();
                churchCampusStaff.church_campus = churchCampus;
                churchCampusStaff.is_hierarchy_root = request.churchCampusStaffCreationDto.is_hierarchy_root;
                churchCampusStaff.role = request.churchCampusStaffCreationDto.role;
                // churchCampusStaff.member_id = request.member_id;

                const savedChurchCampusStaff = await queryRunner.manager.save(ChurchCampusStaff, churchCampusStaff);
                await queryRunner.commitTransaction();
                return savedChurchCampusStaff;
            } catch(error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }
    }

    protected postProcess(data: any): Promise<any> {
        return data;
    }

}