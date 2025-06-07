import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'dg-shared-count-card',
	templateUrl: './shared-count-card.component.html',
	styleUrls: ['./shared-count-card.component.scss']
})
export class SharedCountCardComponent implements OnInit {

	@Input() subTitle: string;
	@Input() dataValue: number;
	@Input() dataValuePercentage: number;
	@Input() cardColor: string;
	@Input() displayPercentageValue: boolean = true;
	@Input() iconClassName: string;
	@Input() materialIconClassName: string;
	
	dashArray: number = Math.PI * ( 45 * 2 ); // 45 is the radius
	icon: string = '';

	constructor(
		private toCurrencyPipe: CurrencyPipe
	) { }

	ngOnInit(): void {
		this.cardColor = this.cardColor ? `spclUI${ this.cardColor }Card` : '';
	}

	getDashOffsetValue() {
		return  this.dashArray - ( this.dashArray * this.dataValuePercentage / 100 );
	}

	getDataPercentage() {
		return this.toCurrencyPipe.transform(this.dataValuePercentage, '', '', '1.0-2' ) + '%';
	}

}
