import { ICommandHandler } from "@nestjs/cqrs";

import { CommandHandler } from "@nestjs/cqrs";
import { CreateChurchCommand } from "../cqrs/commands/create-church-command";
import { AbstractOrchestrator } from "./abstract-orchestrator";
import { delay } from "apps/church/core/delay";

@CommandHandler(CreateChurchCommand)
export class CreateChurchHandler extends AbstractOrchestrator<any, any> implements ICommandHandler<CreateChurchCommand> {
   
    execute(command: CreateChurchCommand): Promise<any> {
    console.log("CreateChurchHandler execute", command);
       return this.orchestrate(command);
    }

    protected async preProcess(request: any): Promise<any> {
       console.log("CreateChurchHandler preProcess", request);
       return request;
    }
    protected doProcess(request: any): Promise<any> {
        console.log("CreateChurchHandler doProcess", request);
        return request;
    }
    protected postProcess(data: any): Promise<any> {
        console.log("CreateChurchHandler postProcess", data);
        return data;
    }

}