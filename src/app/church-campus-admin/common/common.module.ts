
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavBreadcrumbsComponent } from './components/nav-breadcrumbs/nav-breadcrumbs.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';



@NgModule({
    imports:[
        SharedModule,
    ],
    declarations:[
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        NavBreadcrumbsComponent,
        SidebarMenuComponent,
    ],
    exports:[
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        NavBreadcrumbsComponent,
        SidebarMenuComponent
    ]
})
export class ChurchCampusAdminCommonModule { }