import { ValidateNested, IsDefined, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberCreationDto } from '../member/member.creation.dto'; // Adjust path if necessary
import { ChurchRole } from '../church-role.enum';

// Define or import the ChurchRole enum
// If it exists elsewhere (e.g., libs/common/enums), import it instead:
// import { ChurchRole } from '@app/common/enums/church-role.enum';

export class ChurchCampusStaffCreationDto {
    @IsDefined({ message: 'Member details are required' })
    @ValidateNested()
    @Type(() => MemberCreationDto)
    member: MemberCreationDto;

    @IsBoolean({ message: 'is_hierarchy_root must be a boolean value' })
    is_hierarchy_root?: boolean; // Optional, defaults to false in entity

    @IsEnum(ChurchRole, { message: 'Role must be a valid ChurchRole enum value' })
    role: ChurchRole = ChurchRole.PASTOR; // Optional, defaults to PASTOR in entity
}