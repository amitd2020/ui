import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CreditScoreComponent } from './credit-score/credit-score.component';
import { UserSuggestionComponent } from './user-suggestion/user-suggestion.component';
import { CreatePlanComponent } from './create-plan/create-plan.component';
import { PlanFeaturesComponent } from './plan-features/plan-features.component';
import { DataUpdateInfoComponent } from './data-update-info/data-update-info.component';

import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { ListModuleModule } from '../features-modules/list-module/list-module.module';
import { SharedTablesModule } from '../shared-components/shared-tables/shared-tables.module';

import { UserManagementService } from '../../service/user-management.service';

const adminAccountModuleRoutes: Routes = [
	{ path: 'credit-score', data: { breadcrumb: 'Credit Score' }, component: CreditScoreComponent },
	{ path: 'plan-features', data: { breadcrumb: 'Plan Features' }, component: PlanFeaturesComponent },
	{ path: 'plans', data: { breadcrumb: 'Plan' }, component: CreatePlanComponent },
	{ path: 'user-suggestion', data: { breadcrumb: 'User Suggestions' }, component: UserSuggestionComponent },
	{ path: 'data-update-info', data: { breadcrumb: 'Date Update Info' }, component: DataUpdateInfoComponent }
]

@NgModule({
	imports: [
		RouterModule.forChild( adminAccountModuleRoutes ),
		HttpClientModule,
		CommonModule,
		NoAuthPagesModule,
		TableModule,
		PaginatorModule,
		CardModule,
		ProgressSpinnerModule,
		ConfirmDialogModule,
		DropdownModule,
		MessagesModule,
		MessageModule,
		InputTextModule,
		CheckboxModule,
		ListModuleModule,
		SharedTablesModule,
		FormsModule
	],
	declarations: [
		CreditScoreComponent,
		UserSuggestionComponent,
		CreatePlanComponent,
		PlanFeaturesComponent,
		DataUpdateInfoComponent
	],
	providers: [
		UserManagementService, ConfirmationService, MessageService
	]
})
export class AdminAccountUtilitiesModule { }
