import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChurchService } from './shared/services/church.service';
import { CryptoService } from './shared/services/crypto-service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiEventService } from './shared/services/api-event.service';
import { ApiEvent, ApiEventType } from './shared/model/api-event';
import { ApiEventStatus } from './shared/model/api-event';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'gwc-monitoring-webapp';

  constructor(private churchService: ChurchService, private cryptoService: CryptoService, private apiEventService: ApiEventService) {
    // this.churchService.getChurches();
  }

  async ngOnInit(): Promise<void> {

    this.getApiEvents();
  }

  getApiEvents() {
    this.apiEventService.event
    .pipe(untilDestroyed(this))
    .subscribe((event)=>{
      if(!event) {
        return;
      }

      const EVENT_STATUS_FACTORY = this.eventStatusHandleMapFunction(event)[event.status];
      EVENT_STATUS_FACTORY();
    });
  }

  private eventStatusHandleMapFunction(apiEvent: ApiEvent):{ [key in ApiEventStatus]: () => void } {
    return  {
      [ApiEventStatus.COMPLETED]: (()=>{ 
        const eventTypeHandleMap = {
          [ApiEventType.GET_CHURCHES]: (async ()=>{
            this.apiEventService.sendEvent({
              type: ApiEventType.DEFAULT, 
              status: ApiEventStatus.DEFAULT, 
              title: "Church Successful",
              message: "Churches fetched successfully",
              toast: true, 
            });
          }),
        }
        const EVENT_TYPE_HANDLE_FACTORY = eventTypeHandleMap[apiEvent.type] || (()=>{});
        EVENT_TYPE_HANDLE_FACTORY();
      }),
      [ApiEventStatus.ERROR]: (()=>{ }), 
      [ApiEventStatus.IN_PROGRESS]: (()=>{   }), 
      [ApiEventStatus.DEFAULT]: (()=>{}) 
    }
  }
  
 
}
