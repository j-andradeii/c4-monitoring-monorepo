import { PaginationDto } from "@app/libs";

export class GetChurchesQuery {
    constructor(public paginationDto: PaginationDto) {}
}