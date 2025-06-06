import { Component, Input, OnInit } from '@angular/core';
import { UserFeaturesType } from '../interface/auth-guard/user-auth/user-info';
import { UserAuthService } from '../interface/auth-guard/user-auth/user-auth.service';
import { NoAuthPagesModule } from '../no-auth-pages/no-auth-pages.module';
import { CommonModule } from '@angular/common';

@Component({
	selector: '[featureAccess]',
	template: `
		  <ng-container *ngIf="featureAccessBool || userAuthService.hasRolePermission( ['Super Admin'] )">
			<ng-content></ng-content>
		  </ng-container>
		  <ng-container *ngIf="!featureAccessBool && optionalTemplate">
			<div *ngIf="userAuthService.hasRolePermission( ['Client User'] )" class="text-center mr-4 ml-4 mb-4">
			To enable this feature, please contact your Administrator.
			</div>
			<dg-upgrade-plan [currentPlan]="currentPlan"></dg-upgrade-plan>
		  </ng-container>
		`,
	standalone: true,
	imports: [CommonModule, NoAuthPagesModule]
})
export class FeatureAccessDirective implements OnInit {

	@Input() featureAccess: keyof UserFeaturesType;
	@Input() optionalTemplate?: boolean = false;

	featureAccessBool: boolean = false;
	currentPlan: any;
	constructor(
		public userAuthService: UserAuthService
	) { }

	ngOnInit(): void {
		this.featureAccessBool = this.userAuthService.hasFeaturePermission( this.featureAccess );
		this.currentPlan = this.userAuthService?.getUserInfo('planId');
	}
}