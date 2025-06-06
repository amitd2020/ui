import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth/user-auth.service';

@Injectable({
	providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {

	constructor(
		private userAuthService: UserAuthService,
		private router: Router
	) {}
	
	canActivate( activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		
		if ( this.userAuthService.hasRolePermission( activatedRoute?.data?.userRoles ) ) {
			return true;
		}

		this.router.navigate( ['/'] );
		return false;
	}

}
