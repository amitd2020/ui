import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutomationSchedulerComponent } from './automation-scheduler/automation-scheduler.component';

const companyRelationTreeRoute: Routes = [
	{ path: 'automation-scheduler', data: { breadcrumb: 'Automation Scheduler' }, component: AutomationSchedulerComponent }
]

@NgModule({

	imports: [
		CommonModule,
		RouterModule.forChild(companyRelationTreeRoute),
		HttpClientModule,
		MessageModule,
		TableModule,
		FormsModule,
		DialogModule,
		ConfirmDialogModule,
		DropdownModule,
		MessagesModule

	],
	declarations: [	
		AutomationSchedulerComponent
  ],
	providers: [
		MessageService, ConfirmationService
	]

})
export class AutomationModuleModule { }
