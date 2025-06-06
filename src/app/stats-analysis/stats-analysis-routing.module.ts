import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsDashboardComponent } from '../stats-dashboard/stats-dashboard.component';
import { MapAnalysisComponent } from './map-analysis/map-analysis.component';
import { MsmeDetailsComponent } from './msme-details/msme-details.component';
import { RiskDetailsComponent } from './risk-details/risk-details.component';
import { FinancialDetailsComponent } from './financial-details/financial-details.component';
import { StatsGraphViewComponent } from './stats-graph-view/stats-graph-view.component';
import { TableViewComponent } from './table-view/table-view.component';
import { GrowthAnalysisComponent } from './growth-analysis/growth-analysis.component';

const routes: Routes = [
    { path: 'map-dash', component: StatsDashboardComponent },
    { path: 'map-analysis', component: MapAnalysisComponent },
    { path: 'msme-details', component: MsmeDetailsComponent },
    { path: 'risk-details', component: RiskDetailsComponent },
    { path: 'growth-analysis', component: GrowthAnalysisComponent },
    {
        path: 'financial-details',
        component: FinancialDetailsComponent,
        children: [
            { path: 'stats-graph-view', component: StatsGraphViewComponent },
            { path: 'table-view', component: TableViewComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StatsAnalysisRoutingModule {}
