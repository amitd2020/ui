import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) {}

    async isDgLoggedIn() {
        if ( localStorage.getItem('isDgLoggedIn') ) {
            return true;
        }

        localStorage.clear();
        return false;
    }

    async isHubSpotLoggedIn( hubspotAuthCheckURI: string ): Promise< boolean > {

		let authCheck = await lastValueFrom( this.checkAuth( hubspotAuthCheckURI ) );

		if ( !authCheck ) {
			return false;
		}

		const { results: { isAuthenticatedWithHubspot } } = authCheck;

		return isAuthenticatedWithHubspot;

    }

    checkAuth( hubspotAuthCheckURI: string ): Observable<any> {
        return this.http.get<any>( `${environment.server}/hs-extension/checkToken?${hubspotAuthCheckURI}` );
    }
}