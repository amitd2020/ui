import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { EditorModule } from 'primeng/editor';
import { ChipModule } from 'primeng/chip';
import { PickListModule } from 'primeng/picklist';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService } from 'primeng/api';

import { SavedFilterChipsModule } from '../saved-filter-chips/saved-filter-chips.module';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { SharedSearchBarModule } from '../shared-search-bar/shared-search-bar.module';
import { ReadMoreDirectiveModule } from '../read-more-directive-module/read-more.module';
import { EpcModule } from '../../features-modules/company-details-module/epc-module/epc.module';

import { ListServiceService } from 'src/app/interface/service/list-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { UserManagementService } from 'src/app/interface/service/user-management.service';
import { FormatDataExportUserListService } from '../shared-exports/export-user-list/format-data-export-user-list.service';
import { FormatDataRecordListService } from '../shared-exports/export-record-list/format-data-export-record-list.service';
import { ExportAdminRecordlistService } from '../shared-exports/export-admin-record-list/format-data-export-admin-record-list.service';

import { AdminRecordListComponent } from './admin-record-list/admin-record-list.component';
import { ExportCommonCardsComponent } from './export-common-cards/export-common-cards.component';
import { RecordListComponent } from './record-list/record-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { CrmExportComponent } from '../shared-exports/crm-export/crm-export.component';
import { CbfExportComponent } from '../shared-exports/cbf-export/cbf-export.component';
import { ExportTemplateComponent } from '../shared-exports/export-template/export-template.component';
import { UserSavedListComponent } from '../../features-modules/list-module/common-list/user-saved-list/user-saved-list.component';
import { UserContactListComponent } from '../../features-modules/list-module/common-list/user-contact-list/user-contact-list.component';
import { ExportRecordListComponent } from '../shared-exports/export-record-list/export-record-list.component';
import { ExportAdminRecordListComponent } from '../shared-exports/export-admin-record-list/export-admin-record-list.component';
import { ExportUserListComponent } from '../shared-exports/export-user-list/export-user-list.component';
import { SavedSearchesComponent } from '../../features-modules/list-module/common-list/saved-searches-list/saved-searches-list.component';
import { AddContactToListComponent } from '../add-contact-to-list/add-contact-to-list.component';
import { SharedToolTipComponent } from '../shared-toolTip/shared-toolTip.component';
import { MortgageChargesComponent } from '../../features-modules/search-company/mortgage-charges/mortgage-charges.component';
import { BulkTaggingModule } from '../bulk-tagging/bulk-tagging.module';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { SyncWithHubspotComponent } from './sync-with-hubspot/sync-with-hubspot.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AddCompanyToListModule } from '../add-company-to-list/add-company-to-list.module';
// import { DiversityCalculationStats } from '../../features-modules/insights-module/landscape-insights/diversity-calculation-stats/diversity-calculation-stats';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';
import { EChartModule } from 'src/app/eChart/e-chart.module';
import { MAndAComponent } from '../m-and-a/m-and-a.component';
import { MsmePopUpSvgModule } from '../../features-modules/msme-pop-up-svg/msme-pop-up-svg.module';
import { BenchmarkingComponent } from '../benchmarking/benchmarking.component';
import { FieldsetModule } from 'primeng/fieldset';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { TimelineModule } from 'primeng/timeline';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		HttpClientModule,
		TableModule,
		InputTextModule,
		DropdownModule,
		PaginatorModule,
		MultiSelectModule,
		CheckboxModule,
		CalendarModule,
		DialogModule,
		ButtonModule,
		ConfirmDialogModule,
		MessagesModule,
		MessageModule,
		KeyFilterModule,
		CardModule,
		ScrollPanelModule,
		OverlayPanelModule,
		ProgressSpinnerModule,
		EditorModule,
		AccordionModule,
		ListboxModule,
		InputSwitchModule,
		NoAuthPagesModule,
		ChipModule,
		TooltipModule,
		PickListModule,
		ToastModule,
		SavedFilterChipsModule,
		SharedSearchBarModule,
		ReadMoreDirectiveModule,
		MenuModule,
		RadioButtonModule,
		EpcModule,
		BulkTaggingModule,
		AddOnAccessDirective,
		SplitButtonModule,
		AddCompanyToListModule,
		ChartModule,
		TabViewModule,
		StatsAnalysisModule,
		MsmePopUpSvgModule,
		EChartModule,
		FieldsetModule,
		NumberSuffixModule,
		TimelineModule,
		DataViewModule
	],
	declarations: [
		RecordListComponent,
		AdminRecordListComponent,
		UserListComponent,
		// AddCompanyToListComponent,
		ExportTemplateComponent,
		CrmExportComponent,
		CbfExportComponent,
		ExportRecordListComponent,
		ExportAdminRecordListComponent,
		ExportUserListComponent,
		ExportCommonCardsComponent,
		AddContactToListComponent,
		SharedToolTipComponent,
		MortgageChargesComponent,
        SyncWithHubspotComponent,
		BenchmarkingComponent,
		MAndAComponent
		// DiversityCalculationStats
	],
	exports: [
		RecordListComponent,
		AdminRecordListComponent,
		UserListComponent,
		// AddCompanyToListComponent,
		AddContactToListComponent,
		ExportTemplateComponent,
		ExportCommonCardsComponent,
		SharedToolTipComponent,
		MortgageChargesComponent,
		SyncWithHubspotComponent,
		ExportAdminRecordListComponent,
	],
	providers: [
		ListServiceService, DatePipe, ConfirmationService, CurrencyPipe, SearchFiltersService, TitleCasePipe, DecimalPipe, UserManagementService, FormatDataRecordListService, ExportAdminRecordlistService, FormatDataExportUserListService, SavedSearchesComponent, UserSavedListComponent, UserContactListComponent, NumberSuffixPipe
	]
})
export class SharedTablesModule { }






