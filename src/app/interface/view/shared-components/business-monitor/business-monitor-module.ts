import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessMonitorComponent } from './business-monitor.component';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedTablesModule } from '../shared-tables/shared-tables.module';

@NgModule({
    imports: [
        CommonModule,
        MessagesModule,
        ConfirmDialogModule,
        SharedTablesModule
    ],
    declarations: [ BusinessMonitorComponent ],
    exports: [ BusinessMonitorComponent ],
    providers: [],
})
export class businessMonitorModule { }
