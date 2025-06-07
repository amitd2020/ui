import { NgModule } from '@angular/core';

import { OtherRelatedCompaniesComponent } from './other-related-companies.component';
import { CommonModule } from '@angular/common';
import { SharedTablesModule } from '../shared-tables/shared-tables.module';

@NgModule({
	imports: [
		CommonModule,
		SharedTablesModule
	],
	declarations: [ OtherRelatedCompaniesComponent ],
	exports: [ OtherRelatedCompaniesComponent ],
	providers: [],
})
export class OtherRelatedCompaniesModule { }
