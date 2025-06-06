import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'dg-financial-details',
    templateUrl: './financial-details.component.html',
    styleUrls: ['./financial-details.component.scss'],
})
export class FinancialDetailsComponent implements OnInit, OnChanges {

    @Input() growthData: object = {};
    @Input() selectedFilter: any;

    tableColumn = [
        {
            field: 'label',
            header: '',
            minWidth: '70px',
            maxWidth: 'none',
            textAlign: 'left',
            class: 'text-base font-semibold',
        },
        {
            field: 'count',
            header: "Company's Count",
            minWidth: '80px',
            maxWidth: '80px',
            textAlign: 'right',
            class: 'font-semibold',
        },
        {
            field: 'count_percentage',
            header: 'Count %',
            minWidth: '90px',
            maxWidth: '90px',
            textAlign: 'right',
            showProgressBarWithPercentage: true,
            class: 'font-semibold',
        },
    ];
    tableColumn1 = [
        // { field: 'label', header: '', minWidth: '70px', maxWidth: 'none', textAlign: 'left', class: 'text-base' },
        {
            field: 'count',
            header: "Company's Count",
            minWidth: '30px',
            maxWidth: '30px',
            textAlign: 'right',
            class: 'font-semibold',
        },
        {
            field: 'count_percentage',
            header: 'Count %',
            minWidth: '90px',
            maxWidth: '90px',
            textAlign: 'right',
            showProgressBarWithPercentage: true,
            class: 'font-semibold',
        },
    ];

    growthTableData = {
        '1yearGrowth': [],
        '3yearGrowth': [],
        '5yearGrowth': [],
    };
    tableData: any[] = [];

    ngOnInit() {

		// this.initializeGrowthData()
    }

	
	ngOnChanges(changes: SimpleChanges) {
		if ( changes && changes?.growthData && changes?.growthData?.currentValue  ) {
			this.initializeGrowthData();
		}
	}

	initializeGrowthData() {

        let keyArray = Object.keys(this.growthData);
        if (keyArray && keyArray.length) {
            keyArray.forEach((key) => {
                if (this.growthData[key] && this.growthData[key].length) {
                    this.growthDataPrepared(key, this.growthData[key]);
                }
            });
        }
	}

    growthDataPrepared(key, data) {
        this.tableData = data.map( item => {
            item['count_percentage'] = item['count_percentage'] ? item['count_percentage'].toFixed(1) : 0;
            return item;
        });

        this.growthTableData[key] = this.tableData;
    }
}
