import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    imports:[
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        DashboardComponent,
    ],
})
export class DashboardModule { }