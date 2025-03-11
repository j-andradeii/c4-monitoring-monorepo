import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import MyPreset from './theme/my-preset';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppInterceptorService } from './shared/services/app-interceptor.service';
import { CustomPreloadingStrategyService } from './shared/services/custom-preload-strategy.service';
import { CryptoService } from './shared/services/crypto-service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorService,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: MyPreset,
        },
        
    }),
    CustomPreloadingStrategyService,
    CryptoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
