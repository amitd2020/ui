import { NgModule } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ScrollTopModule } from 'primeng/scrolltop';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

import { CompareCompaniesComponent } from './compare-companies/compare-companies.component';
import { RelatedPartyComponent } from './related-party/related-party.component';

import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { DropdownModule } from 'primeng/dropdown';
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';

const companyComparisonRoutes: Routes = [
	{ path: 'compare-company', data: { breadcrumb: 'Compare Company' }, component: CompareCompaniesComponent },
	{ path: 'related-party', data: { breadcrumb: 'Related Party' }, component: RelatedPartyComponent },
];

@NgModule({
	imports: [
		HttpClientModule,
		RouterModule.forChild( companyComparisonRoutes ),
		CommonModule,
		AutoCompleteModule,
		FormsModule,
		ButtonModule,
		DividerModule,
		ChartModule,
		ScrollTopModule,
		NoAuthPagesModule,
		CardModule,
		SkeletonModule,
		MessagesModule,
		MessageModule,
		DropdownModule,
		SharedTablesModule,
		AddOnAccessDirective
	],
	declarations: [
		CompareCompaniesComponent,
		RelatedPartyComponent
	],
	providers: [
		httpInterceptorProviders, UpperCasePipe, NumberSuffixPipe,
	]
})
export class DeepInsightsModule { }
