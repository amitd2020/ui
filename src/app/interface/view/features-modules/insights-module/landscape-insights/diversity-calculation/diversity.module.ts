import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccordionModule } from "primeng/accordion";
import { SpendReportAnalysisComponent } from '../diversity-calculation/supplier-progress-report/spend-report-analysis.component';
import { EChartModule } from "src/app/eChart/e-chart.module";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { SkeletonModule } from "primeng/skeleton";
import { MakePdfReport } from "src/app/shared-pdf-report/make-pdf-report.component";
import { TooltipModule } from "primeng/tooltip";

const routes: Routes = [
    {
    	path: 'supplier-report', component: SpendReportAnalysisComponent,
    	data: { breadcrumb: 'Report Analysis' }
    },
]; 

@NgModule({

	imports: [ 
		RouterModule.forChild(routes),
		EChartModule,
		ButtonModule,
		CommonModule,
		SkeletonModule,
		MakePdfReport,
		TooltipModule
	],
	declarations: [
    	SpendReportAnalysisComponent
  	],
	exports: [
		SpendReportAnalysisComponent
	],
	providers: [ RouterModule, AccordionModule ]

})

export class DiversityModule {}