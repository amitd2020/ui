import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FilterService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';
import {TabViewModule} from 'primeng/tabview';

import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';

import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SavedSearchesComponent } from './common-list/saved-searches-list/saved-searches-list.component';

import { NotesListComponent } from './common-list/notes-list/notes-list.component';
import { SalesforceSyncComponent } from './common-list/salesforce-sync/slaesforce-sync.component';
// import { BusinessMonitorComponent } from './monitor-lists/business-monitor/business-monitor.component';
import { ClientWatchComponent } from './monitor-lists/client-watch/client-watch.component';
import { AdminRecordListComponent } from '../../shared-components/shared-tables/admin-record-list/admin-record-list.component';
import { UserSavedListComponent } from './common-list/user-saved-list/user-saved-list.component';
import { ExportListComponent } from './common-list/export-list/export-list.component';
import { CbfExportedListComponent } from './common-list/cbf-exported-list/cbf-exported-list.component';
import { ExportedEmailsComponent } from './common-list/exported-emails/exported-emails.component';
import { PdfExportListComponent } from './common-list/pdf-export-list/pdf-export-list.component';
import { CrmExportListComponent } from './common-list/crm-export-list/crm-export-list.component';
import { UserContactListComponent } from './common-list/user-contact-list/user-contact-list.component';
import { BulkTaggingModule } from '../../shared-components/bulk-tagging/bulk-tagging.module';
import { FeatureAccessDirective } from 'src/app/feature-access-component/feature-access-component.component';
import { AddOnAuthGuard } from 'src/app/interface/auth-guard/add-on-auth.guard';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { businessMonitorModule } from '../../shared-components/business-monitor/business-monitor-module';
import { BusinessMonitorComponent } from '../../shared-components/business-monitor/business-monitor.component';
import { ContractFinderListComponent } from './contract-finder-list/contract-finder-list.component';
import { ConnectPlusListComponent } from './connect-plus-list/connect-plus-list.component';
import { ConnectPlusSavedFiltersComponent } from './common-list/connect-plus-saved-filters/connect-plus-saved-filters.component';
import { ContractFinderSavedFiltersComponent } from './common-list/contract-finder-saved-filters/contract-finder-saved-filters.component';
import { MonitoredContractFinderComponent } from '../../shared-components/government-enabler/monitored-contract-finder/monitored-contract-finder.component';

const listModuleRoutes: Routes = [
	{ path: 'saved-filters', data: { breadcrumb: 'Saved Filters' }, component: SavedSearchesComponent },
	{ path: 'saved-lists', data: { breadcrumb: 'Saved List' }, component: UserSavedListComponent },
	{ path: 'contact-lists', data: { breadcrumb: 'Contact List' }, component: UserContactListComponent },
	{ path: 'exported-files', data: { breadcrumb: 'Exported Files' }, component: ExportListComponent },
	{ path: 'exported-emails', data: { breadcrumb: 'Exported Emails' }, component: ExportedEmailsComponent },
	{ path: 'crm', data: { breadcrumb: 'CRM' }, component: CrmExportListComponent },
	{ path: 'notes', data: { breadcrumb: 'Notes' }, component: NotesListComponent },
	{ path: 'business-monitor', component: BusinessMonitorComponent, data: { featureAccessKey: 'Company Monitor', breadcrumb: 'Business Monitor' } },
	{ path: 'client-watch', data: { breadcrumb: 'Client Watch' }, component: ClientWatchComponent },
	{ path: 'director-watch', component: BusinessMonitorComponent, data: { featureAccessKey: 'Director Monitor', breadcrumb: 'Director Watch' } },
	{ path: 'pdf-reports', data: { breadcrumb: 'PDF Report' }, component: PdfExportListComponent },
	{ path: 'salesforce-sync', data: { breadcrumb: 'Salesforce Sync' }, component: SalesforceSyncComponent },
	{ path: 'business-monitor-plus', component: BusinessMonitorComponent, data: { addOnKey: 'companyMonitorPlus', breadcrumb: 'Business Monitor Plus' }, canActivate: [ AddOnAuthGuard ] },
	{ path: 'cbf-exported-files', data: { breadcrumb: 'CBF Exported Files' }, component: CbfExportedListComponent },
	{ path: 'contract-finder-lists', data: { addOnKey: 'governmentEnabler', breadcrumb: 'My Save Lists' }, component: ContractFinderListComponent, canActivate: [ AddOnAuthGuard ] },
	{ path: 'connect-plus', data: { addOnKey: 'personLinkedIn', breadcrumb: 'My Save Lists' }, component: ConnectPlusListComponent, canActivate: [ AddOnAuthGuard ] },
	{ path: 'connect-plus-saved-filters', data: { addOnKey: 'personLinkedIn', breadcrumb: 'My Save Filters' }, component: ConnectPlusSavedFiltersComponent, canActivate: [ AddOnAuthGuard ] },
	{ path: 'contract-finder-saved-filters', data: { addOnKey: 'governmentEnabler', breadcrumb: 'My Save Filters' }, component: ContractFinderSavedFiltersComponent, canActivate: [ AddOnAuthGuard ] },
	{ path: 'monitored-contract-finder', data: { addOnKey: 'governmentEnabler', breadcrumb: 'Monitored Contracts' }, component: MonitoredContractFinderComponent, canActivate: [ AddOnAuthGuard ] }
]

@NgModule({

	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild( listModuleRoutes ),
		TableModule,
		ButtonModule,
		PaginatorModule,
		DialogModule,
		MessagesModule,
		MessageModule,
		InputTextModule,
		KeyFilterModule,
		CardModule,
		CalendarModule,
		ProgressSpinnerModule,
		ConfirmDialogModule,
		FormsModule,
		CheckboxModule,
		DropdownModule,
		AccordionModule,
		MultiSelectModule,
		EditorModule,
		FileUploadModule,
		AutoCompleteModule,
		NoAuthPagesModule,
		ProgressBarModule,
		SharedTablesModule,
		TabViewModule,
		BulkTaggingModule,
		FeatureAccessDirective,
		AddOnAccessDirective,
		businessMonitorModule
	],
	declarations: [
		SavedSearchesComponent,
		CrmExportListComponent,
		ExportListComponent,
		NotesListComponent,
		UserSavedListComponent,
		UserContactListComponent,
		// BusinessMonitorComponent,
		ClientWatchComponent,
		PdfExportListComponent,
		SalesforceSyncComponent,
		ExportedEmailsComponent,
		CbfExportedListComponent,
        ContractFinderListComponent,
        ConnectPlusListComponent,
		ConnectPlusSavedFiltersComponent,
		ContractFinderSavedFiltersComponent,
		MonitoredContractFinderComponent
	],
	providers: [
		FilterService, AdminRecordListComponent, ConfirmationService, httpInterceptorProviders, 
	]
	
})
export class ListModuleModule { }
