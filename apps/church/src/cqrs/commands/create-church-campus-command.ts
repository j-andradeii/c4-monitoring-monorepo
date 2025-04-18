import { ChurchCampusCreationDto } from "@app/libs";

export class CreateChurchCampusCommand {
    constructor(public churchCampusCreationDto: ChurchCampusCreationDto) {}
}