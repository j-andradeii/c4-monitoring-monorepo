import { MemberCreationDto } from "@app/libs/dto/member/member.creation.dto";

export class CreateMemberCommand {
    constructor(public memberCreationDto: MemberCreationDto) {}
}
