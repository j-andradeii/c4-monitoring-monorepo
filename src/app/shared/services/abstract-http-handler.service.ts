import { Injectable, OnDestroy } from "@angular/core";
import { ApiEventService } from "./api-event.service";
import {HttpClient} from '@angular/common/http';
import { LocalStorageControl } from "../core/local-storage.conrol";
import { ApiEventStatus, ApiEventType } from "../model/api-event";
import { BehaviorSubject } from "rxjs";
import { Messages } from "../core/messages";

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractHttpHandler {

    protected authenticatedUser$ = new BehaviorSubject<any>(null);

    protected abstract handleErrors<T>(
      eventType: ApiEventType,
      response?: T,
    ): (error: any) => T;
  
    // protected abstract unAuthorizedHandler(error:any)

    constructor(
      public http: HttpClient,
      public apiEventsService: ApiEventService,
    ) {}


    protected clearLocalStorage(): void { 
        LocalStorageControl.clear();
    }
    
    async logout(showToast: boolean = true, showSpinner: boolean = false, status: ApiEventStatus = ApiEventStatus.ERROR) {
     this.clearLocalStorage();
     this.authenticatedUser$.next(null);
     this.apiEventsService.sendEvent({
          type: ApiEventType.SIGN_OUT,
          status: status,
          message: Messages.MESSAGE_LOGOUT_SUCCESSFUL,
          toast: showToast,
          spinner: showSpinner 
     });
    }

  }
  