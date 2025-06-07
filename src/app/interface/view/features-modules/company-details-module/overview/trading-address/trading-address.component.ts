import { Component, OnInit } from '@angular/core';

import ChartDataLabels from "chartjs-plugin-datalabels";

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-trading-address',
	templateUrl: './trading-address.component.html',
	styleUrls: ['./trading-address.component.scss']
})
export class TradingAddressComponent implements OnInit {

	ChartDataLabelsPlugins = [ ChartDataLabels ];

	companyData: any;
	epcDetails: any;

	tradingAddressDetails: Array<any> = undefined;
	tradingGradeCountArray: Array<any> = [];
	tradingDomesticNonDomesticArray: Array<any> = [];
	tradingEpcNonEpcArray: Array<any> = [];

	epcCountsArray: Array<any> = [];

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	companyNumber: string = '';

	tradingAddressCount: any;

	gradeCountEpcArr: Array<any> = [];
	gradeCountEPCLabelsArr: Array<any> = [];
	gradeCountEPCColorArr: Array<any> = [];
	gradeCountDomesticLabelsArr: Array<any> = [];
	gradeCountDomesticColorArr: Array<any> = [];

	gradeCountEpcColorArray: Array<any> = [];

	tradingAddressDetailsColumn: any[];

	tradingAddressflagVal = [
		{ name: '*Registered Office' },
		{ name: '*Head Office' },
		{ name: '*Accountants Address' },
		{ name: '*Solicitors Address' }
	];
	countKeys: any;
	domesticNonDomesticCountsArray: Array<any> = [];
	countKeysArray: Array<any> = [];
	doughnutChartOptions: any;
	overallDoughnutData: {};
	totalEPCCountsData: {};
	totalDomesticNonDomesticCountsData: {};
	epcAndDomesticBlockOptions: {};
	epcThemeColors: { ratingColorA: string; ratingColorB: string; ratingColorC: string; ratingColorD: string; ratingColorE: string; ratingColorF: string; ratingColorG: string; };
	currentPlan: unknown;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		this.sharedLoaderService.showLoader();

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		// this.spinnerBoolean = true;
		this.getTradingAddressDetails();

		const root = document.querySelector(':root');

		this.epcThemeColors = {
			ratingColorA: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingA').trim(),
			ratingColorB: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingB').trim(),
			ratingColorC: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingC').trim(),
			ratingColorD: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingD').trim(),
			ratingColorE: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingE').trim(),
			ratingColorF: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingF').trim(),
			ratingColorG: getComputedStyle(root).getPropertyValue('--epcGrade-bg-colorRatingG').trim(),
		}

		this.doughnutChartOptions = {
			cutout: 50,
			elements: {
				arc: {
					borderWidth: 4
				}
			},
			plugins: {
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					color: 'white',
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 30,
					borderWidth: 3,
					padding: { top: 5, right: 6, bottom: 6, left: 6 },
					anchor: 'center',
					align: 'center',
					formatter: ( value ) => {
						return value;
					}
				},
				legend: {
					display: false,
					labels: {
						usePointStyle: true
					}
				},
				tooltip: {
					callbacks: {
						label: function(tooltipItems, data) {  
							return data.labels[tooltipItems.index];
						}
					}
				},
			},
			animation: {
				duration: 1000,
				easing: 'easeInOutQuad'
			}
		};

		this.epcAndDomesticBlockOptions = {
			cutout: 65,
			elements: {
				arc: {
					borderWidth: 4
				}
			},
			plugins: {
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					color: 'white',
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 30,
					borderWidth: 3,
					padding: { top: 5, right: 6, bottom: 6, left: 6 },
					anchor: 'center',
					align: 'center',
					formatter: ( value ) => {
						return value;
					}
				},
				tooltip: {
					enabled: true,
					callbacks: {
						label: function( tooltipItems ) {
							return tooltipItems.label;
						}
					}
				},
				legend: {
					display: false,
					labels: {
						usePointStyle: true
					}
				},
			},
			animation: {
				duration: 1000,
				easing: 'easeInOutQuad'
			}
		};

	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	getTradingAddressDetails() {

		let reqObj = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'tradingAddressNew', reqObj ).subscribe( res => {

			let data = res.body;
			
			if ( data['totalEpcCertificate'] ) {
				this.epcCountsArray.push( data['totalEpcCertificate'] );
				this.gradeCountEPCLabelsArr.push( 'EPC' );
				this.gradeCountEPCColorArr.push('#66bb6a')
			}

			if ( data['totalLength'] ) {
				this.epcCountsArray.push( data['totalLength'] - data['totalEpcCertificate'] );
				this.gradeCountEPCLabelsArr.push( 'Non EPC' )
				this.gradeCountEPCColorArr.push('#9ccc65')
			}

			if ( data['domesticCount'] ) {
				this.domesticNonDomesticCountsArray.push( data['domesticCount'] );
				this.gradeCountDomesticLabelsArr.push( 'Domestic' );
				this.gradeCountDomesticColorArr.push('#ffa726')
			}
			if( data['nonDomesticCount'] ) {
				this.domesticNonDomesticCountsArray.push( data['nonDomesticCount'] );
				this.gradeCountDomesticLabelsArr.push( 'Non Domestic' );
				this.gradeCountDomesticColorArr.push('#ffca28')
			}
			this.tradingAddressCount = data['totalLength'];

			this.countKeys = data;

			if ( data['gradeCountA'] ) {
				this.countKeysArray.push( data['gradeCountA'] );
				this.gradeCountEpcArr.push('A');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorA)
			}
			if ( data['gradeCountB'] ) {
				this.countKeysArray.push( data['gradeCountB'] );
				this.gradeCountEpcArr.push('B');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorB)
			}
			if ( data['gradeCountC'] ) {
				this.countKeysArray.push( data['gradeCountC'] );
				this.gradeCountEpcArr.push('C');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorC)
			}
			if ( data['gradeCountD'] ) {
				this.countKeysArray.push( data['gradeCountD'] );
				this.gradeCountEpcArr.push('D');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorD)
			}
			if ( data['gradeCountE'] ) {
				this.countKeysArray.push( data['gradeCountE'] );
				this.gradeCountEpcArr.push('E');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorE)
			}
			if ( data['gradeCountF'] ) {
				this.countKeysArray.push( data['gradeCountF'] );
				this.gradeCountEpcArr.push('F');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorF)
			}
			if ( data['gradeCountG'] ) {
				this.countKeysArray.push( data['gradeCountG'] );
				this.gradeCountEpcArr.push('G');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorG)
			}
			if ( data['gradeCountAplus'] ) {
				this.countKeysArray.push( data['gradeCountAplus'] );
				this.gradeCountEpcArr.push('A+');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorA)
			}
			

			Object.keys(data).filter( val => {
								
				if ( !['status', 'message', 'results', 'totalLength', 'totalEpcCertificate', 'domesticCount','nonDomesticCount'].includes(val) && data[val] != 0 ) {
					this.tradingGradeCountArray.push(val);
				}

				if ( ['domesticCount', 'nonDomesticCount'].includes( val ) && data[val] != 0 ) {
					this.tradingDomesticNonDomesticArray.push( val )
				}

				if ( ['totalEpcCertificate', 'totalLength'].includes( val ) && data[val] != 0 ) {
					this.tradingEpcNonEpcArray.push( val )
				}
			} );
			
			this.overallDoughnutData = {
				labels: this.gradeCountEpcArr,
				datasets: [
					{
						data: this.countKeysArray,
						backgroundColor: this.gradeCountEpcColorArray
					}
				]
			}

			this.totalEPCCountsData = {
				labels: this.gradeCountEPCLabelsArr,
				datasets: [
					{
						data: this.epcCountsArray,
						backgroundColor: this.gradeCountEPCColorArr
					}
				]
			}

			this.totalDomesticNonDomesticCountsData = {
				labels: this.gradeCountDomesticLabelsArr,
				datasets: [
					{
						data: this.domesticNonDomesticCountsArray,
						backgroundColor: this.gradeCountDomesticColorArr
					}
				]
			}
			
			this.tradingAddressDetails = data['results'];
			
			this.tradingAddressDetailsColumn = [
				{ field: 'tradingAddress', header: 'Address', minWidth: '200px', maxWidth: 'none', textAlign: 'left', visible: true },
				{ field: 'postalCode', header: 'Post Code', minWidth: '140px', maxWidth: '140px', textAlign: 'left', visible: true },
				{ field: 'tradingTelephone', header: 'Telephone Number', minWidth: '130px', maxWidth: '130px', textAlign: 'right', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') )},
				{ field: 'tradingCTPSFlag', header: 'CTPS Registered', minWidth: '130px', maxWidth: '130px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) },
				{ field: 'epcButtonCurrent', header: 'EPC Current', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('epc') ) },
				{ field: 'epcButtonPotential', header: 'EPC Potential', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('epc') ) },
				{ field: 'district', header: 'Town or City', minWidth: '190px', maxWidth: '190px', textAlign: 'left', visible: true },
				{ field: 'county', header: 'County', minWidth: '190px', maxWidth: '190px', textAlign: 'left', visible: true },
				{ field: 'region', header: 'Region', minWidth: '190px', maxWidth: '190px', textAlign: 'left', visible: true },
				{ field: 'constituency', header: 'Constituency', minWidth: '290px', maxWidth: '290px', textAlign: 'left', visible: true }
			];

			for (let tradingAddress of this.tradingAddressDetails) {
				
				if (tradingAddress["tradingSTDCode"] !== null || tradingAddress["telephone"] !== null) {
					tradingAddress['tradingTelephone'] = tradingAddress["tradingSTDCode"] + ' ' + tradingAddress["telephone"];
				}
				
				tradingAddress["epcDetails"] = tradingAddress["epcDetails"] && tradingAddress["epcDetails"].length ? tradingAddress["epcDetails"][0] : undefined;

				if( tradingAddress["epcDetails"] && tradingAddress["epcDetails"]["asset_rating_band"] && tradingAddress["epcDetails"]["asset_rating_band"] != "" && tradingAddress["epcDetails"]["asset_rating_band"] != undefined ) {
					tradingAddress["asset_rating_band"] = tradingAddress["epcDetails"]["asset_rating_band"];
				}
				
				let str = [];

				if (tradingAddress["registeredOfficeFlag"]) {

					str.push(this.tradingAddressflagVal[0]["name"]);

				}
				if (tradingAddress["headOfficeFlag"]) {

					str.push(this.tradingAddressflagVal[1]["name"]);

				}
				if (tradingAddress["accountantsAddressFlag"]) {

					str.push(this.tradingAddressflagVal[2]["name"]);

				}
				if (tradingAddress["solicitorsAddressFlag"]) {

					str.push(this.tradingAddressflagVal[3]["name"]);

				}

				tradingAddress["tradingFlags"] = str;
			}

		});
		
	}

}
