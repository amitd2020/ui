import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedLoaderComponent } from './shared-loader.component';



@NgModule({
	declarations: [
		SharedLoaderComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		SharedLoaderComponent
	]
})
export class SharedLoaderModule { }
