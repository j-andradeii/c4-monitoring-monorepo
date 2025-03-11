
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ChurchCampusDashboardComponent } from "./church-campus-dashboard.component";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
    {
        path: '',
        component: ChurchCampusDashboardComponent
    }
];


@NgModule({
    imports:[
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        ChurchCampusDashboardComponent
    ],
})
export class ChurchCampusDashboardModule { }