import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCellMemberCommand } from "../cqrs/commands/create-cell-member.command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { MemberCreationDto } from "@app/libs";
import { DataSource, QueryRunner } from "typeorm";
import { ContactInfo } from "../entities/contact-info.entity";
import { MemberAddress } from "../entities/member-address.entity";
import { Member } from "../entities/member.entity";
import { SocialInfo } from "../entities/social-infos.entity";
import { ContactInfoType } from "../enums/contact-info.enum";
import { SocialMediaType } from "../enums/social-media.enum";
import { AffliationEnum } from "../model/affliation-enum";
import { CivilStatus } from "../model/civil-status.enum";
import { DiscipleshipService } from "../service/discipleship.service";

@CommandHandler(CreateCellMemberCommand)
export class CreateCellMemberHandler extends AbstractOrchestrator<MemberCreationDto, any> implements ICommandHandler<CreateCellMemberCommand> {

    constructor(protected readonly dataSource: DataSource,
                private discipleshipService: DiscipleshipService
    ) {
            super(dataSource);
    }


    execute(command: CreateCellMemberCommand): Promise<any> {
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
            member.gender = request.gender;
            member.affliation = AffliationEnum[request.affliation] || null;
            member.civil_status = CivilStatus[request.civil_status] || null;


            member.member_addresses = [];
            for(const addressRequestDto of request.member_addresses) {
                const memberAddress = new MemberAddress();
                memberAddress.city = addressRequestDto.city;
                memberAddress.street = addressRequestDto.street;
                member.member_addresses.push(memberAddress);
            }

            member.contact_infos = [];
            for(const contactDto of request.member_contacts) {
                const contactInfo = new ContactInfo();
                contactInfo.number = contactDto.number;
                contactInfo.contactInfoType = ContactInfoType[contactDto.contactInfoType];
                member.contact_infos.push(contactInfo);
            }

            member.social_infos = [];
            for(const socialDto of request.member_socials) {
                const socialInfo = new SocialInfo();
                socialInfo.name = socialDto.name;
                socialInfo.social_media_type = SocialMediaType[socialDto.social_media_type];
                socialInfo.username = socialDto.username;
                socialInfo.email = socialDto.email;
                member.social_infos.push(socialInfo)
            }
            const savedMember = await queryRunner.manager.save(Member, member);


            await this.discipleshipService.addRootDisciple(queryRunner, savedMember.id, request.reference_id)
            console.log(savedMember);
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