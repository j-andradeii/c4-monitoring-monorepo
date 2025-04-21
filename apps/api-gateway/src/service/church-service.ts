import { Injectable, NotFoundException } from "@nestjs/common";
import { ChurchMicroserviceService } from "../microservices/church-microservice/church-microservice.service";
import { MembersMicroserviceService } from "../microservices/members-microservice/members-microservice.service";
import { ChurchCampusCreationDto } from "@app/libs";
import { ChurchCampusStaffCreationDto } from "@app/libs/dto/church/church-campus-staff-creation.dto";
import { Member } from "apps/members/src/entities/member.entity";
import { ChurchCampusStaff } from "apps/church/src/entities/church-campus-staff.entity";
import { ChurchCampusDto } from "@app/libs/dto/church/church-campus.dto";

@Injectable()
export class ChurchService {

    constructor( private readonly churchMicroserviceService: ChurchMicroserviceService,
                 private readonly membersMicroserviceService: MembersMicroserviceService) {}
    

    async getChurchCampusById(id: string): Promise<ChurchCampusDto> {
        return await this.churchMicroserviceService.getChurchCampusById(id);
    }

    async getChurches(page: number, limit: number) {
        return await this.churchMicroserviceService.getChurches(page, limit);
    }

    async healthCheck() {
        return await this.churchMicroserviceService.healthCheck();
    }

    async getChurchCampusStaffs(church_campus_id: string, page: number, limit: number): Promise<any> {
        try {

            const staffsResponse = await this.churchMicroserviceService.getChurchCampusStaffs(church_campus_id, null, null);

            const member_ids = staffsResponse.staffs
            .filter(staff => staff.member_id) // Filter out any null member_ids
            .map(staff => staff.member_id);

            const members = await this.membersMicroserviceService.getManyMembersByIds(member_ids);

            const memberMap = new Map();
            members.forEach(member => {
                memberMap.set(member.id, member);
            });
            
            // 5. Combine the data
            const enrichedStaffs = staffsResponse.staffs.map(staff => {
                const memberDetails = staff.member_id ? memberMap.get(staff.member_id) : null;
                
                return {
                    ...staff,
                    member: memberDetails, // Add the member details
                };
            });

            return {
                staffs: enrichedStaffs,
                total: staffsResponse.total
            } 
        } catch(error) {
            throw error;
        }
    }

    async createChurchCampus(churchCampusCreationDto: ChurchCampusCreationDto) {
        const churchCampus = await this.churchMicroserviceService.createChurchCampus(churchCampusCreationDto);
        const referenceId = churchCampus.reference_id;
        const memberCreate = await this.membersMicroserviceService.createChurchCampusClosure(referenceId);
        return churchCampus;
    }

    async createChurchCampusStaff(campus_id:string, churchCampusStaffCreationDto: ChurchCampusStaffCreationDto) {

        let member = null;
        let churchCampusStaff = null;
        try {
            const churchCampus =  await this.churchMicroserviceService.getChurchCampusById(campus_id);
            
            member = await this.membersMicroserviceService.createMember(churchCampus, churchCampusStaffCreationDto.member);
            const member_id = member.id;
            churchCampusStaff = await this.churchMicroserviceService.createChurchCampusStaff(campus_id, member_id, churchCampusStaffCreationDto);
            return {
                member,
                churchCampusStaff
            };
        } catch(error) {
            if(member) {
                await this.membersMicroserviceService.fallbackCreateMember(member.id)
            }

            throw error;
        }
    }

    async createChurchCampusHierarchyRoots(campus_id: string) {
  

        try {
            const staffsResponse = await this.churchMicroserviceService.getChurchCampusStaffs(campus_id, null, null);
            const rootStaffs = staffsResponse.staffs.filter((v)=>{
                return v.is_hierarchy_root;
            });

            const member_ids = rootStaffs
            .filter(staff => staff.member_id) // Filter out any null member_ids
            .map(staff => staff.member_id);

            console.log(member_ids);

            return rootStaffs;
        } catch(error) {
            throw error;
        }
    }

 
}