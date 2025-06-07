import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

import { UploadCsvModule } from '../../shared-components/upload-csv/upload-csv.module';
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { StatsInsightsModule } from '../../shared-components/stats-insights/stats-insights.module';
import { SubFilterModule } from '../../shared-components/stats-insights/sub-filter/sub-filter.module';
import { businessMonitorModule } from '../../shared-components/business-monitor/business-monitor-module';
import { OtherRelatedCompaniesModule } from '../../shared-components/other-related-companies/other-related-companies.module';

import { WorkflowService } from './workflow.service';

import { ClientsComponent } from './clients/clients.component';
import { WorkflowOutletComponent } from './workflow-outlet.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { UploadCsvComponent } from '../../shared-components/upload-csv/upload-csv.component';
import { WorkflowDashboardComponent } from './workflow-dashboard/workflow-dashboard.component';
import { StatsInsightsComponent } from '../../shared-components/stats-insights/stats-insights.component';
import { SubFilterComponent } from '../../shared-components/stats-insights/sub-filter/sub-filter.component';
import { BusinessMonitorComponent } from '../../shared-components/business-monitor/business-monitor.component';
import { OtherRelatedCompaniesComponent } from '../../shared-components/other-related-companies/other-related-companies.component';
import { RelatedPartyIntelComponent } from './related-party-intel/related-party-intel.component';
import { DropdownModule } from 'primeng/dropdown';
import { RoleAuthGuard } from 'src/app/interface/auth-guard/role-auth.guard';
import { AddOnAuthGuard } from 'src/app/interface/auth-guard/add-on-auth.guard';

const workflowRoteResolverFn: ResolveFn<any> = ( activeRouteSnap: ActivatedRouteSnapshot, routeStateSnap: RouterStateSnapshot ) => {
	const screen = activeRouteSnap.params?.screen;
	const breadcrumbLabel = screen ? screen.charAt(0).toUpperCase() + screen.slice(1) : 'Unknown';
	return breadcrumbLabel;
}

const workFlowRoutes: Routes = [
	{ path: 'dashboard', data: { breadcrumb: 'Dashboard' }, component: WorkflowDashboardComponent },
	{ path: 'related-party-intel', data: { breadcrumb: 'Related Party Intel', addOnKey: 'developerFeatures' }, component: RelatedPartyIntelComponent, canActivate: [ AddOnAuthGuard ] },
	{ 
		path: ':screen', component: WorkflowOutletComponent, resolve: { breadcrumb: workflowRoteResolverFn },
		children: [
			{ path: '', component: WorkflowListComponent },
			{ path: 'upload-csv', data: { breadcrumb: 'Upload CSV' }, component: UploadCsvComponent },
			{ path: 'stats-insights', data: { breadcrumb: 'Stats' }, component: StatsInsightsComponent },
			{ path: 'view-similar-company', data: { breadcrumb: 'Similar Company' }, component: SubFilterComponent },
			{ path: 'other-related-companies', data: { breadcrumb: 'Other Related Companies' }, component: OtherRelatedCompaniesComponent },
			{ path: 'business-monitor', data: { featureAccessKey: 'Company Monitor', breadcrumb: 'Business Monitor' }, component: BusinessMonitorComponent}
		],
	}
]

@NgModule({
	declarations: [
		WorkflowOutletComponent,
		ClientsComponent,
		WorkflowListComponent,
		WorkflowDashboardComponent,
		RelatedPartyIntelComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(workFlowRoutes),
		FormsModule,
		ButtonModule,
		MessagesModule,
		UploadCsvModule,
		StatsInsightsModule,
		OtherRelatedCompaniesModule,
		SharedTablesModule,
		SubFilterModule,
		businessMonitorModule,
		ChartModule,
		CardModule,
		DropdownModule
		
	],
	providers: [ WorkflowService ]
})
export class WorkflowModule { }
