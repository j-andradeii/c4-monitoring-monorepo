import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { ChurchAdminUtilityService } from 'src/app/shared/services/church-admin-utility.service';


@UntilDestroy()
@Component({
  selector: 'app-overlay-sidebar',
  templateUrl: './overlay-sidebar.component.html',
  styleUrl: './overlay-sidebar.component.scss'
})
export class OverlaySidebarComponent implements OnInit {
  displayToggleSideBar: boolean = false;

  constructor(public churchAdminUtilityService: ChurchAdminUtilityService) {

  }

  ngOnInit(): void {
    this.churchAdminUtilityService.adminSideBarToggle$
    .pipe(
      untilDestroyed(this),
      debounceTime(50),
      distinctUntilChanged()
    )
    .subscribe((v)=>{
      this.displayToggleSideBar = v;
    })
  }

  onHide() {
    this.displayToggleSideBar = false;
    this.churchAdminUtilityService.adminSideBarToggle$.next(false);
  } 
}
