import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

import { UserManagementService } from 'src/app/interface/service/user-management.service';
import { ListServiceService } from 'src/app/interface/service/list-service.service';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';

import { AllUserListComponent } from './all-user-list/all-user-list.component';
import { UpdateUserDetailsComponent } from './update-user-details/update-user-details.component';
import { ClientTeamManagementComponent } from './client-team-management/client-team-management.component';
import { SharedAddonListModule } from '../../shared-components/shared-addon-list/shared-addon-list.module';
import { RoleAuthGuard } from 'src/app/interface/auth-guard/role-auth.guard';
import { AuthGuardService } from 'src/app/interface/auth-guard/auth-guard.guard';

const userMangementRoute: Routes = [
	{
		path: '', component: AllUserListComponent,
		data: { userRoles: [ 'Client Admin Master', 'Client Admin' ] },
		canActivate: [ AuthGuardService, RoleAuthGuard ]
	},
	{
		path: 'update-user/:emailId', component: UpdateUserDetailsComponent,
		data: { userRoles: [ 'Client Admin Master', 'Client Admin' ] },
		canActivate: [ AuthGuardService, RoleAuthGuard ]
	},
	{
		path: 'update-corporate/:companyName', component: UpdateUserDetailsComponent,
		data: { userRoles: [ 'Client Admin Master', 'Client Admin' ] },
		canActivate: [ AuthGuardService, RoleAuthGuard ]
	},
	{
		path: 'update-corporate-user/:companyName/:emailId', component: UpdateUserDetailsComponent,
		data: { userRoles: [ 'Client Admin Master', 'Client Admin' ] },
		canActivate: [ AuthGuardService, RoleAuthGuard ]
	},
	{
		path: 'team-management', component: ClientTeamManagementComponent,
		data: { userRoles: [ 'Client Admin Master', 'Client Admin' ] },
		canActivate: [ AuthGuardService, RoleAuthGuard ]
	}
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild( userMangementRoute ),
		HttpClientModule,
		SharedTablesModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		InputSwitchModule,
		FormsModule,
		ProgressSpinnerModule,
		ConfirmDialogModule,
		MessagesModule,
		MessageModule,
		PaginatorModule,
		CheckboxModule,
		DropdownModule,
		DialogModule,
		AccordionModule,
		CalendarModule,
		NoAuthPagesModule,
		AutoCompleteModule,
		InputNumberModule,
		SharedAddonListModule
	],
	declarations: [
		AllUserListComponent,
		UpdateUserDetailsComponent,
		ClientTeamManagementComponent
  ],
	providers: [
		UserManagementService, MessageService, ListServiceService, httpInterceptorProviders
	]
})
export class UserManagementModule { }
