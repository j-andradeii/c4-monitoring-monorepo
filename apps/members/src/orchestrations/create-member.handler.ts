import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMemberCommand } from "../cqrs/commands/create-member.command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { DataSource, QueryRunner } from "typeorm";
import { Member } from "../entities/member.entity";
import { MemberCreationDto } from "@app/libs/dto/member/member.creation.dto";

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler extends AbstractOrchestrator<MemberCreationDto, any> implements ICommandHandler<CreateMemberCommand> {

    constructor(protected readonly dataSource: DataSource) {
        super(dataSource);
    }
    
    execute(command: CreateMemberCommand): Promise<MemberCreationDto> {
        return this.orchestrate(command.memberCreationDto);
    }


    protected async preProcess(request: MemberCreationDto): Promise<MemberCreationDto> {
        return request;
    }

    protected async doProcess(request: MemberCreationDto): Promise<any> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        // Start a transaction
        await queryRunner.connect(); // Establish a database connection
        await queryRunner.startTransaction();

        try {
            // await this.churchCampusClosureService.ensureChurchCampusClosureTable(queryRunner, request); //move this to members microservice
            const member = new Member();
            member.first_name = request.first_name;
            member.last_name = request.last_name;
            member.email = request.email;
            member.birthdate = request.birthdate;
            member.church_campus_id = request.church_campus_id;
            member.church_id = request.church_id;

            const savedMember = await queryRunner.manager.save(Member, member);

            await queryRunner.commitTransaction();
            return savedMember;
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