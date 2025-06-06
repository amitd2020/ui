import { Component, Input, OnInit } from '@angular/core';
import { UserAuthService } from '../interface/auth-guard/user-auth/user-auth.service';
import { CommonModule } from '@angular/common';
import { NoAuthPagesModule } from '../no-auth-pages/no-auth-pages.module';

@Component({
	selector: '[loginAccessModal]',
	template: `
		<ng-container *ngIf="( userAuthService.isLoggedInSubject$ | async ) || ( loginAccessModal && publicCompanyProfiles.includes( loginAccessModal?.companyNumber ) ); else withoutLogin">
			<ng-content></ng-content>
		</ng-container> 
		<ng-template #withoutLogin>
			<dg-without-login-modal></dg-without-login-modal>
		</ng-template>
	`,
	standalone: true,
	imports: [CommonModule, NoAuthPagesModule]
})
export class LoginAccessModalComponent implements OnInit {

	@Input() loginAccessModal: { companyNumber?: string };

	publicCompanyProfiles: Array<string> = ['00041424', '01270695'];

	constructor(
		public userAuthService: UserAuthService
	) { }

	ngOnInit(): void {
	}

}
