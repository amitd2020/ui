import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAddonListComponent } from './shared-addon-list/shared-addon-list.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';



@NgModule({
  declarations: [
    SharedAddonListComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    CheckboxModule
  ],
  exports: [
    SharedAddonListComponent
  ]
})
export class SharedAddonListModule { }
