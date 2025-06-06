import { Component, Input, OnInit } from '@angular/core';
import { UserAuthService } from '../interface/auth-guard/user-auth/user-auth.service';
import { NoAuthPagesModule } from '../no-auth-pages/no-auth-pages.module';
import { CommonModule } from '@angular/common';
import { UserAddOnType } from '../interface/auth-guard/user-auth/user-info';
import { AuthGuardService } from '../interface/auth-guard/auth-guard.guard';

@Component({
	selector: '[addOnAccess]',
	template: `
		<ng-container *ngIf="addOnAccessBool">
			<ng-content></ng-content>
		</ng-container> 
		<ng-container *ngIf="!addOnAccessBool && optionalTemplate">
			<div *ngIf ="isLoggedin" class="text-center mr-4 ml-4 mb-4">
				To enable this feature, please mail to: <a class="c-blue" href="mailto:grow@datagardener.com">grow&#64;datagardener.com</a>
			</div>
			<dg-without-login-modal *ngIf="!isLoggedIn"></dg-without-login-modal>
		</ng-container>
	`,
	standalone: true,
	imports: [CommonModule, NoAuthPagesModule]
})
export class AddOnAccessDirective implements OnInit {

  	@Input() addOnAccess: keyof UserAddOnType;
  	@Input() optionalTemplate?: boolean = false;

	addOnAccessBool: boolean = false;
	isLoggedin: any;
	constructor(
		public userAuthService: UserAuthService,
		public authGuardService: AuthGuardService
	) { }

	ngOnInit(): void {
		this.addOnAccessBool = this.userAuthService.hasAddOnPermission( this.addOnAccess );
		this.isLoggedin = this.authGuardService.isLoggedin()
		
	}
}