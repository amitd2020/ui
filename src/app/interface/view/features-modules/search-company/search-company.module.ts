
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
import { TreeModule } from 'primeng/tree';
import { SliderModule } from 'primeng/slider';
import { ChartModule } from 'primeng/chart';
import { TimelineModule } from 'primeng/timeline';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';

import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';

import { SearchCompanyComponent } from './search-company.component';
import { ResidentialPropertyComponent } from './residential-property/residential-property.component';
import { CommercialPropertyComponent } from './commercial-property/commercial-property.component';
import { AdminRecordListComponent } from '../../shared-components/shared-tables/admin-record-list/admin-record-list.component';
// import { StatsInsightsComponent } from '../../shared-components/stats-insights/stats-insights.component';
import { StatsInsightsComponent } from '../../shared-components/stats-insights/stats-insights.component';
import { ContractFinderComponent } from '../../shared-components/government-enabler/contract-finder/contract-finder.component';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { BuyersDashboardComponent } from '../../shared-components/government-enabler/buyers-dashboard/buyers-dashboard.component';
import { SuppliersDashboardComponent } from '../../shared-components/government-enabler/suppliers-dashboard/suppliers-dashboard.component';
import { FilterSidebarModule } from '../../shared-components/filter-sidebar-refactored/filter-sidebar.module';
import { RecordListComponent } from '../../shared-components/shared-tables/record-list/record-list.component';
import { FormatDataRecordListService } from '../../shared-components/shared-exports/export-record-list/format-data-export-record-list.service';
// import { LazyLeafletMapComponent } from '../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component';

import { NoAuthPagesModule } from '../../../../no-auth-pages/no-auth-pages.module';
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { SavedFilterChipsModule } from '../../shared-components/saved-filter-chips/saved-filter-chips.module';

import { NgxCaptureModule } from 'ngx-capture';
import { ShortDetailSidefilterModule } from '../../shared-components/short-detail-sidefilter/short-detail-sidefilter.module';
import {TabMenuModule} from 'primeng/tabmenu';
import { OtherRelatedCompaniesComponent } from '../../shared-components/other-related-companies/other-related-companies.component';
import { AddOnAuthGuard } from 'src/app/interface/auth-guard/add-on-auth.guard';
import { AuthGuardService } from 'src/app/interface/auth-guard/auth-guard.guard';
import { RoleAuthGuard } from 'src/app/interface/auth-guard/role-auth.guard';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { FeatureAccessDirective } from 'src/app/feature-access-component/feature-access-component.component';
import { DropdownModule } from 'primeng/dropdown';
import { MsmePopUpSvgModule } from '../msme-pop-up-svg/msme-pop-up-svg.module';
import { TabViewModule } from 'primeng/tabview';
import { OtherRelatedCompaniesModule } from '../../shared-components/other-related-companies/other-related-companies.module';
import { StatsInsightsModule } from '../../shared-components/stats-insights/stats-insights.module';
import { CompareStatsComponent } from '../../shared-components/stats-insights/compare-stats/compare-stats.component';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';
import { TooltipModule } from 'primeng/tooltip';
import { ChargeDashboardComponent } from './charge-dashboard/charge-dashboard.component';
import { EChartModule } from 'src/app/eChart/e-chart.module';
import { SharedProcurementBarsComponent } from '../../shared-components/government-enabler/shared-procurement-bars/shared-procurement-bars.component';
import { DataViewModule } from 'primeng/dataview';
import { ReadMoreDirectiveModule } from '../../shared-components/read-more-directive-module/read-more.module';
import { AddCompanyToListModule } from '../../shared-components/add-company-to-list/add-company-to-list.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BuyerSupplierComponent } from '../../shared-components/government-enabler/buyer-supplier/buyer-supplier.component';
import { AutoCompleteModule } from 'primeng/autocomplete';

const searchCompanyRoute: Routes = [
	{ path: '', data: { breadcrumb: 'Company Search' }, component: SearchCompanyComponent },
	{
		path: 'Favourites', data: { breadcrumb: 'Company Search' }, component: SearchCompanyComponent,
		canActivate: [ AuthGuardService ]
	},
	{
		path: 'ExportedBucket', data: { breadcrumb: 'Company Search' }, component: SearchCompanyComponent,
		canActivate: [ AuthGuardService ]
	},
	{
		path: 'property-register', component: CommercialPropertyComponent,
		data: { addOnKey: 'propertyIntelligence', breadcrumb: 'Property Register' },
		canActivate: [ AddOnAuthGuard ]
	},
	{
		path: 'residential-property', component: ResidentialPropertyComponent,
		data: { addOnKey: 'propertyIntelligence', breadcrumb: 'Residential Property' },
		canActivate: [ AddOnAuthGuard ]
	},
    {
		path: 'stats-insights', data: { breadcrumb: 'Stats Insights' }, component: StatsInsightsComponent,
		canActivate: [ AuthGuardService ]
	},
	{
		path: 'contract-finder', component: ContractFinderComponent,
		data: { addOnKey: 'governmentEnabler', breadcrumb: 'Contact Finder' },
		canActivate: [ AddOnAuthGuard ]
	},
	{
		path: 'show-contract-details', component: ContractFinderComponent,
		data: { addOnKey: 'governmentEnabler', breadcrumb: '' },
		canActivate: [ AddOnAuthGuard ]
	},
	{
		path: 'buyer-dashboard', component: BuyersDashboardComponent,
		data: { addOnKey: 'governmentEnabler', breadcrumb: 'Buyer Dashboard' },
		canActivate: [ AddOnAuthGuard ]
	},
	{
		path: 'supplier-dashboard', component: SuppliersDashboardComponent,
		data: { addOnKey: 'governmentEnabler', breadcrumb: 'Supplier Dashboard' },
		canActivate: [ AddOnAuthGuard ]
	},
	{
		path: 'other-related-companies', component: OtherRelatedCompaniesComponent
		// data: { userRoles: 'Super Admin', breadcrumb: 'Other Related Companies' },
		// canActivate: [ RoleAuthGuard ]
	},
	{
		path: 'stats-compare', component: CompareStatsComponent,
		data: { addOnKey: 'statsComparison', breadcrumb: 'Stats Compare' },
		canActivate: [ AddOnAuthGuard ]
	},
	{ 
		path: 'buyer', component: BuyerSupplierComponent,
		data: { breadcrumb: 'Buyer' },
		canActivate: [ AuthGuardService]
	},
	{ 
		path: 'supplier', component: BuyerSupplierComponent,
		data: { breadcrumb: 'Supplier' },
		canActivate: [ AuthGuardService]
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forChild(searchCompanyRoute),
		NoAuthPagesModule,
		MessagesModule,
		MessageModule,
		InputTextModule,
		ButtonModule,
		ListboxModule,
		ProgressSpinnerModule,
		DialogModule,
		CardModule,
		ScrollPanelModule,
		PaginatorModule,
		InputSwitchModule,
		CheckboxModule,
		OverlayPanelModule,
		CalendarModule,
		MultiSelectModule,
		AccordionModule,
		TreeModule,
		ChartModule,
		SliderModule,
		SharedTablesModule,
		ShortDetailSidefilterModule,
		InputNumberModule,
		TimelineModule,
		FilterSidebarModule,
		NgxCaptureModule,
		SavedFilterChipsModule,
		TabMenuModule,
		TabViewModule,
		AddOnAccessDirective,
		FeatureAccessDirective,
		DropdownModule,
		MsmePopUpSvgModule,
		StatsInsightsModule,
		OtherRelatedCompaniesModule,
		FieldsetModule,
		TableModule,
		StatsAnalysisModule,
		TooltipModule,
		EChartModule,
		DataViewModule,
		ReadMoreDirectiveModule,
		AddCompanyToListModule,
		ConfirmDialogModule,
		AutoCompleteModule 
	],
	declarations: [
		SearchCompanyComponent,
		ContractFinderComponent,
		BuyersDashboardComponent,
		SuppliersDashboardComponent,
		CommercialPropertyComponent,
		ResidentialPropertyComponent,
		ChargeDashboardComponent,
		SharedProcurementBarsComponent,
		BuyerSupplierComponent
	],
	providers: [
		httpInterceptorProviders, RecordListComponent, NumberSuffixPipe, ConfirmationService, CurrencyPipe, FormatDataRecordListService, AdminRecordListComponent 
	]
})
export class SearchCompanyModule { }
