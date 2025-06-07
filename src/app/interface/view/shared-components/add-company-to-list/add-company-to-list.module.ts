import { NgModule } from '@angular/core';

import { AddCompanyToListComponent } from './add-company-to-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NoAuthPagesModule } from 'src/app/no-auth-pages/no-auth-pages.module';
import { ListboxModule } from 'primeng/listbox';
import { WorkflowService } from '../../features-modules/workflow/workflow.service';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ListboxModule,
        NoAuthPagesModule,
        KeyFilterModule,
        MessagesModule
    ],
    declarations: [
        AddCompanyToListComponent
    ],
    exports: [
        AddCompanyToListComponent
    ],
    providers: [
        WorkflowService
    ],
})
export class AddCompanyToListModule { }
