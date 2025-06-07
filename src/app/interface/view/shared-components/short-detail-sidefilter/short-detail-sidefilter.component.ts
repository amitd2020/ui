import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'dg-short-detail-sidefilter',
	templateUrl: './short-detail-sidefilter.component.html',
	styleUrls: ['../filter-sidebar-refactored/filter-sidebar.component.scss'],
    animations: [
        trigger( 'slideSidePanel', [
            transition(":enter", [
                style({ transform: 'translateX(100%)' }),
                animate(500, style({ transform: 'translateX(0)' }))
            ]),
            transition(":leave", [
                animate(500, style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class ShortDetailSidefilterComponent implements OnInit {

	title : string =  '';
    description : string =  '';
    keywords : string =  '';
    robots : string =  ''; // 'index, follow, noindex, nofollow'

    @ViewChild('filterSearchContainer', { static: false }) filterSearchContainer: ElementRef;

    @Input() showCompanySideDetailsInputBool: boolean = false;

    @Output() showCompanySideDetailsOutputBool = new EventEmitter<boolean>();

    @Input() companySideDetailsParams: any;

    @Input() overviewName: string;

    @Input() coporateSideOverviewData: object;
    
    dataArray;

	constructor() { }

	ngOnInit() {}
	
	closeSidebar() {
        this.filterSearchContainer.nativeElement.classList.remove('showFilters');
        this.showCompanySideDetailsInputBool = false;
        this.showCompanySideDetailsOutputBool.emit(this.showCompanySideDetailsInputBool)
    }

}
