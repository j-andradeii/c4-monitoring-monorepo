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
        icon: 'assets/svgs/dashboard.svg',
        route: 'dashboard',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Church Information',
        icon: 'assets/svgs/information.svg',
        items: [
          {
            id: SideBarItemType.ITEM,
            label: 'Church Detail',
            icon: 'assets/svgs/church-info.svg',
            route: 'church-detail',
          },
          {
            id: SideBarItemType.ITEM,
            label: 'Pastoral Staffs',
            icon: 'assets/svgs/pastoral-staff-2.svg',
            route: 'church-detail',
          }
        ]
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Campaigns',
        icon: 'assets/svgs/campaigns.svg',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'Members',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Gateway Church Members',
        icon: 'assets/svgs/members.svg',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'WINNING',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Prayer of 3',
        icon: 'assets/svgs/prayer-of-3.svg',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Evangelize',
        icon: 'assets/svgs/evangelism-2.svg',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'CONSOLIDATION',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Life Change',
        icon: 'assets/svgs/consolidation.svg',
        route: 'church-detail',
      },
      {
        id: SideBarItemType.HEADER,
        label: 'GATEWAY EVENTS',
      },
      {
        id: SideBarItemType.ITEM,
        label: 'Events',
        icon: 'assets/svgs/events.svg',
        route: 'church-detail',
      },
    ];
  }
}
