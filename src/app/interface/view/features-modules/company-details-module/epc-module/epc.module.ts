import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';

import { EpcComponent } from './epc/epc.component';

@NgModule({
	imports: [
		HttpClientModule,
		CommonModule,
		FormsModule,
		ButtonModule,
		ProgressSpinnerModule,
		ToastModule,
		ConfirmDialogModule,
		DialogModule,
		ListboxModule,
		TableModule,
		AccordionModule,
		TagModule
	],
	declarations: [
		EpcComponent
	],
	exports: [
		EpcComponent
	],
	providers: [
		ConfirmationService, MessageService
	]
})
export class EpcModule { }
