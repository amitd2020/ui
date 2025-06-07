import { CommonModule, CurrencyPipe, DecimalPipe, TitleCasePipe, UpperCasePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { RadioButtonModule } from "primeng/radiobutton";
import { SliderModule } from "primeng/slider";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";

import { NumberSuffixPipe } from "src/app/interface/custom-pipes/number-suffix/number-suffix.pipe";
import { httpInterceptorProviders } from "src/app/interface/interceptors/http-interceptors";
import { ListServiceService } from "src/app/interface/service/list-service.service";
import { SearchFiltersService } from "src/app/interface/service/search-filter.service";
import { NoAuthPagesModule } from "src/app/no-auth-pages/no-auth-pages.module";
import { FilterSidebarModule } from "../../../shared-components/filter-sidebar-refactored/filter-sidebar.module";
import { SharedTablesModule } from "../../../shared-components/shared-tables/shared-tables.module";
import { ShortDetailSidefilterModule } from "../../../shared-components/short-detail-sidefilter/short-detail-sidefilter.module";
import { EsgSmeIndexComponent } from "./esg-sme-index/esg-sme-index.component";
import { EsgWatchComponent } from './esg-watch/esg-watch.component';

const EsgModuleRoutes: Routes = [
	{ path: 'esg-watch', data: { breadcrumb: 'ESG Watch' }, component: EsgWatchComponent },
	{ path: 'esg-sme-index', data: { breadcrumb: 'ESG Index' }, component: EsgSmeIndexComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forChild(EsgModuleRoutes),
		MessageModule,
		MessagesModule,
		DropdownModule,
		MultiSelectModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		ChartModule,
		CheckboxModule,
		SliderModule,
		RadioButtonModule,
		CalendarModule,
		SharedTablesModule,
		DialogModule,
		ShortDetailSidefilterModule,
		NoAuthPagesModule,
		InputNumberModule,
		FilterSidebarModule,
		ChipModule,
		TooltipModule,
		ConfirmDialogModule,
		AutoCompleteModule,
		InputSwitchModule,
		OverlayPanelModule
	],
	declarations:[
		EsgSmeIndexComponent,
		EsgWatchComponent
	],
	providers: [
		ListServiceService, SearchFiltersService, CurrencyPipe, NumberSuffixPipe, DecimalPipe, UpperCasePipe, TitleCasePipe, httpInterceptorProviders
	]
})
export class EsgModule { }
