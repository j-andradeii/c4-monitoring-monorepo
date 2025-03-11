
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ChurchCampusAdminPortalRoutingModule } from "./church-campus-admin-portal.routing.module";
import { ChurchCampusAdminPortalComponent } from "./church-campus-admin-portal.component";


@NgModule({
    imports:[
        SharedModule,
        ChurchCampusAdminPortalRoutingModule
    ],
    declarations:[
        ChurchCampusAdminPortalComponent
    ],
})
export class ChurchCampusAdminPortalModule { }