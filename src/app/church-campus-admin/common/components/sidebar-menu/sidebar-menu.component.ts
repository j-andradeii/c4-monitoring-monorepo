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
        label: 'Church Information',
      },
      {
          id: SideBarItemType.ITEM,
          title: 'Router 1',	
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  id: SideBarItemType.ITEM,
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  id: SideBarItemType.ITEM,
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
    ];
  }
}
