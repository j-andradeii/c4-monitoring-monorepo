import { ChurchCampusStaffCreationDto } from "@app/libs/dto/church/church-campus-staff-creation.dto";

export interface CreateChurchCampusStaffCommandDto {
    campus_id: string;
    member_id: string;
    churchCampusStaffCreationDto: ChurchCampusStaffCreationDto
}

export class CreateChurchCampusStaffCommand {
    constructor(public createChurchCampusStaffCommandDto: CreateChurchCampusStaffCommandDto) {}
}