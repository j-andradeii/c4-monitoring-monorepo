import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class MemberSocialCreationDto {
    @IsString()
    social_media_type: string;

    @IsString()
    username: string;

    @IsString()
    name: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(255, { message: 'Email must not exceed 255 characters' })
    @IsOptional()
    email?: string; // Optional based on nullable: true

}