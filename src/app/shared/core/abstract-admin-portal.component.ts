import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ChurchAdminUtilityService } from "../services/church-admin-utility.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ResponsiveConfig } from "./responsive-config";

@UntilDestroy()
@Component({template: ''})
export abstract class AbstractAdminPortalComponent implements OnInit, AfterViewInit{
    @ViewChild('mainDiv') mainDiv!: ElementRef<HTMLDivElement>;  
    @ViewChild('headerDiv') headerDiv!: ElementRef<HTMLDivElement>;
    @ViewChild('routerDiv') routerDiv!: ElementRef<HTMLDivElement>;
    @ViewChild('sideBarDiv') sideBarDiv!: ElementRef<HTMLDivElement>;

    readonly ResponsiveConfig = ResponsiveConfig;

    clientScrollWidth: number = 0;

    constructor(public churchAdminUtilityService: ChurchAdminUtilityService,
                public renderer: Renderer2,
                public cd: ChangeDetectorRef
    ) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.churchAdminUtilityService.documentWindowWidth$
        .pipe(
            untilDestroyed(this),
            distinctUntilChanged(),
        )
        .subscribe((clientScrollWidth) => {
            this.clientScrollWidth = clientScrollWidth;
            this.cd.detectChanges();
        });

        this.churchAdminUtilityService.documentWindowHeight$
        .pipe(
            untilDestroyed(this),
            distinctUntilChanged(),
        )
        .subscribe((documentWindowHeight) => {
            if(documentWindowHeight && this.headerDiv && this.routerDiv) {
                const headerHeight = this.headerDiv.nativeElement.offsetHeight;
                const height = documentWindowHeight - this.headerDiv.nativeElement.offsetHeight;
                this.routerDiv.nativeElement.style.height = `${height}px`;
                this.churchAdminUtilityService.headerHeight$.next(headerHeight);
                this.churchAdminUtilityService.routerDivHeight$.next(height);

                if(this.sideBarDiv) {
                    this.sideBarDiv.nativeElement.style.height = `${height}px`;
                    this.churchAdminUtilityService.sideBarDivHeight$.next(height);
                }
                this.cd.detectChanges();
            }
        });
    }

    
    @HostListener('window:resize') onResize() {
        this.updateWidth();
        this.updateHeight();
    }
  
    @HostBinding('style.width') get width() { 
        this.updateWidth();
        return 0;
    }

    @HostBinding('style.height') get height() { 
        this.updateHeight();
        return 0;
    }

    updateWidth() {
        const windowWidth = document.documentElement.clientWidth;
        this.churchAdminUtilityService.documentWindowWidth$.next(windowWidth);
    }

    updateHeight() {
        // this.churchAdminUtilityService.clientHeight$.next(document.documentElement.clientHeight);
        const windowHeight = document.documentElement.clientHeight;
        this.churchAdminUtilityService.documentWindowHeight$.next(windowHeight);
    }


    get mainNavBarResponsiveWidth(): string {
        let sideBarWidth: string = '';

        if(this.sideBarDiv) {
            sideBarWidth = `${(this.clientScrollWidth - this.sideBarDiv.nativeElement.offsetWidth)}px`;
        }

        const responsiveBreakPointMap: [number, string][] = [
            [ResponsiveConfig.MEDIUM_BREAKPOINT, sideBarWidth],
        ];
        const breakpoint = responsiveBreakPointMap.find(([width]) => this.clientScrollWidth > width);
        return breakpoint ? breakpoint[1] : '100%';

    }
}