import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { LayoutService } from '../../service/app.layout.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthGuardService } from 'src/app/interface/auth-guard/auth-guard.guard';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { subscribedPlan } from 'src/environments/environment';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['../dg-utilities-overrides.component.scss'],
	animations: [
		trigger('topbarActionPanelAnimation', [
			transition(':enter', [
				style({ opacity: 0, transform: 'scaleY(0.8)' }),
				animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
			]),
			transition(':leave', [
				animate('.1s linear', style({ opacity: 0 }))
			])
		])
	]
})
export class AppTopbarComponent {
    
    // @ViewChild('menuButton') menuButton!: ElementRef;

    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

    @ViewChild('searchInput') searchInput!: ElementRef;
    
    constructor(public layoutService: LayoutService, public el: ElementRef, public router: Router, public authGuardService: AuthGuardService, public userAuthService: UserAuthService) {}

    activeItem!: number;

    model: MegaMenuItem[] = [];
    isLoggedIn: boolean = false;
    showSearchbarBoolean: boolean = true;
	showUpgradeButton: boolean = false;
	currentPlan: unknown;
    subscribedPlanModal: any = subscribedPlan;
	userID: unknown;
	exportProgressData: Array<any> = [];

	countrySelectionOptions: { name: string, countryCode: string }[] = [
		{ name: 'United Kingdom', countryCode: 'uk' },
		{ name: 'Ireland', countryCode: 'ie' }
	];
	selectedGlobalCountry: Partial< { name: string, countryCode: string } > = {};

    get mobileTopbarActive(): boolean {
        return this.layoutService.state.topbarMenuActive;
    }

    ngOnInit() {
        this.userAuthService.isLoggedInSubject$.subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {

				this.currentPlan = this.userAuthService?.getUserInfo('planId');
				this.userID = this.userAuthService?.getUserInfo('dbID');
				
				if ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {
					this.showUpgradeButton = true;
				}

				if ( [ '/', '/user-account-info/user-subscription', '/user-account-info/user-profile' ].includes( this.router.url ) ) {
					this.showSearchbarBoolean = false;
				}
				
				const selectedCountryCode = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
				const filteredSelectedCountry = this.countrySelectionOptions.filter( code => code.countryCode === selectedCountryCode );
				this.selectedGlobalCountry = filteredSelectedCountry.length ? filteredSelectedCountry[0] : {};

			}
		
			this.router.events.subscribe( val => {
				if ( val instanceof NavigationEnd ) {
					if ( [ '/', '/user-account-info/user-subscription', '/user-account-info/user-profile' ].includes( this.router.url ) ) {
						this.showSearchbarBoolean = false;
					} else {
						this.showSearchbarBoolean = true;
					}
				}
			});

		});
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onRightMenuButtonClick() {
        this.layoutService.openRightSidebar();
    }

    onMobileTopbarMenuButtonClick() {
        this.layoutService.onTopbarMenuToggle();
    }

    focusSearchInput(){
       setTimeout(() => {
         this.searchInput.nativeElement.focus()
       }, 0);
    }
}
