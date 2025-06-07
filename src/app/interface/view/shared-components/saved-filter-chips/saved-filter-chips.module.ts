import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisplayStyleFilterChipComponent } from './display-style-filter-chip/display-style-filter-chip.component';
import { DisplayFilterChipComponent } from './display-filter-chip/display-filter-chip.component';



@NgModule({
	declarations: [
		DisplayStyleFilterChipComponent,
		DisplayFilterChipComponent
	],
	exports: [
		DisplayStyleFilterChipComponent,
		DisplayFilterChipComponent
	],
	imports: [
		CommonModule
	]
})
export class SavedFilterChipsModule { }
