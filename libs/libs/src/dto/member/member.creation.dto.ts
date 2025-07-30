import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsUUID,
    IsOptional,
    IsEmail,
    IsDate,
    IsBase64,
    IsDefined,
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderEnum } from '../gender-enum';
import { MemberAddressCreationDto } from './member-address.creation.dto';
import { MemberContactCreationDto } from './member-contact.creation.dto';
import { MemberSocialCreationDto } from './member-social.creation.dto';

export class MemberCreationDto {

    @IsString()
    @IsOptional()
    church_id?: string;

    @IsString()
    @IsOptional()
    church_campus_id?: string; // Optional based on nullable: true

    @IsString()
    @IsOptional()
    reference_id?: string; // Optional based on nullable: true

    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MaxLength(255, { message: 'First name must not exceed 255 characters' })
    first_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MaxLength(255, { message: 'Last name must not exceed 255 characters' })
    last_name: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(255, { message: 'Email must not exceed 255 characters' })
    @IsOptional()
    email?: string; // Optional based on nullable: true

    @IsBase64()
    @IsOptional()
    photo?: string; // Optional based on nullable: true

    @IsString()
    @IsOptional()
    gender?: GenderEnum;

    @IsString()
    @IsOptional()
    affliation?: string;

    @IsString()
    @IsOptional()
    civil_status?: string;

    @IsDate({ message: 'Birthdate must be a valid date' })
    @Type(() => Date) // Ensure input is transformed to a Date object for validation
    @IsOptional()
    birthdate?: Date; // Optional based on nullable: true


    @IsOptional() // Allows the field to be absent or an empty array
    @IsArray({ message: 'Member addresses must be an array' }) // Still ensure 
    @ValidateNested({ each: true }) // Validate each object in the array
    @Type(() => MemberAddressCreationDto)
    member_addresses: MemberAddressCreationDto[];

    @IsOptional() // Allows the field to be absent or an empty array
    @IsArray({ message: 'Member Contact must be an array' }) // Still ensure 
    @ValidateNested({ each: true }) // Validate each object in the array
    @Type(() => MemberContactCreationDto)
    member_contacts: MemberContactCreationDto[];


    @IsOptional() // Allows the field to be absent or an empty array
    @IsArray({ message: 'Member Contact must be an array' }) // Still ensure 
    @ValidateNested({ each: true }) // Validate each object in the array
    @Type(() => MemberSocialCreationDto)
    member_socials: MemberSocialCreationDto[];


}