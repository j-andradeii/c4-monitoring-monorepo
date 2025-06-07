import { IsString } from "class-validator";

export class MemberContactCreationDto {
    @IsString()
    contactInfoType: string;
    
    @IsString()
    number: string;
}