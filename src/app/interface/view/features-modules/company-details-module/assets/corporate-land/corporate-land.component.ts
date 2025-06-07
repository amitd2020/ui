import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';

import ChartDataLabels from "chartjs-plugin-datalabels";
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-corporate-land',
	templateUrl: './corporate-land.component.html',
	styleUrls: ['./corporate-land.component.scss']
})
export class CorporateLandComponent implements OnInit {

	ChartDataLabelsPlugins = [ ChartDataLabels ];
	
	isLoggedIn: boolean = false;
	currentPlan: unknown;

	countKeysForSale : any;
	countKeys: any;
	companyData: any;
	companyNumber: any;
	corporateLandSaleCount: any;
	corporateLandPurchaseCount: any;
	doughnutChartOptions: any;
	totalEPCPurchased: any;
	totalEPCSold: any;

	totalEPCCertificatePurchased: Array<any> = [];
	totalEPCNonEPCCertificateSold: Array<any> = [];
	countKeysPurchasedArray: Array<any> = [];
	countKeysSoldArray: Array<any> = [];
	totalPieChartArray: Array<any> = [];
	totalPieChartLabels: Array<any> = [];
	totalPieChartColors: Array<any> = [];

	purchasedDomesticNonDomesticCount: Array<any> = [];
	soldDomesticNonDomesticCount: Array<any> = [];

	soldDomesticLabels: Array<any> = [];
	soldDomesticColors: Array<any> = [];
	soldEPCLabels: Array<any> = [];
	soldEPCColors: Array<any> = [];

	purchasedDomesticLabels: Array<any> = [];
	purchasedDomesticColors: Array<any> = [];
	purchasedEPCLabels: Array<any> = [];
	purchasedEPCColors: Array<any> = [];
	
	overallDoughnutData: {};
	overallDoughnutDatas:{};
	totalCountsDoughnut:{};
	totalEPCPurchaseCountsData:{};
	totalEPCSoldCountsData:{};
	purchasedDomesticNonDomesticCountsData:{};
	soldDomesticNonDomesticCountsData:{};
	epcThemeColors: { ratingColorA: string; ratingColorB: string; ratingColorC: string; ratingColorD: string; ratingColorE: string; ratingColorF: string; ratingColorG: string; };

	gradeCountEpcArr: Array<any> = [];
	gradeCountEpcColorArray: Array<any> = [];
	landCorporateSaleInfo: Array<any> = undefined;
	landCorporatePurchaseInfo: Array<any> = undefined;
	corporateLandSaleDataColumn: Array<any> = [];
	corporateLandDataPurchaseColumn: Array<any> = [];
	purchaseGradeCountArray: Array<any> = [];
	purchasedDomesticNonDomesticArray: Array<any> = [];
	purchasedEpcNonEpcArray: Array<any> = [];
	saleGradeCountArray: Array<any> = [];
	soldDomesticNonDomesticArray: Array<any> = [];
	soldEpcNonEpcArray: Array<any> = [];

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;


	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {
		
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		if ( this.userAuthService.hasAddOnPermission( 'propertyIntelligence' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData?.companyRegistrationNumber ) ) ) {

			this.getLandCorporateSaleData();
			this.getLandCorporatePurchaseData();

			// if ( this.userAuthService.hasAddOnPermission( 'epc' ) ) {

			const root = document.querySelector(':root');
			this.epcThemeColors = {
				ratingColorA: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingA').trim(),
				ratingColorB: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingB').trim(),
				ratingColorC: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingC').trim(),
				ratingColorD: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingD').trim(),
				ratingColorE: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingE').trim(),
				ratingColorF: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingF').trim(),
				ratingColorG: getComputedStyle( root ).getPropertyValue('--epcGrade-bg-colorRatingG').trim(),
			}
	
			this.doughnutChartOptions = {
				// cutout: 50,
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
								return tooltipItems.label;
							}
						}
					},
				},
				animation: {
					duration: 100,
					easing: 'easeInOutQuad'
				}
			};

			// }
					
	
			this.corporateLandSaleDataColumn = [
				{ field: 'Title_Number', header: 'Title Number', minWidth: '120px', maxWidth: '120px', textAlign: 'left', visible: true },
				{ field: 'Property_Address', header: 'Address', minWidth: '400px', maxWidth: 'none', textAlign: 'left', visible: true },
				{ field: 'Postcode', header: 'Post Code', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: true },
				{ field: 'epcButtonCurrent', header: 'EPC Current', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('epc') ) },
				{ field: 'epcButtonPotential', header: 'EPC Potential', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('epc') ) },
				{ field: 'Price_Paid', header: 'Price Paid', minWidth: '130px', maxWidth: '130px', textAlign: 'right', visible: true },
				{ field: 'purchaseCompanyName', header: 'Buyer Company Name', minWidth: '230px', maxWidth: '230px', textAlign: 'left', visible: true },
				{ field: 'purchaseCompanyNumber', header: 'Buyer Company No.', minWidth: '200px', maxWidth: '200px', textAlign: 'right', visible: true },
				{ field: 'Tenure', header: 'Tenure', minWidth: '130px', maxWidth: '130px', textAlign: 'left', visible: true },
				{ field: 'Date_Proprietor_Added', header: 'Proprietor Added Date', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true },
				{ field: 'Change_Indicator', header: 'Change Indicator', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true },
				{ field: 'Change_Date', header: 'Sold Date', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true }
			];
	
			this.corporateLandDataPurchaseColumn = [
				{ field: 'titleNumber', header: 'Title Number', minWidth: '120px', maxWidth: '120px', textAlign: 'left', visible: true },
				{ field: 'propertyAddress', header: 'Address', minWidth: '400px', maxWidth: 'none', textAlign: 'left', visible: true },
				{ field: 'postcode', header: 'Post Code', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: true },
				{ field: 'propertType', header: 'Property Type', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: true },
				{ field: 'epcButtonCurrent', header: 'EPC Current', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true },
				{ field: 'epcButtonPotential', header: 'EPC Potential', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true },
				{ field: 'pricePaid', header: 'Price Paid', minWidth: '130px', maxWidth: '130px', textAlign: 'right', visible: true },
				// { field: 'sellerCompanyName', header: 'Seller Company Name', minWidth: '230px', maxWidth: '230px', textAlign: 'left', visible: true },
				// { field: 'sellerCompanyNumber', header: 'Seller Company No.', minWidth: '200px', maxWidth: '200px', textAlign: 'right', visible: true },
				{ field: 'tenure', header: 'Tenure', minWidth: '130px', maxWidth: '130px', textAlign: 'left', visible: true },
				{ field: 'dateProprietorAdded', header: 'Proprietor Added Date', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true },
				{ field: 'changeIndicator', header: 'Change Indicator', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true },
				{ field: 'changeDate', header: 'Purchased Date', minWidth: '180px', maxWidth: '180px', textAlign: 'center', visible: true }
			];
			
		}
		this.companyNumber = this.companyData['companyRegistrationNumber'];

	}

	getLandCorporateSaleData() {
		this.sharedLoaderService.hideLoader();
		let companyNumber = [ this.companyData.companyRegistrationNumber ];

		// this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'getLandCorporateSaleData', companyNumber ).subscribe( res => {
		// 	let data = res.body;
			
		// 	this.corporateLandSaleCount = data['totalLength'];
		// 	this.totalEPCSold = data['totalEpcCertificate'];

		// 	// if( data['totalLength'] ) {
		// 	// 	this.totalPieChartArray.push( data['totalLength'] );
		// 	// 	this.totalPieChartLabels.push( 'Sold' );
		// 	// 	this.totalPieChartColors.push( '#03a9f4' )
		// 	// }

		// 	if ( data['totalEpcCertificate'] ) {
		// 		this.totalEPCNonEPCCertificateSold.push(data['totalEpcCertificate']);
		// 		this.soldEPCLabels.push( 'EPC' );
		// 		this.soldEPCColors.push('#66bb6a')
		// 	}

		// 	if ( data['domesticCount'] ) {
		// 		this.soldDomesticNonDomesticCount.push( data['domesticCount'] );
		// 		this.soldDomesticLabels.push('Domestic');
		// 		this.soldDomesticColors.push('#ffa726');
		// 	}

		// 	if ( data['nonDomesticCount'] ) {
		// 		this.soldDomesticNonDomesticCount.push( data['nonDomesticCount'] );
		// 		this.soldDomesticLabels.push( 'Non Domestic' );
		// 		this.soldDomesticColors.push( '#ffca28' );

		// 	}

		// 	if ( data['gradeCountA'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountA'] );
		// 		this.gradeCountEpcArr.push('A');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorA)
		// 	}
		// 	if ( data['gradeCountB'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountB'] );
		// 		this.gradeCountEpcArr.push('B');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorB)
		// 	}
		// 	if ( data['gradeCountC'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountC'] );
		// 		this.gradeCountEpcArr.push('C');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorC)
		// 	}
		// 	if ( data['gradeCountD'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountD'] );
		// 		this.gradeCountEpcArr.push('D');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorD)
		// 	}
		// 	if ( data['gradeCountE'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountE'] );
		// 		this.gradeCountEpcArr.push('E');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorE)
		// 	}
		// 	if ( data['gradeCountF'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountF'] );
		// 		this.gradeCountEpcArr.push('F');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorF)
		// 	}
		// 	if ( data['gradeCountG'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountG'] );
		// 		this.gradeCountEpcArr.push('G');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorG)
		// 	}
		// 	if ( data['gradeCountAplus'] ) {
		// 		this.countKeysSoldArray.push( data['gradeCountAplus'] );
		// 		this.gradeCountEpcArr.push('A');
		// 		this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorA)
		// 	}

		// 	// this.spinnerBoolean = false;
		// 	// this.sharedLoaderService.hideLoader();

		// 	Object.keys(data).filter( val => {
								
		// 		if ( !['status', 'results', 'totalLength', 'domesticCount', 'totalEpcCertificate', 'nonDomesticCount'].includes(val) && data[val] != 0 ) {
		// 			this.saleGradeCountArray.push(val);
		// 		}

		// 		if ( ['domesticCount', 'nonDomesticCount'].includes( val ) && data[val] != 0 ) {
		// 			this.soldDomesticNonDomesticArray.push( val )
		// 		}

		// 		if ( ['totalEpcCertificate', 'totalLength'].includes( val ) && data[val] != 0 ) {
		// 			this.soldEpcNonEpcArray.push( val )
		// 		}
		// 	} );

		// 	if (data["status"] == 200) {
		// 		this.landCorporateSaleInfo = data['results'].map((obj) => obj._source);
		// 		this.countKeysForSale = data;
		// 		this.overallDoughnutDatas = {
		// 			labels: this.gradeCountEpcArr,
		// 			datasets: [
		// 				{
		// 					data: this.countKeysSoldArray,
		// 					backgroundColor: this.gradeCountEpcColorArray
		// 				}
		// 			]
		// 		}

		// 		for( let salesData of this.landCorporateSaleInfo ) {

		// 			salesData["epcDetails"] = salesData["epcDetails"] && salesData["epcDetails"].length ? salesData["epcDetails"][0] : undefined;

		// 			if( salesData["epcDetails"] && salesData["epcDetails"]["asset_rating_band"] && salesData["epcDetails"]["asset_rating_band"] != "" && salesData["epcDetails"]["asset_rating_band"] != undefined ) {
		// 				salesData["asset_rating_band"] = salesData["epcDetails"]["asset_rating_band"];
		// 			}
		// 			if( salesData["Company_Registration_No_1"] && salesData["Company_Registration_No_1"] != "" && salesData["Company_Registration_No_1"] != undefined ) {
		// 				salesData["companyRegistrationNumber"] = salesData["Company_Registration_No_1"];
		// 			}
		// 		}
		// 	}

		// 	this.sharedLoaderService.hideLoader();
		// });
	}


	getLandCorporatePurchaseData() {
		this.sharedLoaderService.showLoader();
		let companyNumber = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'getLandCorporatePurchaseData', companyNumber ).subscribe( res => {
			let data = res.body;
			// this.spinnerBoolean = false;
			// this.sharedLoaderService.showLoader();
			this.countKeys = data;
			this.totalEPCPurchased = data['totalEpcCertificate'];
			this.corporateLandPurchaseCount = data['totalLength'];

			if( data['totalLength'] ) {
				this.totalPieChartArray.push( data['totalLength'] );
				this.totalPieChartLabels.push( 'Purchased' );
				this.totalPieChartColors.push( '#008054' )
			}

			if( data['totalEpcCertificate'] ) {
				this.totalEPCCertificatePurchased.push( data['totalEpcCertificate'] );
				this.purchasedEPCLabels.push( 'EPC' );
				this.purchasedEPCColors.push( '#66bb6a' )
			}

			if( data['domesticCount'] ) {
				this.purchasedDomesticNonDomesticCount.push(data['domesticCount']);
				this.purchasedDomesticLabels.push( 'Domestic' );
				this.purchasedDomesticColors.push( '#ffa726' )
			}
			if ( data['nonDomesticCount'] ) {
				this.purchasedDomesticNonDomesticCount.push(data['nonDomesticCount']);
				this.purchasedDomesticLabels.push( 'Non Domestic' );
				this.purchasedDomesticColors.push( '#ffca28' )
			}

			if ( data['gradeCountA'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountA'] );
				this.gradeCountEpcArr.push('A');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorA)
			}
			if ( data['gradeCountB'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountB'] );
				this.gradeCountEpcArr.push('B');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorB)
			}
			if ( data['gradeCountC'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountC'] );
				this.gradeCountEpcArr.push('C');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorC)
			}
			if ( data['gradeCountD'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountD'] );
				this.gradeCountEpcArr.push('D');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorD)
			}
			if ( data['gradeCountE'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountE'] );
				this.gradeCountEpcArr.push('E');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorE)
			}
			if ( data['gradeCountF'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountF'] );
				this.gradeCountEpcArr.push('F');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorF)
			}
			if ( data['gradeCountG'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountG'] );
				this.gradeCountEpcArr.push('G');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorG)
			}
			if ( data['gradeCountAplus'] ) {
				this.countKeysPurchasedArray.push( data['gradeCountAplus'] );
				this.gradeCountEpcArr.push('A+');
				this.gradeCountEpcColorArray.push(this.epcThemeColors.ratingColorA)
			}

			Object.keys(data).filter( val => {
				
				if ( !['status', 'results', 'totalLength', 'domesticCount', 'totalEpcCertificate', 'nonDomesticCount'].includes(val) && data[val] != 0 ) {
					this.purchaseGradeCountArray.push(val);
				}

				if ( ['domesticCount', 'nonDomesticCount'].includes( val ) && data[val] != 0 ) {
					this.purchasedDomesticNonDomesticArray.push( val )
				}

				if ( ['totalEpcCertificate', 'totalLength'].includes( val ) && data[val] != 0 ) {
					this.purchasedEpcNonEpcArray.push( val )
				}
			} );

			if (data["status"] == 200) {

				// this.landCorporatePurchaseInfo = data['results'].map((obj) => obj._source);
				
				this.landCorporatePurchaseInfo = data['results'];

				this.overallDoughnutData = {
					labels: this.gradeCountEpcArr,
					datasets: [
						{
							data: this.countKeysPurchasedArray,
							backgroundColor: this.gradeCountEpcColorArray
						}
					]
				}
				
				for( let purchaseData of this.landCorporatePurchaseInfo ) {

					purchaseData["epcDetails"] = purchaseData["epcDetails"] ? purchaseData["epcDetails"] : undefined;
					
					if( purchaseData["epcDetails"] && purchaseData["epcDetails"]["asset_rating_band"] && purchaseData["epcDetails"]["asset_rating_band"] != "" && purchaseData["epcDetails"]["asset_rating_band"] != undefined ) {
						purchaseData["asset_rating_band"] = purchaseData["epcDetails"]["asset_rating_band"];
					}
					if( purchaseData["Company_Registration_No_1"] && purchaseData["Company_Registration_No_1"] != "" && purchaseData["Company_Registration_No_1"] != undefined ) {
						purchaseData["companyRegistrationNumber"] = purchaseData["Company_Registration_No_1"];
					}

					if ( purchaseData['Date_Proprietor_Added'] ) {
						const [ date, month, year ] = purchaseData.Date_Proprietor_Added.split('-');
						purchaseData['Date_Proprietor_Added'] = `${year}-${month}-${date}`;
					}
					
				}				
			}
			this.getLandCorporatePurchaseSalesData();
			this.sharedLoaderService.hideLoader();
		});
	}
		
	getLandCorporatePurchaseSalesData() {

		let nonEpcPurchased = this.corporateLandPurchaseCount - this.totalEPCPurchased;
		let nonEpcSold = this.corporateLandSaleCount - this.totalEPCSold;

		if ( nonEpcPurchased ) {

			this.totalEPCCertificatePurchased.push( nonEpcPurchased );
			this.purchasedEPCLabels.push( 'Non EPC' );
			this.purchasedEPCColors.push( '#9ccc65' )
		}

		if ( nonEpcSold ) {

			this.totalEPCNonEPCCertificateSold.push( nonEpcSold );
			
			this.soldEPCLabels.push( 'Non EPC' );
			this.soldEPCColors.push( '#9ccc65' );

		}
		
		this.totalCountsDoughnut = {
			labels: this.totalPieChartLabels,
			datasets: [
				{
					data: this.totalPieChartArray,
					backgroundColor: this.totalPieChartColors
				}
			]
		}
	
		this.totalEPCPurchaseCountsData = {
			labels: this.purchasedEPCLabels,
			datasets: [
				{
					data: this.totalEPCCertificatePurchased,
					backgroundColor: this.purchasedEPCColors
				}
			]
		}

		this.totalEPCSoldCountsData = {
			labels: this.soldEPCLabels,
			datasets: [
				{
					data: this.totalEPCNonEPCCertificateSold,
					backgroundColor: this.soldEPCColors
				}
			]
		}

		this.purchasedDomesticNonDomesticCountsData = {
			
			labels: this.purchasedDomesticLabels,
			datasets: [
				{
					data: this.purchasedDomesticNonDomesticCount,
					backgroundColor:this.purchasedDomesticColors
				}
			]
		}

		this.soldDomesticNonDomesticCountsData = {
			labels: this.soldDomesticLabels,
			datasets: [
				{
					data: this.soldDomesticNonDomesticCount,
					backgroundColor: this.soldDomesticColors
				}
			]
		}
		
	}

}
