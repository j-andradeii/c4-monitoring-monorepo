import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

export enum SideBarItemType {
    HEADER= "HEADER",
    ITEM= "ITEM",
}

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent implements OnInit {

  readonly SideBarItemType = SideBarItemType;  
  sideBarItems: MenuItem[] = [];

  ngOnInit(): void {
    this.sideBarItems = [
      {
        id: SideBarItemType.HEADER,
        label: 'Home',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Dashboard',
        icon: 'pi pi-palette',
        route: 'dashboard',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Church Information',
        icon: 'pi pi-palette',
        items: [
          {
            id: SideBarItemType.ITEM,
            label: 'Church Detail',
            icon: 'pi pi-palette',
            route: 'church-detail',
          },
          {
            id: SideBarItemType.ITEM,
            label: 'Pastoral Staffs',
            icon: 'pi pi-palette',
            route: 'church-detail',
          }
        ]
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Campaigns',
        icon: 'pi pi-palette',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'Members',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Gateway Church Members',
        icon: 'pi pi-palette',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'WINNING',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Prayer of 3',
        icon: 'pi pi-palette',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Evangelism',
        icon: 'pi pi-palette',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'CONSOLIDATION',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Life Change',
        icon: 'pi pi-palette',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'GATEWAY EVENTS',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Events',
        icon: 'pi pi-palette',
        route: 'church-detail',
      },
    ];
  }
}
