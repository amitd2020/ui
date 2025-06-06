import { Component, ElementRef, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LayoutService } from '../../service/app.layout.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { AuthGuardService } from 'src/app/interface/auth-guard/auth-guard.guard';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';

@Component({
    selector: 'app-menu-profile',
    templateUrl: './app.menuprofile.component.html',
    styles: ['.disabled { opacity: 0.6; pointer-events: none; }'],
    animations: [
        trigger('menu', [
            transition('void => inline', [
                style({ height: 0 }),
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)', style({ opacity: 1, height: '*' })),
            ]),
            transition('inline => void', [
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)', style({ opacity: 0, height: '0' }))
            ]),
            transition('void => overlay', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)')
            ]),
            transition('overlay => void', [
                animate('.1s linear', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AppMenuProfileComponent implements OnInit {

    logoutConfirmationDialog: boolean = false;
    token: any;
    selectedGlobalCountry: string = 'uk';

    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        public sharedLoaderService: SharedLoaderService,
        public userAuthService: UserAuthService,
        private authGuardService: AuthGuardService,
        private messageService: MessageService,
        private router: Router,
        public commonService: CommonServiceService
    ) { }

    ngOnInit() {
        // this.toggleMenu();
        this.token = localStorage.getItem('access_token');
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
	}

    toggleMenu() {
        this.layoutService.onMenuProfileToggle();
    }

    get isHorizontal() {
       return this.layoutService.isHorizontal() && this.layoutService.isDesktop();
    }

    get menuProfileActive(): boolean {
        return this.layoutService.state.menuProfileActive;
    }

    get menuProfilePosition(): string {
        return this.layoutService.config.menuProfilePosition;
    }

    get isTooltipDisabled(): boolean {
        return !this.layoutService.isSlim();
    }

    isHorizontalActive() {
        return this.layoutService.isHorizontal() && !this.layoutService.isMobile();
    }

    confirmationLogout() {
		this.logoutConfirmationDialog = true;
	}

    myCompanyDetail() {
		let compNumber = this.userAuthService?.getUserInfo('companyNumber'),
			cmpName = this.userAuthService?.getUserInfo('companyName'),
			urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company/' + compNumber + '/' + this.formatCompanyNameForUrl( cmpName ) ], ) );

		window.open( urlStr, '_blank' );
	}

    formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

    webWidget() {
		let compNumber = this.userAuthService?.getUserInfo('companyNumber'),
			cmpName = this.userAuthService?.getUserInfo('companyName'),
			urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company/' + compNumber + '/' + this.formatCompanyNameForUrl( cmpName ) ], ) );

		window.open( urlStr, '_blank' );
	}

    logout() {

		this.sharedLoaderService.showLoader();
	
		this.authGuardService.revoke().then( data => {

			if ( data.code == 200 ) {

				this.authGuardService.logout();
				this.sharedLoaderService.hideLoader();

			}

		}, err => {
			this.sharedLoaderService.hideLoader();
			this.logoutConfirmationDialog = false;
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: `Something went wrong!!` });
		});

	}
}
