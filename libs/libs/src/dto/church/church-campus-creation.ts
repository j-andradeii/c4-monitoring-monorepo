import { IsString, IsInt, Min, Max, ValidateNested, MinLength, IsDefined, IsEnum } from 'class-validator';
import { ChurchCreationDto } from "./church-creation.dto";
import { Type } from 'class-transformer';

enum ChurchCampusType {
    MAIN = 'MAIN',
    BRANCH = 'BRANCH',
}


export class ChurchCampusCreationDto {
    @IsEnum(ChurchCampusType, { message: 'Church campus type must be a valid enum value' })
    @IsString({ message: 'Church campus type is required' })
    church_campus_type: ChurchCampusType;


    @IsDefined({ message: 'Church is required' }) // Ensure address is required
    @ValidateNested() // Validate the nested DTO
    @Type(() => ChurchCreationDto) // This tells class-transformer to transform the object into the DTO
    church: ChurchCreationDto;

}