import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ChurchAdminUtilityService } from 'src/app/shared/services/church-admin-utility.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, timeout } from 'rxjs';
import { ResponsiveConfig } from 'src/app/shared/core/responsive-config';
import { Accordion } from 'primeng/accordion';

@UntilDestroy()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit { 

  @ViewChild('sidebarBodyDiv') sidebarBodyDiv!: ElementRef<HTMLDivElement>;  
  @ViewChild('sidebarHeaderDiv') sidebarHeaderDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('accordion') accordion!: Accordion;


  items: MenuItem[] | undefined;

  mainHeaderHeight: number = 0;
  sideBarDivHeight: number = 0;


  hiddenDivValue: number = 0;
  constructor(public churchAdminUtilityService: ChurchAdminUtilityService,
              private cdr: ChangeDetectorRef,
              private appRef: ApplicationRef,
              private ngZone: NgZone) {

  }

  get getSideBarHeaderHeight(): string {
    return this.sidebarHeaderDiv ? `${this.sidebarHeaderDiv.nativeElement.offsetHeight }px` : '0px';
  }

  ngOnInit() {
    this.churchAdminUtilityService.headerHeight$
    .pipe(
      untilDestroyed(this),
      distinctUntilChanged(),
    )
    .subscribe((headerHeight) => {
      this.mainHeaderHeight = headerHeight;
    });


    this.churchAdminUtilityService.sideBarDivHeight$
    .pipe(
      untilDestroyed(this),
      distinctUntilChanged(),
    )
    .subscribe((sideBarDivHeight) => {
      this.sideBarDivHeight = sideBarDivHeight;
    });


    this.items = [
      { label: 'Settings', icon: 'pi pi-cog' },
      { label: 'Log-out', icon: 'pi pi-sign-out' }
    ];




  }

  get calculateSideBarBodyHeight(): string {
    if(this.sidebarBodyDiv && this.sidebarHeaderDiv) {
      const height = this.sideBarDivHeight - this.sidebarHeaderDiv.nativeElement.offsetHeight;
      return  `${height}px`;
    }

    return `50vh`;
  }

  updateSideBarBodyheight(ev) {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        if (this.sidebarBodyDiv && this.sidebarHeaderDiv) {
          const computedHeight = ev ? 144 : ResponsiveConfig.NAVBAR_HEADER_HEIGHT;
          const height = this.sideBarDivHeight - computedHeight;
          
          this.sidebarBodyDiv.nativeElement.style.height = `${height}px`;
          
          // Trigger change detection manually after DOM update
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        }
      }, 0);
    });
  }

}
