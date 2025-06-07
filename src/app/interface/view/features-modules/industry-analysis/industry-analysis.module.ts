import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';

import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { AnalysisDashboardComponent } from './analysis-dashboard/analysis-dashboard.component';
import { IndustryPortfolioListComponent } from './industry-portfolio-list/industry-portfolio-list.component';
import { ListOfCompaniesComponent } from './list-of-companies/list-of-companies.component';
import { ShortDetailSidefilterModule } from '../../shared-components/short-detail-sidefilter/short-detail-sidefilter.module';

const IndustryAnalysisModuleRoutes: Routes = [
	{ path: 'industry-sectors', data: { breadcrumb: 'Industry Sectors' }, component: AnalysisDashboardComponent },
	{ path: 'saved-portfolios', data: { breadcrumb: 'Saved Portfolio' }, component: IndustryPortfolioListComponent },
	{ path: 'list-of-companies', component: ListOfCompaniesComponent }
]

@NgModule({
	imports: [
		HttpClientModule,
		RouterModule.forChild(IndustryAnalysisModuleRoutes),
		CommonModule,
		CardModule,
		DropdownModule,
		ProgressSpinnerModule,
		ChartModule,
		FormsModule,
		SharedTablesModule,
		ShortDetailSidefilterModule,
		NoAuthPagesModule
	],
	declarations: [
		AnalysisDashboardComponent,
		IndustryPortfolioListComponent,
		ListOfCompaniesComponent
	],
	providers: [
		TitleCasePipe, CurrencyPipe
	]
})
export class IndustryAnalysisModule { }
