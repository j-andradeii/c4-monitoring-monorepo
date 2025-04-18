
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { ChurchCampusDetailComponent } from "./church-campus-detail.component";


const routes: Routes = [
    {
        path: '',
        component: ChurchCampusDetailComponent
    }
];


@NgModule({
    imports:[
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        ChurchCampusDetailComponent
    ],
})
export class ChurchCampusDetailModule { }