import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartModule } from 'primeng/chart';

import { SharedFinancialCardComponent } from './shared-financial-card/shared-financial-card.component';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
	declarations: [
		SharedFinancialCardComponent,
	],
	imports: [
		CommonModule,
		NumberSuffixModule,
		ChartModule,
		TooltipModule
	],
	exports: [
		SharedFinancialCardComponent
	],
	providers: [
		NumberSuffixPipe
	]
})
export class SharedFinancialModule { }
