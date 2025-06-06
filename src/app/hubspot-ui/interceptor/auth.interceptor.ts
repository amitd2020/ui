import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthHubSpotInterceptor implements HttpInterceptor {

  constructor( private router: Router ) {}

  intercept( request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let dgToken = localStorage.getItem('dg_access_token');

    if( dgToken ) {
      return next.handle( request.clone( { setHeaders: { authorization: `Basic ${dgToken}` } } ) ).pipe(
        catchError( (error) => {
          if( error.error && error.error.hasOwnProperty('response_code') && error.error.response_code === 498 ) {
            localStorage.clear();
            this.router.navigate(['hubspot-ui/AuthLogin']);
            return throwError(() => new Error('Session Expired'));
          } else {
            throw error;
          }
        } )
      );

    } else {
      dgToken = 'TaW1wb3NzaWJsZXRvaGFjaw1E=C901MhiD=UDataGArdeneRNE';
      return next.handle( request.clone( { setHeaders: { authorization: `Basic ${dgToken}` } } ) );
    }
  }
}