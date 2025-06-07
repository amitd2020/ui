import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: "[tableHeaderToolTip]",
})

export class ToolTipDirective implements OnInit {

	constructor(
		private viewContainerRef: ViewContainerRef,
		private template: TemplateRef<any>
	) { }
 
	ngOnInit() {
		this.viewContainerRef.createEmbeddedView(this.template);
	}

}
