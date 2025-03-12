import { Component } from '@angular/core';
import { AbstractAdminPortalComponent } from '../shared/core/abstract-admin-portal.component';
import { UntilDestroy } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-church-campus-admin-portal',
  templateUrl: './church-campus-admin-portal.component.html',
  styleUrl: './church-campus-admin-portal.component.scss'
})
export class ChurchCampusAdminPortalComponent extends AbstractAdminPortalComponent  {


}
