import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ReadMoreDirective } from "./read-more.directive";

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		ReadMoreDirective
	],
	exports: [
		ReadMoreDirective
	]
})
export class ReadMoreDirectiveModule { }