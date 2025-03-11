import { Injectable } from "@angular/core";
import { AbstractHttpHandler } from "./abstract-http-handler.service";
import { ApiEventService } from "./api-event.service";
import { HttpClient } from "@angular/common/http";
import { ApiEventStatus, ApiEventType } from "../model/api-event";
import { Messages } from "../core/messages";
import { Router } from "@angular/router";
import { catchError } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ChurchService extends AbstractHttpHandler {

    constructor(
        http: HttpClient,
        apiEventsService: ApiEventService,
        private router: Router ) {
        super(http, apiEventsService);
    }

    getChurches() {
        const url = `churches`;
        const eventType = ApiEventType.GET_CHURCHES;
        this.apiEventsService.sendEvent({type: eventType, status: ApiEventStatus.IN_PROGRESS, spinner: true});

        this.http.get<any>(url)
        .pipe(catchError(this.handleErrors(eventType, [])))
        .subscribe((response: any)=>{
            console.log(response);
            this.apiEventsService.sendEvent({ type: eventType, status: ApiEventStatus.COMPLETED, spinner: false });
        })
    }


    protected override handleErrors<T>(eventType: ApiEventType, response?: T): (error: any) => T {
        return (error: any): T => {
            let title = Messages.HEADER_GENERIC_ERROR;
            let message = Messages.MESSAGE_GENERIC_ERROR;
            let showToast = true;
            let showSpinner = true;

            const errorMessage = error.error;


            if(errorMessage && errorMessage.statusCode === 401 && errorMessage.error === "Unauthorized") {
                title = Messages.HEADER_AUTHENTICATION_FAILED_ERROR;
                message = Messages.MESSAGE_EXPIREED_REFRESH_TOKEN;
            }   
             else if(errorMessage && errorMessage.statusCode === 500) {
                title = Messages.HEADER_ACCESS_RESTRICTED;
                message = "error"
            }

            this.apiEventsService.sendEvent({
                type: eventType,
                status: ApiEventStatus.ERROR,
                title,
                message,
                toast: showToast,
                spinner: showSpinner
            });
            return response as T;
          };
    }
}