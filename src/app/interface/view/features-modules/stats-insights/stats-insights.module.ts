import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { SharedCountModule } from '../../shared-components/shared-count-module/shared-count-module.module';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { FemaleFoundersComponent } from './diversity-matter/female-founders.component';
import { EthnicDiversityComponent } from './ethnic-minority/ethnic-diversity.component';
import { CharitiesComponent } from './charities/charities.component';
import { CardModule } from 'primeng/card';
import { NetZeroComponent } from '../insights-module/net-zero/net-zero.component';
import { TabViewModule } from 'primeng/tabview';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';

const StatsInsightsModuleRoutes: Routes = [
	{ path: 'female-owned', data: { breadcrumb: 'Woman Owned Business' }, component: FemaleFoundersComponent },
	{ path: 'ethnicity-spectrum', data: { breadcrumb: 'Spectrum' }, component: EthnicDiversityComponent },
	{ path: 'charities', data: { breadcrumb: 'Charities' }, component: CharitiesComponent },
	{ path: 'militaryVeterans', data: { breadcrumb: 'Military Veterans' }, component: CharitiesComponent },
	{ path: 'bCorpCertifiedBusiness', data: { breadcrumb: 'B Corp Certified Business' }, component: CharitiesComponent },
	{ path: 'netZeroCommitments', data: { breadcrumb: 'Net-Zero Commitments' }, component: CharitiesComponent },
	{ path: 'segmentation-by-size', data: { breadcrumb: 'Segmentation By Size' }, component: CharitiesComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forChild(StatsInsightsModuleRoutes),
		DropdownModule,
		SharedCountModule,
		NumberSuffixModule,
		TableModule,
		ButtonModule,
		ChartModule,
		InputSwitchModule,
		CardModule,
		TabViewModule,
		StatsAnalysisModule
	],
	declarations: [
		FemaleFoundersComponent,
		EthnicDiversityComponent,
        CharitiesComponent
	],
	providers: [ CurrencyPipe, NumberSuffixPipe, DecimalPipe, UpperCasePipe, TitleCasePipe, httpInterceptorProviders ]
})
export class StatsInsightsModule { }
