import { IsString, IsUUID, IsEnum, IsOptional, ValidateNested, IsDefined, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ChurchCampusType } from '../church-campus-type.enum';
import { ChurchDto } from './church.dto';
import { ChurchCampusAddressCreationDto } from './church-campus-address.creation.dto';

/**
 * Data Transfer Object for Church Campus
 */
export class ChurchCampusDto {
    /**
     * Unique identifier for the church campus
     */
    @IsUUID()
    id: string;

    /**
     * Type of church campus (MAIN or BRANCH)
     */
    @IsEnum(ChurchCampusType)
    church_campus_type: ChurchCampusType;


    /**
     * Reference identifier for the church campus
     */
    @IsString()
    reference_id: string;

    /**
     * Optional tag line for the church campus
     */
    @IsString()
    @IsOptional()
    tag_line?: string;

    /**
     * Optional description of the church campus
     */
    @IsString()
    @IsOptional()
    description?: string;


    @IsDefined({ message: 'Church details are required' })
    @ValidateNested()
    @Type(() => ChurchDto)
    church: ChurchDto;


    @IsArray()
    @ValidateNested({ each: true }) // Validate each object in the array
    @Type(() => ChurchCampusAddressCreationDto)
    addresses: ChurchCampusAddressCreationDto[];
}