import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ResponsiveConfig } from "./responsive-config";
import { ChurchAdminUtilityService } from "../services/church-admin-utility.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { distinctUntilChanged } from "rxjs";


@UntilDestroy()
@Component({template: ''})
export abstract class AbstractHeaderResponsiveComponent implements OnInit{
    @ViewChild('sideNavBar') sideNavBar!: ElementRef<HTMLDivElement>;  
    
    readonly ResponsiveConfig = ResponsiveConfig;

    clientScrollWidth: number = 0;
    constructor(public churchAdminUtilityService: ChurchAdminUtilityService,
                public cd: ChangeDetectorRef) {
      
    }

    ngOnInit(): void {
       this.churchAdminUtilityService.documentWindowWidth$
       .pipe(
        untilDestroyed(this),
        distinctUntilChanged()
       )
       .subscribe((clientScrollWidth) => {
            this.clientScrollWidth = clientScrollWidth;
            this.cd.detectChanges();
       });
    }

    get sideNavBarWidth(): string {
        if(this.sideNavBar) {
            return `${this.sideNavBar.nativeElement.offsetWidth}px`;
        }
        return '0px';
    }


    get mainNavBarResponsiveWidth(): string {

        let sideBarWidth: string = '';

        if(this.sideNavBar) {
            sideBarWidth = `${(this.clientScrollWidth - this.sideNavBar.nativeElement.offsetWidth)}px`;
        }

        const responsiveBreakPointMap: [number, string][] = [
            [ResponsiveConfig.MEDIUM_BREAKPOINT, sideBarWidth],
        ];
        const breakpoint = responsiveBreakPointMap.find(([width]) => this.clientScrollWidth > width);
        return breakpoint ? breakpoint[1] : '100%';

    }


    showSideBar() {
        const adminSideBarToggle = !this.churchAdminUtilityService.adminSideBarToggle$.value;
        this.churchAdminUtilityService.adminSideBarToggle$.next(adminSideBarToggle);
    }

    inactiveSideBar() {
        const adminActivateSidebarToggle = !this.churchAdminUtilityService.adminActivateSidebarToggle$.value;
        this.churchAdminUtilityService.adminActivateSidebarToggle$.next(adminActivateSidebarToggle);
    }
}

