import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BulkTagComponent } from './bulk-tag/bulk-tag.component';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
  declarations: [
    BulkTagComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    ListboxModule,
  ],
  exports: [
    BulkTagComponent
  ]
})
export class BulkTaggingModule { }
