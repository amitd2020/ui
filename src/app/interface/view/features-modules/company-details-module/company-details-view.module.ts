import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';

//PrimNg Modules
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EditorModule } from 'primeng/editor';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
// import { GMapModule } from 'primeng/gmap';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { TimelineModule } from 'primeng/timeline';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

//Misc. Imports
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';

//Components
import { CompanyDetailsViewComponent } from './company-details-view.component';
import { CompanyPdfReportComponent } from './company-pdf-report/company-pdf-report.component';

//Modules
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { CarbonCalculatorModule } from '../carbon-calculator/carbon-calculator.module';
import { EpcModule } from './epc-module/epc.module';

// Overview Tab Components
import { AboutComponent, TradingAddressComponent, EscComponent, GroupStructureComponent, NotesComponent, LifeLineComponent, ImportExportComponent, PersonContactInfoComponent, EpcTabComponent, SustainabilityIndexComponent } from './child-components.index';

// Risk Profile Tab Components
import { RiskSummaryComponent, SafeAlertComponent, CommentryComponent, CompanyEventsComponent, CreditorsComponent, BadDeptsComponent, ChargesComponent, CcjsComponent } from './child-components.index';

// Financial Tab Components
import { FinancialsInfoComponent, RatiosComponent, ShareholdingsComponent, AquisationMergerComponent, InnovateGrantComponent, CorporateLandComponent, BusinessValuationComponent, PatentTradeComponent, ZscoreComponent, CagrComponent, UkgaapIfrsInsuranceFinancialComponent } from './child-components.index';

// Director/Shareholders Tab Components
import { DirectorsInfoComponent, PscComponent, ShareholdersComponent, RelatedDirectorsComponent, RelatedCompaniesComponent, ViewShareholdingsComponent } from './child-components.index';

//ESG Sustainability Tabs Components
import { SustainEsgSummaryComponent, SustainEnvironmentComponent, SustainSocialComponent, SustainGovernanceComponent, SustainFinanceComponent } from './child-components.index';

import { SupplierComponent, BuyerComponent } from './child-components.index';

// Document - News Feeds Tab Components
import { DocumentsComponent, NewsFeedComponent } from './child-components.index';

// Services & Pipes
import { DataCommunicatorService } from './data-communicator.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { SharedFinancialModule } from '../../shared-components/shared-financial-card/shared-financial-card.module'
import { FinancialTableDataComponent } from '../../shared-components/financial-table-data/financial-table-data.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { EnterprisePdfReportComponent } from './enterprise-pdf-report/enterprise-pdf-report.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BulkTaggingModule } from '../../shared-components/bulk-tagging/bulk-tagging.module';
import { LoginAccessModalComponent } from 'src/app/Login Access Modal/LoginAccessModal';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { FeatureAccessDirective } from 'src/app/feature-access-component/feature-access-component.component';
import { MsmePopUpSvgModule } from '../msme-pop-up-svg/msme-pop-up-svg.module';
import { AddCompanyToListModule } from '../../shared-components/add-company-to-list/add-company-to-list.module';
import { LinkedinProfileComponent } from './overview/linkedin-profile/linkedin-profile.component';
import { EChartModule } from 'src/app/eChart/e-chart.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ResponsibleProcurementDiversityComponent } from './responsible-procurement-diversity/responsible-procurement-diversity.component';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';
// import { BulkTagComponent } from '../../shared-components/bulk-tagging/bulk-tag/bulk-tag.component';

const CompanyRoutes: Routes = [
	{ path: ':companyNo/:companyName', data: { breadcrumb: 'Company-Details' }, component: CompanyDetailsViewComponent },
	{ path: 'view-shareholdings', data: { breadcrumb: 'View Shareholdings' }, component: ViewShareholdingsComponent },
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild( CompanyRoutes ),
		FormsModule,
		HttpClientModule,
		NumberSuffixModule,
		ButtonModule,
		ProgressSpinnerModule,
		DialogModule,
		OverlayPanelModule,
		EditorModule,
		SkeletonModule,
		TableModule,
		MessageModule,
		MessagesModule,
		MenubarModule,
		ChartModule,
		// GMapModule,
		CardModule,
		CheckboxModule,
		FontAwesomeModule,
		ShareButtonModule,
		ShareButtonsModule,
		NoAuthPagesModule,
		SharedTablesModule,
        TreeModule,
		TreeTableModule,
		TimelineModule,
		ListboxModule,
		TooltipModule,
		ToastModule,
		InputSwitchModule,
		ScrollTopModule,
		AccordionModule,
		TabViewModule,
		ScrollPanelModule,
		ProgressBarModule,
		DataViewModule,
		TagModule,
		ConfirmDialogModule,
		EpcModule,
		DividerModule,
		SharedFinancialModule,
		ShareIconsModule,
		CarbonCalculatorModule,
		SplitButtonModule,
		RadioButtonModule,
		BulkTaggingModule,
		LoginAccessModalComponent,
		AddOnAccessDirective,
		FeatureAccessDirective,
		MsmePopUpSvgModule,
		AddCompanyToListModule,
		EChartModule,
		MultiSelectModule,
		DropdownModule,
		StatsAnalysisModule
	],
	declarations: [
		CompanyDetailsViewComponent,
		AboutComponent,
		EpcTabComponent,
		EscComponent,
		GroupStructureComponent,
		ImportExportComponent,
		LifeLineComponent,
		NotesComponent,
		PersonContactInfoComponent,
		TradingAddressComponent,
		BadDeptsComponent,
		CcjsComponent,
		ChargesComponent,
		CommentryComponent,
		CompanyEventsComponent,
		CreditorsComponent,
		RiskSummaryComponent,
		SafeAlertComponent,
		DirectorsInfoComponent,
		PscComponent,
		RelatedCompaniesComponent,
		RelatedDirectorsComponent,
		ShareholdersComponent,
		ViewShareholdingsComponent,
		DocumentsComponent,
		AquisationMergerComponent,
		BusinessValuationComponent,
		CagrComponent,
		CorporateLandComponent,
		FinancialsInfoComponent,
		InnovateGrantComponent,
		PatentTradeComponent,
		RatiosComponent,
		ShareholdingsComponent,
		SustainabilityIndexComponent,
		UkgaapIfrsInsuranceFinancialComponent,
		ZscoreComponent,
		BuyerComponent,
		SupplierComponent,
		NewsFeedComponent,
		SustainEnvironmentComponent,
		SustainEsgSummaryComponent,
		SustainFinanceComponent,
		SustainGovernanceComponent,
		SustainSocialComponent,
		CompanyPdfReportComponent,
		FinancialTableDataComponent,
        EnterprisePdfReportComponent,
        LinkedinProfileComponent,
        ResponsibleProcurementDiversityComponent,
		// BulkTagComponent
	],
	exports: [
		CompanyDetailsViewComponent
	],
	providers: [
		httpInterceptorProviders, NumberSuffixPipe, CurrencyPipe, MessageService, DecimalPipe, TitleCasePipe, DataCommunicatorService, UpperCasePipe, ConfirmationService
	]
})
export class CompanyDetailsViewModule { }
