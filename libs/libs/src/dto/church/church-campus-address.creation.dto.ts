import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChurchCampusAddressCreationDto {
    @IsString()
    @IsNotEmpty({ message: 'Location name is required' })
    @MaxLength(255, { message: 'Location name must not exceed 255 characters' })
    location_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Street is required' })
    @MaxLength(255, { message: 'Street must not exceed 255 characters' })
    street: string;

    @IsString()
    @IsNotEmpty({ message: 'City is required' })
    @MaxLength(255, { message: 'City must not exceed 255 characters' })
    city: string;

    @IsString()
    @IsNotEmpty({ message: 'State is required' })
    @MaxLength(255, { message: 'State must not exceed 255 characters' })
    state: string;

    @IsString()
    @IsNotEmpty({ message: 'Zip code is required' })
    @MaxLength(255, { message: 'Zip code must not exceed 255 characters' })
    zip_code: string;
}