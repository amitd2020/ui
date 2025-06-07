import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-view-shareholdings',
	templateUrl: './view-shareholdings.component.html',
	styleUrls: ['./view-shareholdings.component.scss']
})
export class ViewShareholdingsComponent implements OnInit {

	viewShareholdingsTableColumns: Array<any>;
	viewShareholdingsTableData: Array<any>;

	constructor(
		private activeRoute: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService

	) {
		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "View Shareholdings" }
		// 	]
		// );
	}

	ngOnInit() {

        this.viewShareholdingsTableColumns = [
			{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'businessName', header: 'Company Name', minWidth: '450px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'shareHolderName', header: 'Name', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'shareHolderAsCompanyStatus', header: 'Status', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
			{ field: 'shareType', header: 'Share Type', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'currency', header: 'Currency', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'percentage_share', header: '% of Total Share Count', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
			{ field: 'value', header: 'Nominal Value', minWidth: '130px', maxWidth: '130px', textAlign: 'right' }
        ];

		this.getPersonShareholdings();

	}

	getPersonShareholdings() {

		this.sharedLoaderService.showLoader();

		let reqObj = { 
			shareholderPnr: JSON.parse( this.activeRoute.snapshot.queryParams['personInfo'] ) 
		};

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_COMPANY_DETAILS', 'getPersonShareHoldings', reqObj).subscribe(res => {

			if ( res.body['status'] == 200 ) {
				this.viewShareholdingsTableData = this.formatShareHoldingData(res.body['results']);

				for (let shareHolder of this.viewShareholdingsTableData ) {
	
					let full_name = "";
					let shareholder_Address = "";
	
					if ( shareHolder.share_holders_details.shareholderForename ) {
						full_name = shareHolder.share_holders_details.shareholderForename;
	
					}

					if ( shareHolder.share_holders_details.shareholderSurname ) {
						full_name += ' ' + shareHolder.share_holders_details.shareholderSurname;
					}
					
					if ( shareHolder["value"] ) {
						shareHolder["value"] = parseFloat(shareHolder["value"].toFixed(2));
					}
	
					shareHolder["full_name"] = full_name;
					shareHolder["shareholder_Address"] = shareholder_Address;
			
					let shareHolderNameObj = {
						name: shareHolder.full_name,
						link: shareHolder.share_holder_reg,
					}
					
					shareHolder['businessName'] = shareHolder.companyInformation.businessName;
					shareHolder['shareHolderName'] = shareHolderNameObj;
					shareHolder['shareHolderAsCompanyStatus'] = shareHolder['companyStatus'];
				}

				this.sharedLoaderService.hideLoader();

			}

		});
	}

	formatShareHoldingData( dataArray ){
		dataArray.forEach(element => {
		  if (element.totalShareCount !== undefined && element.totalShareCount !== null && element.totalShareCount > 0 ) {
			  element["percentage_share"] = ((element.numberOfSharesIssued * element.value) / element.totalShareCount ) * 100
			  element["percentage_share"] = parseFloat(element["percentage_share"]).toFixed(2);
		  } else {
			element["percentage_share"] = ""
		  }
		});
		return dataArray;
	  }

}
