import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/interface/auth-guard/auth-guard.guard';
import { httpInterceptorProviders } from 'src/app/interface/interceptors/http-interceptors';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppCodeModule } from 'src/app/layout/utilities/app.code.component';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { MessagesModule } from 'primeng/messages';
import { TabViewModule } from 'primeng/tabview';
import { ApiSectionComponent } from './api-section/api-section.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { HelpVideosComponent } from './help-videos/help-videos.component';
import { UploadCsvComponent } from '../../shared-components/upload-csv/upload-csv.component';

import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { SharedTablesModule } from '../../shared-components/shared-tables/shared-tables.module';
import { FeatureAccessDirective } from 'src/app/feature-access-component/feature-access-component.component';
import { CheckboxModule } from 'primeng/checkbox';
import { LinkedinUploadCsvComponent } from './linkedin-csv-upload/linkedin-upload-csv.component';
import { UploadCsvModule } from '../../shared-components/upload-csv/upload-csv.module';
import { WorkflowService } from '../workflow/workflow.service';
import { AddCompanyToListModule } from '../../shared-components/add-company-to-list/add-company-to-list.module';


const commonFeaturesRoutes: Routes = [
	{
		path: 'upload-csv',
		data: { breadcrumb: 'Upload CSV' },
		component: UploadCsvComponent,
		canActivate: [ AuthGuardService ],
		canActivateChild: [ AuthGuardService ]
	},
	{
		path: 'upload-your-network',
		data: { breadcrumb: 'Upload Your Network' },
		component: LinkedinUploadCsvComponent,
		canActivate: [ AuthGuardService ],
		canActivateChild: [ AuthGuardService ]
	},
	{
		path: 'feedback',
		data: { breadcrumb: 'Feedback' },
		component: FeedbackFormComponent,
		canActivate: [ AuthGuardService ],
		canActivateChild: [ AuthGuardService ]
	},
	{
		path: 'api-section',
		data: { breadcrumb: 'API Selection' },
		component: ApiSectionComponent,
		canActivate: [ AuthGuardService ],
		canActivateChild: [ AuthGuardService ]
	},
	{ path: 'videos', component: HelpVideosComponent }
]

@NgModule({
	imports: [
		HttpClientModule,
		RouterModule.forChild( commonFeaturesRoutes ),
		MessagesModule,
		InputTextModule,
		ButtonModule,
		FileUploadModule,
		DialogModule,
		FormsModule,
		CommonModule,
		RadioButtonModule,
		CardModule,
		TabViewModule,
		ScrollPanelModule,
		AppCodeModule,
		ListboxModule,
		NoAuthPagesModule,
		SharedTablesModule,
		FeatureAccessDirective,
		CheckboxModule,
		UploadCsvModule,
		AddCompanyToListModule
	],
	declarations: [
		FeedbackFormComponent,
		ApiSectionComponent,
		HelpVideosComponent,
		// UploadCsvComponent,
		LinkedinUploadCsvComponent
	],
	providers: [
		httpInterceptorProviders,
		WorkflowService
	]

})
export class CommonFeaturesModule { }
