import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BenchmarkDashboardComponent } from './benchmark-dashboard/benchmark-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
    { path: 'benchmarking-overview',data: { breadcrumb: 'Benchmarking Analysis' }, component: BenchmarkDashboardComponent },
    { path: 'merger-and-acquisition-overview',data: { breadcrumb: 'M & A Analysis' }, component: BenchmarkDashboardComponent },
];

@NgModule({
    declarations: [
		BenchmarkDashboardComponent
	],
    imports: [
		CommonModule,
		RouterModule.forChild(routes),
		TableModule,
		ChartModule,
		ButtonModule
	],
	providers: [
		CurrencyPipe, NumberSuffixPipe, TitleCasePipe
	]
})
export class BenchmarkingDashboardModule {}
