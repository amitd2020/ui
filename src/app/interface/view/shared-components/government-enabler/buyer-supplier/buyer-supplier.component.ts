import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'dg-buyer-supplier',
  templateUrl: './buyer-supplier.component.html',
  styleUrls: ['./buyer-supplier.component.scss']
})

export class BuyerSupplierComponent implements OnInit {

	routerUrl: string;
	showRawCriteria: boolean = false;
	
	selectedItem: any;
	sendContractData: any = {};
	keyPayloadStructure: any = {}
	
	tableCols: any[] = [];
	tableData: any[] = [];
	suggestions: any[] = [];

	constructor( private router: Router, private serverCommunicationService: ServerCommunicationService, private sharedLoaderService: SharedLoaderService, private userAuthService: UserAuthService, private titlecase: TitleCasePipe ) {

		this.routerUrl = this.router.routerState.snapshot.url.split('/')[2];
		this.keyPayloadStructure = {
			buyer: {
				endpoint: 'getContractFinderDataForBuyer',
				payloadData: {
					filterData: [],
				},
				aggregationData: {
					aggregateBy: 'buyer_name.keyword',
					searchKeyword: '',
					userId: this.userAuthService.getUserInfo('dbID')
				},
				onSearchCriteria:{
					chipGrp: 'Buyer Name (Raw)',
					chipVal: [],
				},
				sendToOtherComp: {
					buyerName: 'Buyer Name (Raw)',
					buyerGroupName: 'Buyer Name'
				}
			},
			supplier: {
				endpoint: 'getContractFinderDataForSupplier',
				payloadData: {
					filterData: []
				},
				aggregationData: {
					aggregateBy: 'suppliers.name.keyword',
					searchKeyword: '',
					userId: this.userAuthService.getUserInfo('dbID')
				},
				onSearchCriteria:{
					chipGrp: 'Supplier Name (Raw)',
					chipVal: [],
				},
				sendToOtherComp: {
					supplierName: 'Supplier Name (Raw)',
					supplierGroupName: 'Supplier Name'
				}
			}
		}
	} 

	ngOnInit() {

		if ( this.routerUrl == 'buyer' ) {
			this.tableCols = [
				{ field: 'buyerName', header: 'Buyer Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'buyerGroupName', header: 'Buyer Group Name', minWidth: '300px', maxWidth: '300px', textAlign: 'left' },
				{ field: 'noticeTypes', header: 'Procurement Stage', minWidth: '250px', maxWidth: 'none', textAlign: 'right' },
				{ field: 'contractStatus', header: 'Procurement Stage Status', minWidth: '250px', maxWidth: 'none', textAlign: 'right' },
				{ field: 'awardedValue', header: 'Total Awarded Value', minWidth: '200px', maxWidth: '200px', textAlign: 'right' }
			];
		} else {
			this.tableCols = [
				{ field: 'supplierName', header: 'Supplier Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'supplierGroupName', header: 'Supplier Group Name', minWidth: '300px', maxWidth: '300px', textAlign: 'left' },
				{ field: 'noticeTypes', header: 'Procurement Stage', minWidth: '250px', maxWidth: 'none', textAlign: 'right' },
				{ field: 'contractStatus', header: 'Procurement Stage Status', minWidth: '250px', maxWidth: 'none', textAlign: 'right' },
				{ field: 'awardedValue', header: 'Total Awarded Value', minWidth: '200px', maxWidth: '200px', textAlign: 'right' }
			];
		}

		this.getBuyerSupplierResults();
	}

	getBuyerSupplierResults() {
		this.sharedLoaderService.showLoader();

		this.serverCommunicationService.globalServerRequestCall( 'post', 'DG_GOVTENABLER_API', this.keyPayloadStructure[this.routerUrl].endpoint, this.keyPayloadStructure[this.routerUrl].payloadData ).subscribe( {
			next: ( res ) => {
				if ( res.body.status == 200 ) {
					this.tableData = res.body.tableData || [];
					this.sharedLoaderService.hideLoader();
				}
			},
			error: ( err ) => {
				this.sharedLoaderService.hideLoader();
				console.log(err)
			}
		})
	}

	suggestionForBuyerSupplierName(event) {
		this.keyPayloadStructure[this.routerUrl].aggregationData.searchKeyword = event.query.toLowerCase();
		
		this.serverCommunicationService.globalServerRequestCall( 'post', 'DG_API', 'getAggregateByParamContractFinder', this.keyPayloadStructure[this.routerUrl].aggregationData ).subscribe( {
			next: ( res ) => {
				if ( res.status == 200 ) {
					this.suggestions = res.body?.distinct_categories?.buckets || [];

					for( let item of this.suggestions ) {
						item['label'] = this.titlecase.transform( item?.key );
					}
				}
			},
			error: ( err ) => {
				console.log(err);
			}
		} )
	}

	searchEnteredResult( event ) {
		this.keyPayloadStructure[this.routerUrl].payloadData.filterData = [];
		this.keyPayloadStructure[this.routerUrl].onSearchCriteria.chipVal = [];
		this.keyPayloadStructure[this.routerUrl].onSearchCriteria.chipVal = [ this.selectedItem?.key || event?.value.toLowerCase() ];
		this.keyPayloadStructure[this.routerUrl].payloadData.filterData.push( { chip_group: this.keyPayloadStructure[this.routerUrl].onSearchCriteria.chipGrp, chip_values: this.keyPayloadStructure[this.routerUrl].onSearchCriteria.chipVal } );
		this.getBuyerSupplierResults();
	}

	searchCommunicator( event ) {
		this.showRawCriteria = true;
		this.sendContractData = {};
		this.sendContractData['chipGroup'] = this.keyPayloadStructure[this.routerUrl].sendToOtherComp[event.field];
		this.sendContractData['chipValue'] = event.rowData[event?.field].toLowerCase();
	}

}