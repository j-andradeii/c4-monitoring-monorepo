import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsUUID,
    IsOptional,
    IsEmail,
    IsDate,
    IsBase64,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MemberCreationDto {

    @IsString()
    @IsOptional()
    church_id?: string;

    @IsString()
    @IsOptional()
    church_campus_id?: string; // Optional based on nullable: true

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


    @IsDate({ message: 'Birthdate must be a valid date' })
    @Type(() => Date) // Ensure input is transformed to a Date object for validation
    @IsOptional()
    birthdate?: Date; // Optional based on nullable: true


}