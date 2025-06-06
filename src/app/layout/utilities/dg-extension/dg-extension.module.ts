import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CompanyDetailsDgExtnComponent } from './company-details-dg-extn/company-details-dg-extn.component';
import { CompanyDetailsViewModule } from 'src/app/interface/view/features-modules/company-details-module/company-details-view.module';

const DgExtensionModuleRoutes: Routes = [
	{ path: 'extension/:companyNo/:companyName', component: CompanyDetailsDgExtnComponent }
]

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild(DgExtensionModuleRoutes),
		CompanyDetailsViewModule
	],
	declarations: [
		CompanyDetailsDgExtnComponent
	],
	providers: [ ]

})
export class DgExtensionModule { }
