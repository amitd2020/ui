import { from as observableFrom, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthGuardService } from '../../auth-guard/auth-guard.guard';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private _auth: AuthGuardService,
		private activatedRoute: ActivatedRoute
		) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return observableFrom(this.handleAccess(request, next));
	}

	private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
		let changedRequest = request;
		// const headerSettings = {};
		
		// for (const key of request.headers.keys()) {
		// 	headerSettings[key] = request.headers.getAll(key);
		// }
		
		// const token = await this.getAuthorizationToken();
		
		// if (token) {
		// 	headerSettings['Authorization'] = 'Basic ' + token;
		// }

		// headerSettings['Content-Type'] = 'application/json';
		// headerSettings['Content-Type'] = 'multipart/form-data: boundary=------WebKitFormBoundary2lZSUsxEA3X5jpYD';
		// headerSettings['Accept'] = '*/*';

		// const newHeader = new HttpHeaders(headerSettings);

		// changedRequest = request.clone({
		// 	headers: newHeader
		// });

		changedRequest = changedRequest.clone({
			withCredentials: true
		});
		
		return next.handle(changedRequest).toPromise();
	}

    // getAuthorizationToken() {        
    //     let TOKEN = this._auth.getAccessToken();
    //     if (TOKEN == null) {
    //         // this token is used (with out login in header ) . so if you want change this token please update it in the backend also,
    //         // its working based on check token length (used middleware function (requirelogin))

	// 		let hubspotURL = this.activatedRoute['_routerState'].snapshot.url;
	// 		if ( localStorage.getItem('userToken') && !hubspotURL.includes('hubspot-ui') ){
	// 			return TOKEN = localStorage.getItem('userToken');
	// 		} else if ( localStorage.getItem('dg_access_token') ) {
	// 			return TOKEN = localStorage.getItem('dg_access_token');
	// 		}
    //         return TOKEN = 'TaW1wb3NzaWJsZXRvaGFjaw1E=C901MhiD=UDataGArdeneRNE';
    //     } else {
    //         return TOKEN;
    //     }
    // }


}