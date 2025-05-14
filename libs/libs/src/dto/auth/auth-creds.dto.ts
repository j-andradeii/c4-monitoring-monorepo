import { Member } from "apps/members/src/entities/member.entity";
import { ChurchCampusStaffDto } from "../church/chuch-campus-staff.dto";
import { MemberDto } from "../member/member.dto";

export interface AuthCredsDto {
    email: string;
    password: string;
    username?: string;
}

export interface AuthDto {
    access_token: string;
    refresh_token: string;
}

export interface SelfInformationDto {
    member: MemberDto;
    church_campus_staff: ChurchCampusStaffDto;
}