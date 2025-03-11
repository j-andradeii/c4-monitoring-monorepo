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
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
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
