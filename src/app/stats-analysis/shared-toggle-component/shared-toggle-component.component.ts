import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'dg-shared-toggle-component',
    templateUrl: './shared-toggle-component.component.html',
    styleUrls: ['./shared-toggle-component.component.scss'],
})
export class SharedToggleComponentComponent {

	@Input() toggleLabel: object = { leftSide: 'Table', rightSide: 'Chart' };
    @Input() toggleId: string;
    @Output() toggleChange = new EventEmitter<any>();


    toggleClick(event: any) {
        const checkbox = event.target;
        let emitValue = this.toggleLabel[ 'leftSide' ];

        if ( checkbox?.checked ) {
            emitValue = this.toggleLabel[ 'rightSide' ];
        }
        
		this.toggleChange.emit( emitValue )
    }

}
