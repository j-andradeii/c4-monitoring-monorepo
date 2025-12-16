import { MemberCreationDto } from "@app/libs/dto/member/member.creation.dto";

export class CreateCellMemberCommand {
    constructor(public memberCreationDto: MemberCreationDto) {}
}
