import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NoAuthPagesRoutingModule } from './no-auth-pages-routing.module';
import { AppLoginComponent } from './app.login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageModule } from "primeng/message";
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { NgxStripeModule } from 'ngx-stripe';
import { SharedLoaderModule } from '../interface/view/shared-components/shared-loader/shared-loader.module';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { SocialLoginService } from '../interface/service/socialLogins.service';
import { UserManagementService } from '../interface/service/user-management.service';
import { ForgotPasswordComponent } from './app.forgotPassword.component';
import { httpInterceptorProviders } from '../interface/interceptors/http-interceptors';
import { ThankyouComponent } from './thankyou.component';
import { CreditReportPurchaseComponent } from './credit-report-purchase/credit-report-purchase.component';
import { UpgradePlanComponent } from './upgrade-plan/upgrade-plan.component';
import { ConfirmationComponent } from './app.confirmation.component';
import { CreateAccountComponent } from './app.createAccount.component';
import { SearchFiltersService } from '../interface/service/search-filter.service';
import { FreeSubscriptionComponent } from './app.freeSubscription.component';
import { CardDetailsComponent } from './app.cardDetails.component';
import { PasswordResetComponent } from './app.passwordReset.component';
import { SmallUrlComponent } from './app.smallurl.component';
import { SuccessPlanUpgradeComponent } from './app.successPlanUpgrade.component';
import { UserAccountPreferenceComponent } from './app.userAccountPreference.component';
import { WithoutLoginModalComponent } from '../interface/view/shared-components/without-login-modal/without-login-modal.component';
import { SubscriptionInactiveComponent } from './subscription-inactive/subscription-inactive.component';
import { EduCreateAccountComponent } from './edu-create-account.component';

@NgModule({
  declarations: [
    AppLoginComponent,
    ForgotPasswordComponent,
    ThankyouComponent,
    CreditReportPurchaseComponent,
    UpgradePlanComponent,
    ConfirmationComponent,
    CreateAccountComponent,
    FreeSubscriptionComponent,
    CardDetailsComponent,
    PasswordResetComponent,
    SmallUrlComponent,
    SuccessPlanUpgradeComponent,
    UserAccountPreferenceComponent,
    WithoutLoginModalComponent,
    SubscriptionInactiveComponent,
    EduCreateAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NoAuthPagesRoutingModule,
    // SocialLoginModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    ButtonModule,
    AutoCompleteModule,
    DropdownModule,
    CheckboxModule,
    DialogModule,
    NgxStripeModule.forRoot( environment.stripe_public_key ),
    RadioButtonModule,
    ProgressSpinnerModule,
    DividerModule,
    TabViewModule,
    CardModule,
    SharedLoaderModule,
    InputTextModule 
  ],
  exports: [
    AppLoginComponent,
    UpgradePlanComponent,
    CreditReportPurchaseComponent,
    WithoutLoginModalComponent,
    CreateAccountComponent,
    SubscriptionInactiveComponent
],
  providers: [
    SocialLoginService, MessageService, UserManagementService, SearchFiltersService, TitleCasePipe, httpInterceptorProviders
]
})
export class NoAuthPagesModule { }
