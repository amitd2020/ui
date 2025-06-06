import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { firstValueFrom, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { apiEndpoint } from 'src/apiBus/apiEndpointServiceConstants';
import { apiRoute } from 'src/apiBus/apiRouteConstants';
import { ServerCommunicationService } from '../service/server-communication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

    private sessionTimeoutContainer: any;
    sessionTimeoutIndicator: number = 0;

	constructor(
		private router: Router,
		private httpClient: HttpClient,
		private serverCommunicationService: ServerCommunicationService,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.isLoggedin()) {
			return true;
		}
		this.logout();
		return false;
	}

	canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return true;
	}

	isLoggedin() {
		if (localStorage.getItem( 'isLoggedIn' )) {
			return true;
		}
		return false;
	}

	login(obj: any) {
		return this.httpClient.post(`${environment.server}/${apiRoute.DG_LOGIN}/${apiEndpoint.login}`, obj, { observe: 'response' });
	}

	async store(token: string, Xkey: string) {
		await localStorage.clear();
		await localStorage.setItem('access_token', token);
	}

	getAccessToken() {
		return localStorage.getItem('access_token');
	}

	checkIfUserEmailAlreadyExists( email: string ) {
        return this.httpClient.get(`${environment.server}/${ apiRoute.DG_USER_API}/${ apiEndpoint.userEmailExistsCheck }/${ email }`, { observe: 'response' });
    }

	logout() {
		localStorage.clear();
		this.router.navigate(['/authentication/login']);
		this.sessionTimeoutIndicator = 0;

		if ( this.sessionTimeoutContainer ) {
			clearTimeout( this.sessionTimeoutContainer );
		}
	}

	async revoke() {

		const res = await firstValueFrom( this.httpClient.get<any>(`${environment.server}/${ apiRoute.DG_LOGIN }/${ apiEndpoint.revoke }`, { withCredentials : true} ) );
		return res;
		
	}

    /**
     * sessionHandler
     * User will be logged out automatically when the access token expires.
     * Token expiry time is 24hrs in the Backend, so the session alert
	 * timer will be started before 30 seconds on th main header.
     */
	public sessionHandler( expiryDate: Date ) {

		let currentTime = new Date().getTime();
		let expiryTime = new Date( expiryDate ).getTime();
		let sessionEndTime = expiryTime - currentTime;
		let timeDelay = 30 * 1000; // 30 seconds ( 1000 is miliseconds )
		let sessionIncatorTime = ( sessionEndTime - timeDelay ) || 0; // Session alert start time.

		// setTimeout( () => {
			
		// 	this.sessionTimeoutIndicator = timeDelay / 1000;
			
		// 	let sessionCountdown = setInterval( () => {
		// 		this.sessionTimeoutIndicator = --this.sessionTimeoutIndicator;

		// 		if ( this.sessionTimeoutIndicator < 0 ) {
		// 			clearInterval( sessionCountdown );
		// 			sessionCountdown = null;
		// 		}

		// 	}, 1000 );

		// }, sessionIncatorTime );
		
        // this.sessionTimeoutContainer = setTimeout( () => {
        //     this.logout();
        // }, sessionEndTime );

    }

}