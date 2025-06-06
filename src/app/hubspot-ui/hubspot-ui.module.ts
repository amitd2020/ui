import { CommonModule, DecimalPipe, LocationStrategy, PathLocationStrategy, TitleCasePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ExtraOptions, Route, Router, RouterModule, Routes } from "@angular/router";
import { HubspotUiComponent } from "./hubspot-ui.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayModule } from "primeng/overlay";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { FilterFormComponent } from "./filter-form/filter-form.component";
import { AuthComponent } from "./services/auth/auth.component";
import { HubspotCompanyDetailComponent } from "./hubspotcompany-detail/hubspotcompany-detail.component";
import { SharedTopBarModule } from "../interface/view/shared-components/shared-topbar-module/shared-topbar-module.module";
import { SharedFooterModule } from "../interface/view/shared-components/shared-footer-module/shared-footer-module.module";
import { TreeSelectModule } from 'primeng/treeselect';
import { ButtonModule } from 'primeng/button';
import { DGAuthGuard, HubspotAuthGuard } from "./services/auth.guard";
import { SliderModule } from 'primeng/slider';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TooltipModule } from "primeng/tooltip";
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { QueryParamResolver } from "./resolver/query-param.resolver";
import { AuthHubSpotInterceptor } from "./interceptor/auth.interceptor";
import { GlobalServerComminicationService } from "./services/global-server-comminication.service";
import { InputSwitchModule } from "primeng/inputswitch";
import { FieldsetModule } from 'primeng/fieldset';
import { NumberSuffixPipe } from "../interface/custom-pipes/number-suffix/number-suffix.pipe";
import { NumberSuffixModule } from "../interface/custom-pipes/number-suffix/number-suffix.module";

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const HubspotUiRoutes: Routes = [
    { path: 'AuthLogin', component: LoginComponent },
    { path: 'ForgotPassword', component: ForgotPasswordComponent },
    {
        path: '', component: HubspotUiComponent, canActivate: [ DGAuthGuard ], resolve: { queryParams: QueryParamResolver },
        children: [
            { path: '', redirectTo: 'update', pathMatch: 'full' },
            { path: 'dg-authenticate', component: AuthComponent },
            { path: 'update', component: HubspotCompanyDetailComponent, canActivate: [ DGAuthGuard, HubspotAuthGuard ] },
            { path: 'filters', component: FilterFormComponent, canActivate: [ HubspotAuthGuard ] },
        ]
    }
    
    // { path: 'dg-authenticate', component: AuthComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HubspotUiRoutes),
        // BrowserModule,
        // BrowserAnimationsModule,
        FormsModule,
        // AppRoutingModule,
        HttpClientModule,
        InputTextModule,
        MultiSelectModule,
        CalendarModule, 
        DialogModule,
        TableModule,
        CheckboxModule,
        OverlayModule,
        OverlayPanelModule,
        PaginatorModule,
        MessagesModule,
        ProgressBarModule,
        ToastModule,
        InputNumberModule,
        SharedTopBarModule,
        SharedFooterModule,
        TreeSelectModule,
        ButtonModule,
        SliderModule,
        ProgressSpinnerModule,
        TooltipModule,
        InputSwitchModule,
        FieldsetModule,
        NumberSuffixModule
    ],
    declarations: [
        HubspotUiComponent,
        FilterFormComponent,
        HubspotCompanyDetailComponent,
        AuthComponent,
        LoginComponent,
        ForgotPasswordComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // { provide: HTTP_INTERCEPTORS, useClass: AuthHubSpotInterceptor, multi:true },
        GlobalServerComminicationService, DecimalPipe, TitleCasePipe, NumberSuffixPipe
    ],

})
export class HubspotUiModule {

}