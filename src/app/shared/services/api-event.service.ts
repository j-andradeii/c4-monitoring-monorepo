import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiEvent } from '../model/api-event';


@Injectable({
  providedIn: 'root',
})
export class ApiEventService {
  public event = new BehaviorSubject<ApiEvent>(undefined);

  sendEvent(event: ApiEvent) {
    this.event.next(event);
  }

  // get event(): Observable<ApiEvent> {
  //   return this.currentEvent.asObservable();
  // }
}
