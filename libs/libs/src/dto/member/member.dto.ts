import { Type } from "class-transformer";
import { IsUUID, IsOptional, IsString, MaxLength, IsEmail, IsDate } from "class-validator";

export class MemberDto {
    @IsUUID()
    id: string;

    @IsUUID()
    church_id: string;

    @IsOptional()
    @IsUUID()
    auth_id?: string; // Corresponds to nullable: true

    @IsOptional()
    @IsUUID()
    church_campus_id?: string; // Corresponds to nullable: true

    @IsString()
    @MaxLength(255)
    first_name: string;

    @IsString()
    @MaxLength(255)
    last_name: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string; // Corresponds to nullable: true

    @IsOptional()
    @Type(() => Date) // For proper transformation from request payloads
    @IsDate()
    birthdate?: Date; // Corresponds to nullable: true
}