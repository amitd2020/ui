import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-net-zero',
  templateUrl: './net-zero.component.html',
  styleUrls: ['./net-zero.component.scss']
})
export class NetZeroComponent implements OnInit {

  totalCount: number;
  netZeroDataColumn: Array<any> = [];
  netZeroData: Array<any> = [];

  constructor( 
    private globalServerCommunication: ServerCommunicationService,
    private sharedLoaderService: SharedLoaderService) {}
  
  ngOnInit() {
    this.netZeroDataColumn = [
		    { field: 'Company Name', header: 'Company Name', minWidth: '270px', maxWidth: 'none', textAlign: 'left', value: true },
		    { field: 'Company Number', header: 'Company Number', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
			{ field: 'Action', header: 'Action', minWidth: '130px', maxWidth: '130', textAlign: 'left', value: true },
			{ field: 'Base Year', header: 'Base Year', minWidth: '130px', maxWidth: '130px', textAlign: 'center', value: true },
			{ field: 'Commitment Deadline', header: 'Commitment Deadline', minWidth: '180px', maxWidth: '180px', textAlign: 'center', value: true },
			{ field: 'Company Temperature Alignment', header: 'Temperature Alignment', minWidth: '190px', maxWidth: '190px', textAlign: 'right', value: true },
			{ field: 'Date Published', header: 'Date Published', minWidth: '140px', maxWidth: '140px', textAlign: 'center', value: true },
			// { field: 'Location', header: 'Location', minWidth: '140px', maxWidth: '140px', textAlign: 'left', value: true },
			{ field: 'Organization Type', header: 'Organization Type', minWidth: '140px', maxWidth: '140px', textAlign: 'left', value: true },
			{ field: 'Commitment Type', header: 'Commitment Type', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
			{ field: 'Reason for commitment extension or removal', header: 'Reason for commitment extension or removal', minWidth: '240px', maxWidth: '240px', textAlign: 'left', value: true },
			// { field: 'Region', header: 'Region', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'Scope', header: 'Scope', minWidth: '130px', maxWidth: '130px', textAlign: 'right', value: true },
			{ field: 'Sector', header: 'Sector', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
			{ field: 'Status', header: 'Status', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'Sub-type', header: 'Sub-type', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'Target', header: 'Target', minWidth: '140px', maxWidth: '140px', textAlign: 'left', value: true },
			{ field: 'Target Classification', header: 'Target Classification', minWidth: '140px', maxWidth: '140px', textAlign: 'right', value: true },
			{ field: 'Target Value', header: 'Target Value', minWidth: '130px', maxWidth: '130px', textAlign: 'right', value: true },
			{ field: 'Target Wording', header: 'Target Wording', minWidth: '270px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'Target Year', header: 'Target Year', minWidth: '130px', maxWidth: '130px', textAlign: 'center', value: true },
			{ field: 'Type', header: 'Type', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'Year Type', header: 'Year Type', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true }
		];

    this.getResultsForNetZero();
  }

  getResultsForNetZero() {
    this.sharedLoaderService.showLoader();
    this.globalServerCommunication.globalServerRequestCall('get', 'DG_LIST', 'netZeroTargetCompanies').subscribe( res  =>{
      if ( res.status == 200 ) {
        this.sharedLoaderService.hideLoader();
        this.netZeroData = res.body.results;
        this.totalCount = res.body.total;
      }

    });
  }
}
