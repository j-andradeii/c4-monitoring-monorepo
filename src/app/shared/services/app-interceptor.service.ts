import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { catchError, Observable, switchMap, throwError, from } from "rxjs";
import { ApiEventService } from "./api-event.service";
import { Router } from "@angular/router";
import { LocalStorageControl } from "../core/local-storage.conrol";
import { GWCFormatDate } from "../core/date-format";
import { CONST } from "../core/constants";
import { environment } from "src/environments/environment";
import { CryptoService } from "./crypto-service";
import { toPromise } from "../core/toPromise";

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class AppInterceptorService implements HttpInterceptor {
    private readonly AUTH_URLS = ['auth', 'token'];
    private readonly API_URL_REGEX = new RegExp('.*');

    constructor(private router: Router,
        private apiEventsService: ApiEventService,
        private cryptoService: CryptoService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.doIntercept(req, next))
    }

    private async doIntercept(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        req = this.processRequestUrl(req);
        req = this.addAuthorizationHeader(req);
        req = this.addLocalTimeZoneHeader(req);
        req = this.addContentTypeHeader(req);
        req = await this.addAccessTokenHeader(req);

        return await this.handleRequest(req, next);
    }

    private async handleRequest(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
      try {
        return await toPromise(next.handle(request));
      } catch (error) {
        return await toPromise(this.handleError(error, request, next));
      }
    }


    private processRequestUrl(req: HttpRequest<any>): HttpRequest<any> {
      const matcher = this.API_URL_REGEX.exec(req.url);
      if (matcher) {
        const apiBaseUrlIsAbsent = !matcher[1];
        if (apiBaseUrlIsAbsent) {
          req = req.clone({ url: `${environment.API_URL}/${req.url}` });
        }
      }
      return req;
    }

    private addContentTypeHeader(req: HttpRequest<any>): HttpRequest<any> {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      req = req.clone({
        headers: req.headers.set('Content-Type', `application/json`).set('Accept-Language', 'en')
      });
      return req;
    }

    private addLocalTimeZoneHeader(req: HttpRequest<any>): HttpRequest<any> {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      req = req.clone({
        headers: req.headers.set('locale_timezone', `${timezone}`).set('Accept-Language', 'en')
      });
      return req;
    }

    private async addAccessTokenHeader(req: HttpRequest<any>): Promise<HttpRequest<any>> {
      const x_access_token = await this.cryptoService.encrypt(environment.X_ACCESS_TOKEN_KEY);
      const utcMillis = GWCFormatDate.getUtcMillis();
      const x_access = await this.cryptoService.encrypt(`${utcMillis}`);
      // console.log("d", this.encryptionService.decrypt(encryptedToken));
      req = req.clone({
        headers: req.headers
          .set(environment.X_ACCESS_TOKEN_KEY_HEADER, x_access_token)
          .set(environment.X_ACCESS_HEADER, x_access)
      });
      return req;
    }

    private addAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
      if (!this.isAuthUrl(req.url)) {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MTYyMTIzMSwiZXhwIjoxNzQyMjI2MDMxfQ.UOtOotmeWS46HGZ7YQfhHageu8PmqpCDvkrPR3M0whs'; //LocalStorageControl.get(CONST.ACCESS_TOKEN);
        if (token) {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`).set('Accept-Language', 'en')
          });
        }
      }
      return req;
    }

    private isAuthUrl(url: string): boolean {
      return this.AUTH_URLS.some(authUrl => url.includes(authUrl));
    }

    private handleError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (error instanceof HttpErrorResponse && error.status === 401) {
      //   if (error.error && error.error.message === "Expired JWT Token") {
      //     return this.handleTokenRefresh(req, next);
      //   }
      }
      // Sentry.captureException(error, {
      //   tags: {
      //     referer: document.referrer,
      //   },
      // });
      console.log("error", error);
      return throwError(error);
    }

    // private handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     return this.authService.refreshToken().pipe(
    //         untilDestroyed(this),
    //         switchMap((response: AuthenticatedTokenResponse) => {
    //             if(response) {
    //             LocalStorageControl.set(CONST.ACCESS_TOKEN, response.data.token);
    //             LocalStorageControl.set(CONST.REFRESH_TOKEN, response.data.refresh_token);
    //             req = this.addAuthorizationHeader(req);
    //             }
    //             return next.handle(req);
    //         }),
    //         catchError((error) => {
    //             return throwError(error);
    //         })
    //     )
    // }

    private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
        setHeaders: {
        'Authorization': `Bearer ${token}`
        }
    });
    }

}