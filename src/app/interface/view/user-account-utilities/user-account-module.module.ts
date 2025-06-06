import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersubscriptionComponent } from './usersubscription/usersubscription.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedAddonListModule } from '../shared-components/shared-addon-list/shared-addon-list.module';
import { FileUploadModule } from 'primeng/fileupload';
import {ImageModule} from 'primeng/image';
import { CompanyBrandingImagesComponent } from './company-branding-image/company-branding-image.component';
import { ConfirmationService } from 'primeng/api';
import { RoleAuthGuard } from '../../auth-guard/role-auth.guard';
import { WebWidgetComponent } from './web-widget/web-widget.component';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { ShortDetailSidefilterModule } from '../shared-components/short-detail-sidefilter/short-detail-sidefilter.module';
import { ListboxModule } from 'primeng/listbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SharedTablesModule } from "../shared-components/shared-tables/shared-tables.module";
import { MultiFactorAuthenticationComponent } from './multi-factor-authentication/multi-factor-authentication.component';



const UserAccountModuleRoutes: Routes = [
	{ path: 'user-profile', component: UserProfileComponent },
	{
		path: 'user-subscription', component: UsersubscriptionComponent,
		data: { userRoles: ['Super Admin', 'Client Admin Master', 'Client Admin', 'Individual', 'Under Development', 'admin'] },
		canActivate: [ RoleAuthGuard ]
	},
	{ path: 'web-widget', component: WebWidgetComponent },
    { path: 'multi-factor-authenticaton', component: MultiFactorAuthenticationComponent }
]

@NgModule({
    declarations: [
        UserProfileComponent,
        UsersubscriptionComponent,
        CompanyBrandingImagesComponent,
        WebWidgetComponent,
        MultiFactorAuthenticationComponent
    ],
    providers: [
        SearchFiltersService, TitleCasePipe, DatePipe, ConfirmationService, httpInterceptorProviders
    ],
    imports: [
        HttpClientModule,
        RouterModule.forChild(UserAccountModuleRoutes),
        CommonModule,
        ButtonModule,
        ConfirmDialogModule,
        MessagesModule,
        MessageModule,
        InputTextModule,
        TableModule,
        FormsModule,
        CardModule,
        AutoCompleteModule,
        PasswordModule,
        DropdownModule,
        ProgressSpinnerModule,
        DialogModule,
        NoAuthPagesModule,
        SharedAddonListModule,
        FileUploadModule,
        ImageModule,
        CalendarModule,
        InputSwitchModule,
        RadioButtonModule,
        OverlayPanelModule,
        PaginatorModule,
        ShortDetailSidefilterModule,
        ListboxModule,
        ToggleButtonModule,
        SharedTablesModule
    ]
})
export class UserAccountModuleModule { }
