import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractDefaultComponent } from 'src/app/shared/core/abstract-default-component';


@UntilDestroy()
@Component({
  selector: 'app-church-campus-dashboard',
  templateUrl: './church-campus-dashboard.component.html',
  styleUrl: './church-campus-dashboard.component.scss'
})
export class ChurchCampusDashboardComponent extends AbstractDefaultComponent {

  setBreadcrumbs(): void {
    this.breadcrumbsService.breadcrumbItems$.next([
      { label: 'Dashboard', routerLink: '/church-campus-admin/dashboard' },
    ]);
  }
}
