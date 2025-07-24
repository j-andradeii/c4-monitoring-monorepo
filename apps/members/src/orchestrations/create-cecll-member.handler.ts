import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCellMemberCommand } from "../cqrs/commands/create-cell-member.command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { MemberCreationDto } from "@app/libs";

@CommandHandler(CreateCellMemberCommand)
export class CreateCellMemberHandler extends AbstractOrchestrator<MemberCreationDto, any> implements ICommandHandler<CreateCellMemberCommand> {

    
    execute(command: CreateCellMemberCommand): Promise<any> {
        throw new Error("Method not implemented.");
    }
    protected preProcess(request: MemberCreationDto): Promise<MemberCreationDto> {
        throw new Error("Method not implemented.");
    }
    protected doProcess(request: MemberCreationDto): Promise<any> {
        throw new Error("Method not implemented.");
    }
    protected postProcess(data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }


}