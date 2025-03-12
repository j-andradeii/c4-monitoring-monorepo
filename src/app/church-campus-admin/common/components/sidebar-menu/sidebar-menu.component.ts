import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent implements OnInit {
  sideBarItems: MenuItem[] = [];

  ngOnInit(): void {
    this.sideBarItems = [
      {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'External',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        },
        {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'External',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        },
        {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'External',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        },
        {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'External',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        },
        {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'External',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        },
        {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'External',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        },
        {
          label: 'Router',
          icon: 'pi pi-palette',
          items: [
              {
                  label: 'Installation',
                  icon: 'pi pi-eraser',
                  route: '/installation'
              },
              {
                  label: 'Configuration',
                  icon: 'pi pi-heart',
                  route: '/configuration'
              }
          ]
      },
      {
          label: 'Programmatic',
          icon: 'pi pi-link',
          command: () => {
          }
      },
      {
          label: 'Last',
          icon: 'pi pi-home',
          items: [
              {
                  label: 'Angular',
                    icon: 'pi pi-star',
                    url: 'https://angular.io/'
                },
                {
                    label: 'Vite.js',
                    icon: 'pi pi-bookmark',
                    url: 'https://vitejs.dev/'
                }
            ]
        }
    ];
  }
}
