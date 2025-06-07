import { IsString } from "class-validator";

export class MemberAddressCreationDto {
    @IsString()
    street: string;
    
    @IsString()
    city: string;
}