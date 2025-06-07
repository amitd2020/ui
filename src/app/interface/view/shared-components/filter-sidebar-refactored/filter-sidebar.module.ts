import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
import { TreeModule } from 'primeng/tree';
import { SliderModule } from 'primeng/slider';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';
import { TimelineModule } from 'primeng/timeline';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FilterService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { NoAuthPagesModule } from '../../../../no-auth-pages/no-auth-pages.module';
import { SavedFilterChipsModule } from "../saved-filter-chips/saved-filter-chips.module";
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';

import { RecordListComponent } from '../../shared-components/shared-tables/record-list/record-list.component';
import { AdminRecordListComponent } from '../../shared-components/shared-tables/admin-record-list/admin-record-list.component';

import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { FilterSidebarComponent } from './filter-sidebar.component';
import { ShortDetailSidefilterModule } from '../short-detail-sidefilter/short-detail-sidefilter.module';
import { FinancialTypeFormComponent } from './financial-type-form/financial-type-form.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import {RadioButtonModule} from 'primeng/radiobutton';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { StringSearchComponent } from './string-search/string-search.component';
import { ExtendedListBoxComponent } from './extended-list-box/extended-list-box.component';
import { FilterOptionsListSectionComponent } from './filter-options-list-section/filter-options-list-section.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { RangeInputFieldComponent } from './range-input-field/range-input-field.component';
import { ExtendedTreeListComponent } from './extended-tree-list/extended-tree-list.component';
import { RadiusSliderComponent } from './radius-slider/radius-slider.component';
import { PreferenceOptionsComponent } from './preference-options/preference-options.component';
import { AddPercentDirective } from './range-input-field/add-percentage.directive';
import { YearRangeComponent } from './year-range/year-range.component';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';
import { ExtendedGroupListBoxComponent } from './extended-group-list-box/extended-group-list-box.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule,
		NoAuthPagesModule,
		MessagesModule,
		MessageModule,
		InputTextModule,
		ButtonModule,
		ListboxModule,
		ProgressSpinnerModule,
		DialogModule,
		CardModule,
		ScrollPanelModule,
		PaginatorModule,
		InputSwitchModule,
		CheckboxModule,
		RadioButtonModule,
		OverlayPanelModule,
		CalendarModule,
		MultiSelectModule,
		AccordionModule,
		TreeModule,
		ChartModule,
		SliderModule,
		SharedTablesModule,
		ShortDetailSidefilterModule,
		InputNumberModule,
		TimelineModule,
		AutoCompleteModule,
		ConfirmDialogModule,
		SavedFilterChipsModule,
		SplitButtonModule,
		MenuModule,
		NumberSuffixModule,
		StatsAnalysisModule
	],
	declarations: [
		FilterSidebarComponent,
		FilterOptionsListSectionComponent,
		StringSearchComponent,
		DateRangeComponent,
		ExtendedListBoxComponent,
		ExtendedTreeListComponent,
		RadiusSliderComponent,
		PreferenceOptionsComponent,
		FinancialTypeFormComponent,
		// SubFilterComponent,
		RangeInputFieldComponent,
		AddPercentDirective,
        YearRangeComponent,
        ExtendedGroupListBoxComponent
	],
	exports: [
		FilterSidebarComponent,
		// SubFilterComponent
	],
	providers: [
		httpInterceptorProviders, RecordListComponent, AdminRecordListComponent, NumberSuffixPipe, FilterService, CurrencyPipe, DecimalPipe, MessageService
	]
})
export class FilterSidebarModule { }
