import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';

import { StatsAnalysisRoutingModule } from './stats-analysis-routing.module';
import { MapAnalysisComponent } from './map-analysis/map-analysis.component';
import { MsmeDetailsComponent } from './msme-details/msme-details.component';
import { RiskDetailsComponent } from './risk-details/risk-details.component';
import { StatsGraphViewComponent } from './stats-graph-view/stats-graph-view.component';
import { TableViewComponent } from './table-view/table-view.component';
import { FinancialDetailsComponent } from './financial-details/financial-details.component';
import { StatsDashboardComponent } from '../stats-dashboard/stats-dashboard.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { StatsFilterOptionsComponent } from './stats-filter-options/stats-filter-options.component';
import { EmployeesSegmentsComponent } from './employees-segments/employees-segments.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedToggleComponentComponent } from './shared-toggle-component/shared-toggle-component.component';
import { ChartModule } from 'primeng/chart';
import { SharedTrendAnalysisComponentComponent } from './shared-trend-analysis-component/shared-trend-analysis-component.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SharedItagComponentComponent } from './shared-itag-component/shared-itag-component.component';
import { SidebarModule } from 'primeng/sidebar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { NumberSuffixPipe } from '../interface/custom-pipes/number-suffix/number-suffix.pipe';
import { MessagesModule } from 'primeng/messages';
import { NumberSuffixModule } from '../interface/custom-pipes/number-suffix/number-suffix.module';
import { EChartModule } from '../eChart/e-chart.module';
import { GrowthAnalysisComponent } from './growth-analysis/growth-analysis.component';
import { SharedClickedItagComponent } from './shared-clicked-itag/shared-clicked-itag.component';

@NgModule({
	declarations: [
		MapAnalysisComponent,
		MsmeDetailsComponent,
		RiskDetailsComponent,
		StatsGraphViewComponent,
		TableViewComponent,
		FinancialDetailsComponent,
		StatsDashboardComponent,
		StatsFilterOptionsComponent,
		EmployeesSegmentsComponent,
		SharedToggleComponentComponent,
		SharedTrendAnalysisComponentComponent,
		SharedItagComponentComponent,
		GrowthAnalysisComponent,
		SharedClickedItagComponent
	],
	imports: [
		CommonModule,
		DropdownModule,
		FormsModule,
		MultiSelectModule,
		CheckboxModule,
		ButtonModule,
		TableModule,
		ProgressBarModule,
		InputSwitchModule,
		ChartModule,
		OverlayPanelModule,
		SidebarModule,
		ScrollPanelModule,
		PanelModule,
		MessagesModule,
		NumberSuffixModule,
		EChartModule,

		StatsAnalysisRoutingModule
	],

	exports: [
		MapAnalysisComponent,
		TableViewComponent,
		SharedItagComponentComponent,
		SharedToggleComponentComponent,
		SharedClickedItagComponent
	],

	providers: [CurrencyPipe, NumberSuffixPipe, TitleCasePipe]
})
export class StatsAnalysisModule { }
