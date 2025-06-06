import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberSuffixPipe } from '../../custom-pipes/number-suffix/number-suffix.pipe';

@NgModule({
  declarations: [
    NumberSuffixPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
		NumberSuffixPipe
	]
})
export class NumberSuffixModule { }
