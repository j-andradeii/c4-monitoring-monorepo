import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChurchCampusAdminPortalComponent } from "./church-campus-admin-portal.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: ChurchCampusAdminPortalComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./church-campus-dashboard/church-campus-dashboard.module').then(m => m.ChurchCampusDashboardModule),
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChurchCampusAdminPortalRoutingModule { }

