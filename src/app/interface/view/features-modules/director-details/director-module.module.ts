import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormsModule } from '@angular/forms';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ConfirmationService } from 'primeng/api';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { DirectorDetailsComponent } from './director-details/director-details.component';
import { DirectorPdfReportComponent } from './director-pdf-report/director-pdf-report.component';
import { DetailsComponent } from '../../shared-components/details/details.component';
import { LoginAccessModalComponent } from 'src/app/Login Access Modal/LoginAccessModal';
import { AddOnAccessDirective } from 'src/app/addon-feature-access-modal/addon-access.component';
import { FeatureAccessDirective } from 'src/app/feature-access-component/feature-access-component.component';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';

const directorDetailsModuleRoute: Routes = [
	{ path: ':directorName/:directorLink', data: { breadcrumb: 'Director Details' }, component: DirectorDetailsComponent }
]

@NgModule({
	imports: [
		HttpClientModule,
		RouterModule.forChild( directorDetailsModuleRoute ),
		CommonModule,
		TableModule,
		DropdownModule,
		CardModule,
		ButtonModule,
		InputTextModule,
		PaginatorModule,
		DialogModule,
		ChartModule,
		ProgressSpinnerModule,
		ConfirmDialogModule,
		OverlayPanelModule,
		FormsModule,
		NoAuthPagesModule,
		MessagesModule,
		MessageModule,
		SharedTablesModule,
		RadioButtonModule,
		TabViewModule,
		LoginAccessModalComponent,
		AddOnAccessDirective,
		FeatureAccessDirective,
		ChipModule,
		AccordionModule
	],
	declarations: [
		DirectorDetailsComponent,
		DirectorPdfReportComponent,
		DetailsComponent,
	],
	providers: [
		TitleCasePipe, NumberSuffixPipe, CurrencyPipe, ConfirmationService, DatePipe,  httpInterceptorProviders
	]
})
export class DirectorModuleModule { }
