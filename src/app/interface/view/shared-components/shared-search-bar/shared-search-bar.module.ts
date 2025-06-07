import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { KnobModule } from 'primeng/knob';
import { ToastModule } from 'primeng/toast';

import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { DataCommunicatorService } from '../../features-modules/company-details-module/data-communicator.service';

import { SharedSearchBarComponent } from './shared-search-bar.component';

@NgModule({
	imports: [
		CommonModule,
		DropdownModule,
		AutoCompleteModule,
		FormsModule,
		ButtonModule,
		BadgeModule,
		OverlayPanelModule,
		ProgressBarModule,
		KnobModule,
		ToastModule
	],
	declarations: [
		SharedSearchBarComponent
	],
	exports: [
		SharedSearchBarComponent
	],
	providers: [
		TitleCasePipe, SearchFiltersService, DataCommunicatorService
	]
})
export class SharedSearchBarModule { }
