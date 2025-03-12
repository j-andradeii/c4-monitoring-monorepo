import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuItem } from 'primeng/api';
import { distinctUntilChanged } from 'rxjs';
import { BreadcrumbsService } from 'src/app/shared/services/breadcrumbs.service';
  

@UntilDestroy()
@Component({
  selector: 'app-nav-breadcrumbs',
  templateUrl: './nav-breadcrumbs.component.html',
  styleUrl: './nav-breadcrumbs.component.scss'
})
export class NavBreadcrumbsComponent implements OnInit {
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/church-campus-admin' };
  items: MenuItem[] = [];


  constructor(private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.breadcrumbsService.breadcrumbItems$
    .pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    )
    .subscribe((items) => {
      this.items = items;
    });
  }
}
