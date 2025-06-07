import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';

import { ListServiceService } from 'src/app/interface/service/list-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';

import { FurloughInsightsComponent } from './company-insights/furlough-insights/furlough-insights.component';
import { InsightsMonthlyComponent } from './company-insights/insights-monthly/insights-monthly.component';
import { InsightsYearlyComponent } from './company-insights/insights-yearly/insights-yearly.component';
import { HnwiComponent } from './landscape-insights/hnwi/hnwi.component';
import { InvesteeFinderComponent } from './landscape-insights/investee-finder/investee-finder.component';
import { InvestorFinderComponent } from './landscape-insights/investor-finder/investor-finder.component';
import { LendingLandscapeComponent } from './landscape-insights/lending-landscape/lending-landscape.component';
import { InternationalTradeComponent } from './landscape-insights/international-trade/international-trade.component';
import { CorporateRiskComponent } from './landscape-insights/corporate-risk/corporate-risk.component';
import { LandscapeCompaniesListComponent } from './landscape-insights/landscape-companies-list/landscape-companies-list.component';
import { AnalysisDashboardComponent } from '../industry-analysis/analysis-dashboard/analysis-dashboard.component';

import { ShortDetailSidefilterModule } from '../../shared-components/short-detail-sidefilter/short-detail-sidefilter.module';
import { SharedCountModule } from '../../shared-components/shared-count-module/shared-count-module.module';
import { FilterSidebarModule } from '../../shared-components/filter-sidebar-refactored/filter-sidebar.module';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { AccountSearchComponent } from './account-search/account-search.component';
import { CompanyDescriptionComponent } from './company-description/company-description.component';
import { PaginatorModule } from 'primeng/paginator';
import { ChargesDescriptionComponent } from './charges-description/charges-description.component';
import { FeatureAccessDirective } from 'src/app/feature-access-component/feature-access-component.component';
import { CompanyLinkedinComponent } from './company-linkedin/company-linkedin.component';
import { PersonLinkedinComponent } from './person-linkedin/person-linkedin.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MsmePopUpSvgModule } from '../msme-pop-up-svg/msme-pop-up-svg.module';
import { AddCompanyToListModule } from '../../shared-components/add-company-to-list/add-company-to-list.module';
import { ReadMoreDirectiveModule } from '../../shared-components/read-more-directive-module/read-more.module';
import { DiversityCalculationStats } from './landscape-insights/diversity-calculation-stats/diversity-calculation-stats';
import { NetZeroComponent } from './net-zero/net-zero.component';
import { FileUploadModule } from 'primeng/fileupload';
import { DiversityCalcProgressReportComponent } from './landscape-insights/diversity-calculation/diversity-calc-progress-report/diversity-calc-progress-report.component';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { PickListModule } from 'primeng/picklist';
import { TabViewModule } from 'primeng/tabview';
import { PromptPaymentCodeComponent } from './prompt-payment-code/prompt-payment-code.component';
import { FieldsetModule } from 'primeng/fieldset';
import { EChartModule } from 'src/app/eChart/e-chart.module';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';
// import { ResponsibleProcurementComponent } from './landscape-insights/responsible-procurement/responsible-procurement.component';
import { DiversityModule } from './landscape-insights/diversity-calculation/diversity.module';
import { SupplierAnalytics } from './landscape-insights/diversity-calculation/supplier-analytics';
import { ProgressBarModule } from 'primeng/progressbar';

const InsightsModuleRoutes: Routes = [
	{ path: 'lending', data: { breadcrumb: 'Lending Landscape' }, component: LendingLandscapeComponent },
	{ path: 'corporate-risk', data: { breadcrumb: 'Corporate Risk Landscape' }, component: CorporateRiskComponent },
	{ path: 'international-trade', data: { breadcrumb: 'International Trade Landscape' }, component: InternationalTradeComponent },
	{ path: 'industry-sectors', data: { breadcrumb: 'Industry Sectors' }, component: AnalysisDashboardComponent },
	{ path: 'insights-yearly', data: { breadcrumb: 'Insight - Yearly' }, component: InsightsYearlyComponent },
	{ path: 'insights-monthly', data: { breadcrumb: 'Insights - Monthly' }, component: InsightsMonthlyComponent },
	{ path: 'furlough-insights', data: { breadcrumb: 'Furlough Insights' }, component: FurloughInsightsComponent },
	{ path: 'investor-finder', data: { breadcrumb: 'Investor Finder' }, component: InvestorFinderComponent },
	{ path: 'investee-finder', data: { breadcrumb: 'Investee Finder' }, component: InvesteeFinderComponent },
	{ path: 'landscape-companies-list', component: LandscapeCompaniesListComponent },
	{ path: 'hnwi', data: { breadcrumb: 'HNWI' }, component: HnwiComponent },
	// { path: 'responsible-procurement', data: { breadcrumb: 'Responsible Procurement' }, component: ResponsibleProcurementComponent }, // intentioanlly changed by TK sir, DG-9707
	{ path: 'responsible-procurement', data: { breadcrumb: 'Responsible Procurement' }, component: SupplierAnalytics },
	{ path: 'supplier-resilience', data: { breadcrumb: 'Supplier Resilience Check' }, component: SupplierAnalytics },
	{ path: 'account-search', data: { breadcrumb: 'Account Search' }, component: AccountSearchComponent },
	{ path: 'company-description', data: { breadcrumb: 'Company Description' }, component: CompanyDescriptionComponent },
	{ path: 'charges-description', data: { breadcrumb: 'Charges Description' }, component: ChargesDescriptionComponent },
	{ path: 'company', data: { breadcrumb: 'Company' }, component: CompanyLinkedinComponent },
	{ path: 'people', data: { breadcrumb: 'People' }, component: PersonLinkedinComponent },
	{ path: 'diversity-stats', data: { breadcrumb: 'Diversity Stats' }, component: DiversityCalculationStats },
	{ path: 'net-zero-target', data: { breadcrumb: 'Net-Zero Commitments List' }, component: NetZeroComponent },
	{ path: 'net-zero-target', data: { breadcrumb: 'Net-Zero Target' }, component: NetZeroComponent },
	{ path: 'progress-report', data: { breadcrumb: 'Progress Report' }, component: DiversityCalcProgressReportComponent },
	{ path: 'promptPaymentCode', data: { breadcrumb: 'Prompt Payment Code' }, component: PromptPaymentCodeComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forChild(InsightsModuleRoutes),
		MessageModule,
		MessagesModule,
		DropdownModule,
		MultiSelectModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		ChartModule,
		CheckboxModule,
		SliderModule,
		RadioButtonModule,
		CalendarModule,
		SharedTablesModule,
		AddCompanyToListModule,
		DialogModule,
		ShortDetailSidefilterModule,
		NoAuthPagesModule,
		InputNumberModule,
		FilterSidebarModule,
		ChipModule,
		TooltipModule,
		SharedCountModule,
		AccordionModule,
		PaginatorModule,
		FeatureAccessDirective,
		OverlayPanelModule,
		MsmePopUpSvgModule,
		ReadMoreDirectiveModule,
		FileUploadModule,
		AddOnAccessDirective,
		PickListModule,
		TabViewModule,
		FieldsetModule,
		DataViewModule,
		EChartModule,
		ToastModule,
		ConfirmDialogModule,
		SelectButtonModule,
		DiversityModule,
		StatsAnalysisModule,
		ProgressBarModule,
	],
	declarations: [
		FurloughInsightsComponent,
		InsightsMonthlyComponent,
		InsightsYearlyComponent,
		HnwiComponent,
		InvesteeFinderComponent,
		InvestorFinderComponent,
		LendingLandscapeComponent,
		InternationalTradeComponent,
		CorporateRiskComponent,
		LandscapeCompaniesListComponent,
		// ResponsibleProcurementComponent, // intentioanlly changed by TK sir, DG-9707
		AccountSearchComponent,
		CompanyDescriptionComponent,
  		ChargesDescriptionComponent,
		CompanyLinkedinComponent,
		PersonLinkedinComponent,
		SupplierAnalytics,
		DiversityCalculationStats,
		NetZeroComponent,
		DiversityCalcProgressReportComponent,
		PromptPaymentCodeComponent,
	],
	providers: [
		ListServiceService, SearchFiltersService, CurrencyPipe, NumberSuffixPipe, DecimalPipe, UpperCasePipe, TitleCasePipe, httpInterceptorProviders
	]
})
export class InsightsModuleModule { }
