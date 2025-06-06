import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
    constructor( private injector: Injector ) {}

    // intercept(req: HttpRequest<any>, next: HttpHandler):
    //     Observable<HttpEvent<any>> {
    //     return next.handle(req).pipe(
    //         catchError( (error) => {
    //             if ( error.error && error.error.hasOwnProperty('response_code') && error.error.response_code === 498 ) {
    //                 localStorage.removeItem('access_token');
    //                 localStorage.clear();
    //                this._router.navigate(['/authentication/login']);
    //                return throwError(() => new Error('User Logout'));
    //             } else {
    //                 // return throwError(() => new Error(error));
    //                 throw error;
    //             }
    //         })
    //     );
    // }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Clone the request and add the authorization header
		const clonedRequest = req.clone({
			withCredentials: true // Ensure that cookies are sent with the request
		});

		return next.handle(clonedRequest).pipe(
			catchError((error: HttpErrorResponse) => {
                
                const router = this.injector.get(Router);

				if (error.status === 401 || error.status === 422 || error?.error?.['code'] == 400 || error?.error?.['code'] == 401 ) {
					// Handle unauthorized error, e.g., redirect to login
                    localStorage.removeItem('isLoggedIn');
                    setTimeout(() => {
                        localStorage.clear();
                        router.navigate(['/authentication/login']);
                    }, 0);
                    return throwError(() => new Error(`${error.error.message}`))		
                    							
                } 
				throw error;
			})
		);
	}
}


