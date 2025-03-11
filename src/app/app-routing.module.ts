import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategyService } from './shared/services/custom-preload-strategy.service';

const routes: Routes = [
  {
      path: '',
      pathMatch: 'full',
      redirectTo: ''
  },
  {
    path: 'signin',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: '',
    loadChildren: () => import('./public-pages/public-pages.portal.module').then(m => m.PublicPagesPortalModule)
  },
  {
    path: 'church-campus-admin',
    loadChildren: () => import('./church-campus-admin/church-campus-admin-portal.module').then(m => m.ChurchCampusAdminPortalModule)
  },
  {
    path: '**',
    redirectTo: '' // Replace '' with your default route 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategyService,
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
