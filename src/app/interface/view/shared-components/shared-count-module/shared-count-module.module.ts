import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedCountCardComponent } from './shared-count-card/shared-count-card.component';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';

@NgModule({
	declarations: [
		SharedCountCardComponent
	],
	imports: [
		CommonModule,
		NumberSuffixModule
	],
	providers: [
	  NumberSuffixPipe, CurrencyPipe
	],
	exports: [
		SharedCountCardComponent
	],
})
export class SharedCountModule { }
