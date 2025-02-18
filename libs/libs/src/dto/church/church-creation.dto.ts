import { IsString } from "class-validator";

export enum ChurchCampusType {
    MAIN = 'MAIN',
    BRANCH = 'BRANCH',
}

export class ChurchCreationDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Timezone must be a string' })
    timezone: string;
}