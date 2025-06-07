import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';
import { CompanyRelationsTreeComponent } from './company-relations-tree.component';
import { MessagesModule } from 'primeng/messages';

const companyRelationTreeRoute: Routes = [
	{ path: ':directorsName/:directorsId/:officerRole', data: { breadcrumb: 'Relations' }, component: CompanyRelationsTreeComponent }
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild( companyRelationTreeRoute ),
		HttpClientModule,
		FormsModule,
		TreeModule,
		TreeTableModule,
		ButtonModule,
		ProgressSpinnerModule,
		MessagesModule
	],
	declarations: [
		CompanyRelationsTreeComponent
	],
	providers: [
		TitleCasePipe, CanonicalURLService, httpInterceptorProviders
	]
})
export class CompanyRelationsTreeModule { }
