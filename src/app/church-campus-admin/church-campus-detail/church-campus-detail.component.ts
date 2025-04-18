import { Component, OnDestroy } from '@angular/core';
import { AbstractDefaultComponent } from 'src/app/shared/core/abstract-default-component';

@Component({
  selector: 'app-church-campus-detail',
  templateUrl: './church-campus-detail.component.html',
  styleUrl: './church-campus-detail.component.scss'
})
export class ChurchCampusDetailComponent  extends AbstractDefaultComponent{


  override setBreadcrumbs(): void {
    this.breadcrumbsService.breadcrumbItems$.next([
      { label: 'Church Detail', routerLink: '/church-campus-admin/church-detail' },
    ]);
  }

  ngOnDestroy(): void {
    
  }

}
