import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[addPercent]',
})
export class AddPercentDirective implements AfterViewInit, OnChanges {
	@Input() addPercentage: boolean = false;
	@Input() inputValue: any;

    constructor( 
		private el: ElementRef<HTMLInputElement> 
	) {}

	ngOnChanges( changes: SimpleChanges ) {

		if ( changes &&  changes.inputValue && changes.inputValue.currentValue ) {
			this.renderElement();
		} else {
			this.removeElement();
		}

	}

	ngAfterViewInit() {

		this.renderElement()
	}

	renderElement() {
		if (this.el && this.el.nativeElement && this.addPercentage) {

            const inputElement = this.el.nativeElement.querySelector('.p-inputtext');
			
			
            if (inputElement && this.inputValue ) {
				
				const percentageSymbol = this.el.nativeElement.querySelector('.percentage-symbol');
				if ( percentageSymbol ) percentageSymbol.remove();

				let width: any = this.getTextWidth( this.inputValue, '.875rem Roboto, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif' );

				if ( width <= 41.27 ) {
					width = ( width + 17 ) + 'px';
				} else if ( width > 41.27 && width <= 61.99 ) {
					width = ( width + 20.2 ) + 'px';
				} else if ( width > 55.8 ) {
					width = '100%';
				}

                inputElement.insertAdjacentHTML('afterend', `<span class="percentage-symbol" style="position: relative; right: calc(100% - ${width}); top: 9px">%</span>`);
            }


        }
	}

	getTextWidth( text, font ) {
		var canvas = this.getTextWidth['canvas'] || (this.getTextWidth['canvas'] = document.createElement("canvas"));
		var context = canvas.getContext("2d");
		context.font = font;
		var metrics = context.measureText(text);
		return metrics.width;
	}

	removeElement() {

		const percentageSymbol = this.el.nativeElement.querySelector('.percentage-symbol');

		if (percentageSymbol) {
			percentageSymbol.remove();
		}

	}

}
