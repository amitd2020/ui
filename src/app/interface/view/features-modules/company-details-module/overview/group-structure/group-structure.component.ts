import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
	selector: 'dg-group-structure',
	templateUrl: './group-structure.component.html',
	styleUrls: ['./group-structure.component.scss']
})
export class GroupStructureComponent implements OnInit {

	companyData: any;
	companyNumber: any;
	reportGeneratedDate: Date = new Date();

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;
	
	forTableView: boolean = false;

	groupStructureTableCols: Array<any> = [];

	treeOrientation: any = 'horizontal';
	selectedGlobalCurrency: string = 'GBP';
	msgs = [];

	constructor(
		private dataCommunicatorService: DataCommunicatorService,
		public commonService: CommonServiceService,
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private httpClient: HttpClient,
		private toTitleCasePipe: TitleCasePipe,
		public router: Router
	) { }

	ngOnInit() {

		this.sharedLoaderService.showLoader();
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => this.companyData = res);
		this.companyNumber = this.companyData.companyRegistrationNumber;
		this.getGroupStructure();

		this.groupStructureTableCols = [
			{ field: 'label', header: 'Name', width: '450px', textAlign: 'left' },
			{ field: 'data', header: 'Company Number', width: '150px', textAlign: 'center' },
			// { field: 'nationality', header: 'Nationality', width: '150px', textAlign: 'center' },
			{ field: 'companyStatus', header: 'Company Status', width: '150px', textAlign: 'center' },
			{ field: 'percentageShare', header: 'Share Percent', width: '240px', textAlign: 'left' },
			{ field: 'internationalScoreDescription', header: 'Risk Band', width: '220px', textAlign: 'center' },
			{ field: 'person_entitled', header: 'Person Entitled', width: '350px', textAlign: 'left' },
			// { field: 'safeAlerts', header: 'Safe Alerts', width: '100px', textAlign: 'center' },
			{ field: 'chargesCount', header: 'Number of Charges', width: '150px', textAlign: 'right' },
			{ field: 'numLandCorporate', header: 'Property Owned Count', width: '170px', textAlign: 'right' },
			{ field: 'ccjCount', header: 'Number of CCJ', width: '150px', textAlign: 'right' },
			{ field: 'numberOfEmployees', header: 'Number of Employees', width: '150px', textAlign: 'right' },
			{ field: 'netWorth', header: 'Net Worth', width: '150px', textAlign: 'right' },
			{ field: 'turnover', header: 'Turnover', width: '150px', textAlign: 'right' },
			{ field: 'totalAssets', header: 'Total Assets', width: '150px', textAlign: 'right' },
			{ field: 'totalLiabilities', header: 'Total Liabilities', width: '150px', textAlign: 'right' }
		];
	}

	getGroupStructure() {

		let compNo = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyGroupStructure', compNo ).subscribe( res => {

			if ( res.body['status'] == 200 ) {
				this.companyData['groupStructureData'] = res.body['results'];
				// if ( this.companyData['groupStructureData'][0] && this.companyData['groupStructureData'][0]['children'] ) {

				// 	this.companyData['groupStructureData'][0]['children'].filter( val => {
				// 		if ( val.person_entitled ){
				// 			let tempObj = {}
				// 			for ( let data of val.person_entitled){
				// 				if( tempObj[data] ){
				// 					tempObj[data] = ++tempObj[data];
				// 				} else {
				// 					tempObj[data] = 1;
				// 				}
				// 			}
				// 			val['person_entitled'] = Object.entries(tempObj)
				// 		}
				// 	});
				// }
				// if ( this.companyData['groupStructureData'][0] && this.companyData['groupStructureData'][0]['person_entitled'] ){
				// 	let tempObj = {}
				// 	for ( let data of this.companyData['groupStructureData'][0]['person_entitled']){
				// 		if( tempObj[data] ){
				// 			tempObj[data] = ++tempObj[data];
				// 		} else {
				// 			tempObj[data] = 1;
				// 		}
				// 	}
				// 	this.companyData['groupStructureData'][0]['person_entitled'] = Object.entries(tempObj)
				// }
				// this.showLoader = false;
			} 
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
		});
	}

	changeTreeOrientation() {
		if (this.treeOrientation == 'horizontal') {
			this.forTableView = true;
			this.treeOrientation = 'vertical';
		} else if (this.treeOrientation == 'vertical') {
			this.forTableView = false;
			this.treeOrientation = 'horizontal';
		}
	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	expandTreeOnSelectingNode(event) {
        if( event.originalEvent.toElement ) {

			if (event.originalEvent.toElement.outerHTML.includes("span")) {
				event.node.expanded = true;
				if (event.node.expanded !== undefined) {
					if (event.node.expanded == true) {
						event.node.expanded = false;
					} else {
						event.node.expanded = true;
					}
				} else {
					event.node.expanded = true;
				}
			}
		}
		
	}

	typeOfData(val: any) {
		return this.commonService.typeOfData(val);
	}

	reportGroupStructure(){

		this.sharedLoaderService.showLoader();
		
		let userIdWithoutLogin = this.userAuthService.getUserInfo()['dbID'];
		let param = [
			{key: 'companyNumber', value: this.companyData.companyRegistrationNumber},
			{key: 'isPlatform', value: true},
			{key:'_id', value: userIdWithoutLogin},
			{key: 'baseEncoded', value: true},
			{key: 'groupStructure', value: true}
		];
		let body = {
			"financial": false,
			"ccj": false,
			"charges": false,
			"corporateLand": false,
			"groupStructure": true,
			"aquasitionsAndMergers": false,
			"creditors": false,
			"badDebtors": false,
			"furlough": false,
			"patentData": false,
			"innovateGrantData": false,
			"importData": false,
			"exportData": false,
			"shareholders": false,
			"commentary": false,
			"directors": false,
			"psc": false,
			"tradingAddresses": false,
			"zScore": false,
			"cagr": false,
			"documents": false,
			"reportType": "companyReport"
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'REPORT', 'getCompanyReports', body, undefined, param ).subscribe(res => {
			if ( res.body.code == 200 ){
				this.sharedLoaderService.hideLoader();
				let { data } = res.body;
				const linkSource = 'data:application/pdf;base64,' + data;
				const downloadLink = document.createElement("a");
				const fileName = "DataGardener_" + (this.companyData.companyRegistrationNumber).toUpperCase() + "_" + this.toTitleCasePipe.transform(this.companyData.businessName.split(' ').join('_')) + "_" + this.formatDate(this.reportGeneratedDate) + '_' + '_Report.pdf';
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: "File Created Successfully" });
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
				
			} else {
				this.sharedLoaderService.hideLoader();
				this.msgs = [];
				this.msgs.push({ severity: 'error', summary: "Something went wrong." });
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
			}
			
		} )
	}

	formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

	// goToTab(rowData, routes: string ) {

	// 	// this.dataCommunicatorService.childComponentUpdateData( routes );
	// }

	goToTab( compNumber, cmpName, tab ) {

		let urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company/' + compNumber + '/' + this.formatCompanyNameForUrl( cmpName ) ], { queryParams: { type: tab } } ) );

		window.open( urlStr, '_blank' );
    }

	onNodeSelect(event: any) {
		this.expandAllNodes(this.companyData?.groupStructureData);
	}
	
	private expandAllNodes(nodes: TreeNode[]) {
		if (nodes) {
			nodes.forEach(node => {
				node.expanded = true;
				this.expandAllNodes(node.children);
			});
		}
	}

}
