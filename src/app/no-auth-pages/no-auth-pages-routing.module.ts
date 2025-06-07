import { NgModule } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { AppLoginComponent } from './app.login.component';
import { ForgotPasswordComponent } from './app.forgotPassword.component';
import { CreateAccountComponent } from './app.createAccount.component';
import { CreditReportPurchaseComponent } from './credit-report-purchase/credit-report-purchase.component';
import { ConfirmationComponent } from './app.confirmation.component';
import { FreeSubscriptionComponent } from './app.freeSubscription.component';
import { CardDetailsComponent } from './app.cardDetails.component';
import { PasswordResetComponent } from './app.passwordReset.component';
import { SmallUrlComponent } from './app.smallurl.component';
import { SuccessPlanUpgradeComponent } from './app.successPlanUpgrade.component';
import { SubscriptionInactiveComponent } from './subscription-inactive/subscription-inactive.component';
import { EduCreateAccountComponent } from './edu-create-account.component';
import { SeoTitleDescriptionResolver } from '../interface/seo-title-description/seo-title-description.resolver';

const childRoutes: Routes = [
    { path: 'login', component: AppLoginComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'createAccount', resolve: { seoTitleDescription: SeoTitleDescriptionResolver }, component: CreateAccountComponent },
    { path: 'edu/createAccount', resolve: { seoTitleDescription: SeoTitleDescriptionResolver }, component: EduCreateAccountComponent },
	{ path: 'resetPassword', component: PasswordResetComponent },
    { path: 'confirmation', component: ConfirmationComponent },
    { path: 'smallurl', component: SmallUrlComponent },
    { path: 'freeSubscription', component: FreeSubscriptionComponent },
    { path: 'cardDetails', component: CardDetailsComponent },
    { path: 'successPlanUpgrade', component: SuccessPlanUpgradeComponent },
    { path: 'creditReport', component: CreditReportPurchaseComponent }, 
    { path: 'subscriptionInactive', component: SubscriptionInactiveComponent }
];

@NgModule({
	imports: [
		RouterModule.forChild(childRoutes)
	],
	exports: [RouterModule]
})
export class NoAuthPagesRoutingModule {
	
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {

        // Triggers if any of the Child Route hits without parent route: '/authentication';
        this.router.events.subscribe( event => {

            if ( event instanceof NavigationEnd ) {

                const defaultParentPath = '/authentication';
                let urlParams = Object.assign( {}, this.activatedRoute.snapshot.queryParams );

                for ( let route of childRoutes ) {

                    if ( event.url.includes( route.path ) && !event.url.includes( route.path + '-' ) && !event.url.includes( defaultParentPath ) ) {
                     
                        this.router.navigate( [ `${ defaultParentPath }/${ route.path }` ], { queryParams: urlParams } );

                    }

                }

            }

        });

    }
	
}
