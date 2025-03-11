import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategyService } from './shared/services/custom-preload-strategy.service';

const routes: Routes = [
  {
      path: '',
      pathMatch: 'full',
      redirectTo: 'signin'
  },
  {
    path: 'signin',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategyService
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
