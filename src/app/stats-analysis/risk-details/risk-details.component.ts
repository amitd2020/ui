import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'dg-risk-details',
    templateUrl: './risk-details.component.html',
    styleUrls: ['./risk-details.component.scss' ],
})
export class RiskDetailsComponent implements OnInit, OnChanges {

    @Input() riskData: Array<any> = [];
    @Input() selectedFilter: Array<any> = [];

    tableColumn: Array<any> = [];
    tableData: Array<any> = [];
    graphDataset: { labels?: Array<any>, datasets?: Array<{ data: Array<any>, backgroundColor?: Array<any> }> } = {
        labels: [],
        datasets: [
            { data: [], backgroundColor: [] }
        ]
    };

    addLabelInRiskDataObj: object = {
        veryLowRisk: 'Very Low risk',
        lowRisk: 'Low Risk',
        moderateRisk: 'Moderate Risk',
        highRisk: 'High Risk',
        notScored: 'Not Scored',
        'not specified': 'Not Specified'
    }
    bgColorForRisk: object = {
        veryLowRisk: '#6DC470',
        lowRisk: '#59BA9B',
        moderateRisk: '#FFC201',
        highRisk: '#E4790F',
        notScored: '#D92727',
        'not specified': '#b4b4b4'
    }
    riskTableAttribute: object = {
        scrollHeight: '25rem',
        chipGroupName: 'Bands'
    }

    checkEstimatedTurnover = true;
    cardView: 'Chart' | 'Table' = 'Table';


    ngOnInit() {

        //? prepared column Array and column styles
        /** 
         * ?showProgressBarWithPercentage ( true ) => show progress bar with the percentage count
         * ?showProgressbar ( true ) => show only progress bar
         * ?show count only don't need to send anything 
        */

        this.tableColumn = [
            { field: 'label', header: '', minWidth: '70px', maxWidth: 'none', textAlign: 'left', class: 'text-base' },
            { field: 'count', header: "Company's Count", minWidth: '80px', maxWidth: '80px', textAlign: 'right', class: 'font-semibold' },
            { field: 'count_percentage', header: 'Count %', minWidth: '90px', maxWidth: '90px', textAlign: 'right', showProgressBarWithPercentage: true, class: 'font-semibold' },
        ]

        if ( this.riskData && this.riskData.length ) {
            this.riskDataHandler();
        }

    }

    ngOnChanges(changes: SimpleChanges) {
        if ( changes && changes?.riskData && changes?.riskData?.currentValue && changes?.riskData?.currentValue.length ) {
            this.riskDataHandler();
        }
    }

    riskDataHandler() {
        //? prepared data Array and data styles
        this.tableData = [];
        this.tableData = this.riskData.map( item => {
            item['label'] = this.addLabelInRiskDataObj[ item.field ];
            item['colorCode'] = this.bgColorForRisk[ item.field ];
            item['count_percentage'] = item['count_percentage'].toFixed(1);
            return item;
        } )

        //? prepared data for doughnut
        this.preparedGraphData( this.tableData );
    }

    receivedToggleChange( event: 'Chart' | 'Table' ) {
        this.cardView = event;
    }

    preparedGraphData( datArray: Array<any> ) {

        let tempGraphDataset = JSON.parse( JSON.stringify( this.graphDataset ) );
        this.graphDataset = {};

        tempGraphDataset['labels'] = [];
        tempGraphDataset['datasets'][0]['data'] = [];
        tempGraphDataset['datasets'][0]['backgroundColor'] = [];

        datArray.forEach( item => {
            tempGraphDataset['labels'].push( item?.label );
            tempGraphDataset['datasets'][0]['data'].push( item?.count )
            tempGraphDataset['datasets'][0]['backgroundColor'].push( item?.colorCode )
        } )

        this.graphDataset = tempGraphDataset;
    }
}
