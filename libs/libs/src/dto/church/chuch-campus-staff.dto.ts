import { IsString, IsUUID, IsBoolean, IsEnum, IsOptional, IsDefined, ValidateNested } from 'class-validator';
import { ChurchRole } from '../church-role.enum';
import { Type } from 'class-transformer';
import { ChurchCampusDto } from './church-campus.dto';

/**
 * Data Transfer Object for Church Campus Staff
 */
export class ChurchCampusStaffDto {
    id: string;
    member_id?: string;
    is_hierarchy_root: boolean;
    role: ChurchRole;
    church_campus_id: string;

    // @IsDefined({ message: 'Member details are required' })
    // @ValidateNested()
    // @Type(() => MemberCreationDto)
    // member: MemberDtp;


    @IsDefined({ message: 'ChurchCampusDto details are required' })
    @ValidateNested()
    @Type(() => ChurchCampusDto)
    churchCampus: ChurchCampusDto;
}