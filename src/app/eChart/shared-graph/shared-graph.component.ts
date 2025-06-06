import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

function RequiredInput(): PropertyDecorator {
	return (target: any, propertyKey: string) => {
	  if (!target?.constructor?.requiredInputs) {
		target.constructor.requiredInputs = [];
	  }
	  target?.constructor?.requiredInputs.push(propertyKey);
	};
}
@Component({
    selector: 'dg-shared-graph',
    templateUrl: './shared-graph.component.html',
    styleUrls: ['./shared-graph.component.scss'],
})
export class SharedGraphComponent implements OnInit {

    @Input() @RequiredInput() chartOptions!: any;
    @Input() chartStyles: { width?: string, height: string } = { height: '400px' };
	@Output() updateClickInChart = new EventEmitter<any>();

    ngOnInit() {

		const requiredInputs: string[] = (this.constructor as any)?.requiredInputs || [];
		if ( requiredInputs === undefined || requiredInputs === null ){
			requiredInputs.forEach(input => {
				if (this[input] === undefined || this[input] === null) {
					throw new Error(`Input '${input}' is required in ${this.constructor?.name}.`);
				}
			});
		}

    }
	onChartClick(event) {
		this.updateClickInChart.emit( event );
    }
}
