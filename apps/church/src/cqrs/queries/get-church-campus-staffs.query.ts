import { PaginationDto } from "@app/libs";


export class GetChuchCampusStaffsQuery {
    constructor(public id: string, public paginationDto: PaginationDto) {}
}