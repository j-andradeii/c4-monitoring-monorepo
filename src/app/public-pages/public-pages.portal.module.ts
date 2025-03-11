import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { PublicPagesPortalRoutingModule } from "./public-pages-portal-routing.module";
import { PublicPagesPortalComponent } from './public-pages-portal/public-pages-portal.component';

@NgModule({
    imports:[
        SharedModule,
        PublicPagesPortalRoutingModule
    ],
    declarations:[
        PublicPagesPortalComponent,
    ],
})
export class PublicPagesPortalModule { }