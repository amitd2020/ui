import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';

class TokenServices {
	AuthService$ = inject( AuthService );
	Router$ = inject( Router );
}

// DG Auth Guard
export const DGAuthGuard: CanActivateFn = async ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {

	const _TokenServices = new TokenServices();

	// if ( localStorage.getItem('access_token') ) {
	// 	localStorage.clear();
	// }

	if( route.queryParams.companyId ) {
		sessionStorage.setItem('companyId', route.queryParams.companyId);
	}
	
	if ( await _TokenServices.AuthService$.isDgLoggedIn() ) {
		return true;
	}

	return _TokenServices.Router$.createUrlTree( ['hubspot-ui/AuthLogin'] );
};

// HubSpot Auth Guard
export const HubspotAuthGuard: CanActivateFn = async ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {

	const _TokenServices = new TokenServices();

	let hubspotAuthCheckURI = `redirect_uri=${window.location.origin}/hubspot-ui/dg-authenticate`;
	
	if ( await _TokenServices.AuthService$.isHubSpotLoggedIn( hubspotAuthCheckURI ) ) {

		const { routeConfig: { path: currentRoutePath } } = route;

		if ( currentRoutePath == 'dg-authenticate' ) {
	       return _TokenServices.Router$.createUrlTree( ['hubspot-ui/update'] );
		} 

		return true;
	} 

	return _TokenServices.Router$.createUrlTree( ['hubspot-ui/dg-authenticate'] );

};