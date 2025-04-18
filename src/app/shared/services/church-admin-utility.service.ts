import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiEvent } from '../model/api-event';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ChurchAdminUtilityService {
    public headerHeight$ = new BehaviorSubject<number>(null);
    public routerDivHeight$ = new BehaviorSubject<number>(null);
    public routerDivWidth$ = new BehaviorSubject<number>(null);
    public sideBarDivHeight$ = new BehaviorSubject<number>(null);

    public documentWindowWidth$ = new BehaviorSubject<number>(undefined);
    public documentWindowHeight$ = new BehaviorSubject<number>(undefined);

    public adminSideBarToggle$ = new BehaviorSubject<boolean>(false);
    public adminActivateSidebarToggle$ = new BehaviorSubject<boolean>(true);


}