import { Component, OnInit } from '@angular/core';
import { ApiEventService } from '../../services/api-event.service';
import { MessageService } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiEventStatus } from '../../model/api-event';

@UntilDestroy()
@Component({
  selector: 'app-gwc-toast',
  templateUrl: './gwc-toast.component.html',
  styleUrl: './gwc-toast.component.scss'
})
export class GwcToastComponent implements OnInit{

  constructor(private apiEventsService: ApiEventService,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.subscribeToApiEvents();
  }

  private subscribeToApiEvents(): void {
    this.apiEventsService.event
      .pipe(untilDestroyed(this))
      .subscribe((event) => {

        if ( event && event.toast && !event.popup && 
            (event.status === ApiEventStatus.COMPLETED ||
             event.status === ApiEventStatus.DEFAULT ||
             event.status === ApiEventStatus.ERROR)) {
             const apiStatusMap = {
                [ApiEventStatus.COMPLETED]: 'success',
                [ApiEventStatus.ERROR]: 'error',
                [ApiEventStatus.DEFAULT]: 'info',
            };
            this.messageService.add({severity: apiStatusMap[event.status] || 'info', summary: event.title, detail: event.message});
        }
      })
  }

}