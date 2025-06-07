import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { UploadCsvComponent } from './upload-csv.component';
import { FormsModule } from '@angular/forms';
import { AddCompanyToListModule } from '../add-company-to-list/add-company-to-list.module';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({    
	imports: [
		CommonModule,
        MessagesModule,
        MessageModule,
		CardModule,
		ListboxModule,
		CheckboxModule,
		RadioButtonModule,
		DialogModule,
		FileUploadModule,
		FormsModule,
		AddCompanyToListModule,
		InputTextModule
	],
    exports: [ UploadCsvComponent ],
    declarations: [ UploadCsvComponent ],
    providers: [],
})
export class UploadCsvModule { }
