import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import ChartDataLabels from 'chartjs-plugin-datalabels';

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

import { subscribedPlan } from 'src/environments/environment';
import { financialKeys } from '../compare-company-financial.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-compare-companies',
	templateUrl: './compare-companies.component.html',
	styleUrls: ['./compare-companies.component.scss']
})
export class CompareCompaniesComponent implements OnInit, AfterViewInit {

	@ViewChild('getCompareCompanyData', { static: false }) getCompareCompanyData: NgForm;

	ChartDataLabelsPlugin = [ChartDataLabels];

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	companyNameNumberSearch: string;
	companyNumber: string;
	companyName: string;
	currentPlan: string;
	finalString: string;
	finalString3: string = ''

	JSON: JSON;

	fieldValidate: Boolean = false;
	compareButtonDisable: Boolean = false;

	companyNameNumberSearchKey1: any;
	companyNameNumberSearchKey2: any;
	companyNameNumberSearchKey3: any;
	gaugeChartOptionsProps: any;
	compareCompaniesData: any;
	selectedCompany1: any = undefined;
	selectedCompany2: any = undefined;
	selectedCompany3: any = undefined;
	miniBarChartOptions: any;
	gaugeNeedleCreationContext: any;
	gaugeChartPluginProps: any;
	riskGaugeChartDataValues: any;
	userDetails: any = {};
	financialCardDatasets = {};

	comparingCompanies: Object = {};
	showHideInputFieldBool: Object = {
		company2: false,
		company3: false,
	};
	riskValueMeasurements = {
		not_scored: 8,
		very_high_risk: 10,
		high_risk: 30,
		moderate_risk: 50,
		low_risk: 70,
		very_low_risk: 90
	}

	filteredCompanyNameArray: any[];
	filteredCompanyArray: any[];
	companyNumberArr: Array<any> = [];

	subscribedPlanModal: any = subscribedPlan;

	gaugeAnimationProgressValue: number = 0;

	numberTypeFinancialData: Array<any> = ['zScore', 'cagr', 'creditorDays', 'debtorDays', 'currentRatio', 'quickRatio', 'cashRatio', 'equityInPercentage', 'employeeYearWiseArray', 'equityInPercentage', 'gearingPercentage', 'returnOnCapital', 'returnOnTotalAssets', 'totalDebtRatio', 'grossMarginByTurnoverPercent', 'turnoverByNumberOfEmployees', 'profitBeforeTaxByTurnoverPercent', 'wagesAndSalariesByTurnoverPercent', 'grossMarginByNumberOfEmployees'];
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		public userAuthService: UserAuthService,
		private router: Router,
        private activeRoute: ActivatedRoute,
		private seoService: SeoService,
		public commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private sharedLoaderService: SharedLoaderService,
		public toNumberSuffix: NumberSuffixPipe,
		private globalServiceCommnunicate: ServerCommunicationService,
		private cd: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();

		this.initGaugeOptionNPlugin();

		if ( Object.keys( this.activeRoute?.snapshot?.queryParams ).length ) {

			let obj = this.activeRoute.snapshot.queryParams;
			this.selectedCompany1 = obj;
			this.companyNameNumberSearchKey1 = { key: this.titlecasePipe.transform(obj.businessName) + " (" + obj.companyRegistrationNumber + ")" };
			this.showHideInputFieldBool['company2'] = true;

		}

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadCrumbService.setItems([
		// 	{ label: 'Compare Company' }
		// ]);
		this.title = "Company Compare - DataGardener";
		this.description = "Comparison between companies - DataGardener";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

	}

	filteredCompanyName(event, initialLoad, source) {
 
		if (event.length > 2) {
			
			let obj = {
				companyName: event.toString().toLowerCase(),
				companyStatus: 'live'
			}
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_API', 'companyNameSuggestionsNew', obj ).subscribe( res => {
				let data = res.body;
				if (data !== undefined) {
					if (data.status == 200) {
						if (data['results'] !== undefined) {
							if (data['results']['hits']['total']['value'] == 0) {
								this.filteredCompanyNameArray = [];
								this.filteredCompanyArray = [];
							} else if (data['results']['hits']['total']['value'] > 0) {
								this.filteredCompanyNameArray = [];
								this.filteredCompanyArray = [];
								for (let val of data['results']['hits']['hits']) {
									this.filteredCompanyNameArray.push({ key: this.titlecasePipe.transform(val['_source']['businessName'] + " (" + val['_source']['companyRegistrationNumber'].toUpperCase() + ")") });
									this.filteredCompanyArray.push(val['_source']);
								}
							}
							if (initialLoad === 'edit') {
								let obj = {
									key: event
								}
								this.searchOnEnterCompany(obj, initialLoad, source);
							}
							if (source == 'fillDetails') {
								let eventObj = {
									"key": this.titlecasePipe.transform(this.userDetails['companyName'].toLowerCase()) + " (" + this.userDetails['company_number'].toUpperCase() + ")"
								}
								this.searchCompany(eventObj, 'fillDetails')
							}

						} else {
							this.filteredCompanyNameArray = [];
							this.filteredCompanyArray = [];
						}
					}
				}
			});
		} else {
			this.filteredCompanyNameArray = [];
			this.filteredCompanyArray = [];
		}

	}

	searchOnEnterCompany(event, initialLoad, source) {
		
		this.compareButtonDisable = false;

		if (initialLoad == undefined) {
			let stringg;
			let stringcompany: Array<String> = [];
			stringg = event.target.value.trim();
			for (let i = 0; i < stringg.length; i++) {
				stringcompany[i] = stringg.charAt(i);
			}
			for (let z = 0; z < stringcompany.length; z++) {
				if (stringcompany[z] === " " && stringcompany[z + 1] === " ") {
					stringcompany.splice(z, z);
				}
			}
			 this.finalString = stringcompany.join("");
			if ( source == 'companyName3' ){
				if ( this.selectedCompany1 != undefined &&  this.selectedCompany2 != undefined ) {
					this.compareButtonDisable = false;
					this.selectedCompany3 = undefined;
					this.compareButtonDisable = this.finalString.length ? false : true;
					this.finalString3 = this.finalString;
					
				} 
			}
			if ( source == 'companyName1' ){
				this.selectedCompany1 = undefined
			}
			if ( source == 'companyName2' ){
				this.selectedCompany2 = undefined
			}

			if (event.target.value !== "") {
				this.companyNameNumberSearch = this.finalString;
			}
			if (event.keyCode == 13) {
				this.companyNameNumberSearch = this.finalString;
			}
			if (this.selectedCompany1 != undefined &&  this.selectedCompany2 != undefined  ) {
				this.showHideInputFieldBool['company3'] = true
			} else {
				this.showHideInputFieldBool['company3'] = false
			}

		} else {
			this.companyNameNumberSearchKey1 = event;
			this.searchCompany(event, source);
		}
	}

	searchCompany(event, source) {
		
		let selectedCompany;

		for (let i = 0; i < this.filteredCompanyArray.length; i++) {
			if ( event?.value?.key && (event.value.key.toString().toLowerCase() === this.filteredCompanyArray[i].businessName.toString().toLowerCase() + " (" + this.filteredCompanyArray[i]['companyRegistrationNumber'].toLowerCase() + ")") ) {
				this.companyName = this.filteredCompanyArray[i].businessName;
				this.companyNumber = this.filteredCompanyArray[i].companyRegistrationNumber;
				selectedCompany = this.filteredCompanyArray[i];
				if (source == "fillDetails") {
					this.companyNameNumberSearchKey1 = { "key": this.titlecasePipe.transform(this.filteredCompanyArray[i].businessName) };
				}
				break;
			}
		}
		if (source === "companyName1") {
			this.finalString = ''
			this.showHideInputFieldBool['company2'] = true
			this.selectedCompany1 = selectedCompany;
		} else if ( source === "companyName2" ) {
			this.finalString = ''
			this.selectedCompany2 = selectedCompany;
		}  else if ( source === "companyName3" ) {
			this.finalString3 = ''
			this.selectedCompany3 = selectedCompany;
			// this.compareButtonDisable = true;
		}
		if ( this.selectedCompany1 != undefined &&  this.selectedCompany2 != undefined  ) {
			if (  this.selectedCompany3 == undefined ) {
				if ( this.finalString3.length ) {
					this.compareButtonDisable = false;
				} else {
					this.compareButtonDisable = true;
				}
			} else {
				this.compareButtonDisable = true;
			}
			// this.compareButtonDisable = true;
			this.showHideInputFieldBool['company3'] = true
		} else {
			this.showHideInputFieldBool['company3'] = false
		}

		// if ( this.selectedCompany1 &&  this.selectedCompany2 ) this.compareButtonDisable = true;
		
	}

	getCompaniesData( formData: NgForm ) {

		this.sharedLoaderService.showLoader();

		this.comparingCompanies = {};
		this.compareCompaniesData = undefined;
		this.companyNumberArr = [];

		const lastSearchesCompany = {
			tempCompanyNameNumberSearchKey1 : this.companyNameNumberSearchKey1,
			tempCompanyNameNumberSearchKey2 : this.companyNameNumberSearchKey2,
			tempCompanyNameNumberSearchKey3 : this.companyNameNumberSearchKey3,
			selectedCompany1 : { companyRegistrationNumber : this.selectedCompany1.companyRegistrationNumber},
			selectedCompany2 : { companyRegistrationNumber : this.selectedCompany2.companyRegistrationNumber},
			selectedCompany3 : { companyRegistrationNumber : this.selectedCompany3?.companyRegistrationNumber}

		}
		window.localStorage.setItem( 'lastSearchesCompany', JSON.stringify(lastSearchesCompany) );

		this.fieldValidate = true;

		if ( this.selectedCompany1 ) {
			this.companyNumberArr.push( this.selectedCompany1.companyRegistrationNumber );
		}

		if ( this.selectedCompany2 ) {
			this.companyNumberArr.push( this.selectedCompany2.companyRegistrationNumber );
		}

		if ( this.selectedCompany3 ) {
			this.companyNumberArr.push( this.selectedCompany3.companyRegistrationNumber );
		}

		if ( !this.companyNameNumberSearchKey3 && this.companyNumberArr.length > 2 ) {
			this.companyNumberArr.pop();
		}

		if ( this.validateForm() && formData.valid ) {

			let obj = {
				companyNumbers: this.companyNumberArr
			}
	
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_RISK_ASSESMENT', 'riskAssesmentData', obj ).subscribe( res => {
	
				if ( res.body['status'] == 200 ) {
	
					this.compareCompaniesData = res.body['result'];

					this.comparingCompanies['company1'] = this.compareCompaniesData.filter( val => this.companyNumberArr[0] == val.companyNumber )[0];
					this.comparingCompanies['company2'] = this.compareCompaniesData.filter( val => this.companyNumberArr[1] == val.companyNumber )[0];

					this.financialCardDatasets['company1'] = JSON.parse( JSON.stringify( financialKeys ) );
					this.financialCardDatasets['company2'] = JSON.parse( JSON.stringify( financialKeys ) );
					
					if ( this.companyNumberArr.length == 3 ) {
						
						this.comparingCompanies['company3'] = this.compareCompaniesData.filter( val => this.companyNumberArr[2] == val.companyNumber )[0];
						this.financialCardDatasets['company3'] = JSON.parse( JSON.stringify( financialKeys ) );

					}
					
					let comp1DirFailureArr = [],
						comp2DirFailureArr = [],
						comp3DirFailureArr = [],
						comp1AdrsChangeArr = [],
						comp2AdrsChangeArr = [],
						comp3AdrsChangeArr = []
						
					this.miniBarChartOptions = {
						layout: {
							padding: { top: 8, right: 0, left: 0, bottom: 0 }
						},
						responsive: true,
						scales: {
							y:{
								display: false
							},
							x: {
								ticks: {
									fontFamily: 'Roboto',
									style: 'normal',
									color: '#bbb',
									padding: 0,
								},
								grid: {
									display: false,
									color: 'rgb( 0 0 0 / 0% )'
								},
								
								font: function (context): any {
									if (context.tick && context.tick.major) {
										return {
											weight: 'bold',
											color: '#FF0000',
											size: 4.5,
										};
									}
								}
							}
							
						},
						plugins: {
							datalabels: {
								display: ( ctx ) => {
									return ctx.active ? true : false;
								},
								clamp: true,
								offset: 5,
								color: '#666',
								font: {
									family: 'Roboto',
									size: 13
								},
								backgroundColor: '#ffcc00',
								borderRadius: 4,
								padding: { top: 3, right: 5, left: 5, bottom: 0 },
								formatter: ( value, ctx ) => {
									return this.toNumberSuffix.transform( value, '2', this.numberTypeFinancialData.includes( ctx.dataset.title ) ? '' : this.selectedGlobalCurrency );
								},
								align: ( ctx ) => {
									let labelPos = 'end';
			
									if ( ctx.dataIndex == 0 ) labelPos = 'right';
									if ( ctx.dataIndex == ( ctx.dataset.data.length - 1 ) ) labelPos = 'left';
			
									return labelPos;
								}
							},
							legend: {
								display: false
							},	
							tooltip: {
								enabled: false,
								callbacks: {
									label: function ( tooltipItem ) {
										return tooltipItem.formattedValue;
									}
								}
							}
						},
						hover: {
							intersect: false
						},
						animation: {
							duration: 4000,
							easing: 'easeInOutQuad'
						}
					};

					for ( let key in this.comparingCompanies ) {

						this.comparingCompanies[ key ]['riskGaugeChartDataValues'] = this.initGaugeChart( this.riskValueMeasurements[ this.comparingCompanies[ key ]['internationalScoreDescription'].trim().toLowerCase().split(' ').join('_') ] );
						
						let finDataSort = async ( inputArray ) => await inputArray.sort( ( a, b ) => {
					
							a['year'] = ( a['year'] || a['YEAR'] ).toString();
							b['year'] = ( b['year'] || b['YEAR'] ).toString();
							
							return a['year'].localeCompare( b['year'] );
	
						});
	
						Object.keys( this.comparingCompanies[key]['financialDetails'] ).map( async finKey => {	
							let finDataArray: any = this.comparingCompanies[key]['financialDetails'][ finKey ];
							finDataArray = finDataArray && finDataArray.length ? await finDataSort( finDataArray ) : [];
						});

						if ( this.comparingCompanies[ key ].safeAlertsDetails.length ) {

							for ( let safeAlertsTitle of this.comparingCompanies[ key ].safeAlertsDetails ) {
	
								if ( key == 'company1' ) {
	
									if ( safeAlertsTitle.alertCodeTitle == 'director failures' ) {
										comp1DirFailureArr.push( safeAlertsTitle.alertCodeTitle )
										this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp1DirFailureArr;
									} else {
										this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp1DirFailureArr;
									}
	
									if ( safeAlertsTitle.alertCodeTitle == 'multiple address changes' ) {
										comp1AdrsChangeArr.push( safeAlertsTitle.alertCodeTitle )
										this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp1AdrsChangeArr;
									} else {
										this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp1AdrsChangeArr;
									}
	
								}
	
								if ( key == 'company2' ) {
	
									if ( safeAlertsTitle.alertCodeTitle == 'director failures' ) {
										comp2DirFailureArr.push( safeAlertsTitle.alertCodeTitle )
										this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp2DirFailureArr;
									} else {
										this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp2DirFailureArr;
									}
	
									if ( safeAlertsTitle.alertCodeTitle == 'multiple address changes' ) {
										comp2AdrsChangeArr.push( safeAlertsTitle.alertCodeTitle )
										this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp2AdrsChangeArr;
									} else {
										this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp2AdrsChangeArr;
									}
	
								}
	
								if ( key == 'company3' ) {
									
									if ( safeAlertsTitle.alertCodeTitle == 'director failures' ) {
										comp3DirFailureArr.push( safeAlertsTitle.alertCodeTitle )
										this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp3DirFailureArr;
									} else {
										this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp3DirFailureArr;
	
									}
	
									if ( safeAlertsTitle.alertCodeTitle == 'multiple address changes' ) {
										comp3AdrsChangeArr.push( safeAlertsTitle.alertCodeTitle )
										this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp3AdrsChangeArr;
									} else {
										this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp3AdrsChangeArr;
									}
	
								}
	
							}

						} else {

							if ( key == 'company1' ) {
								this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp1DirFailureArr;
								this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp1AdrsChangeArr;
							}

							if ( key == 'company2' ) {
								this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp2DirFailureArr;
								this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp2AdrsChangeArr;
							}

							if ( key == 'company3' ) {
								this.comparingCompanies[ key ]['dirFailuresCodeTitle'] = comp3DirFailureArr;
								this.comparingCompanies[ key ]['addrChangesCodeTitle'] = comp3AdrsChangeArr;
							}

						}

						Object.keys( this.financialCardDatasets[key] ).map( childKey => {
							Object.keys( this.financialCardDatasets[ key ][ childKey ] ).map( async subChildKey => {

								let dataValueKey = [ 'cagr', 'zScore' ].includes( subChildKey ) ? subChildKey : 'value';

								const obj = await this.comparingCompanies[ key ].financialDetails[ subChildKey ] && this.comparingCompanies[ key ].financialDetails[ subChildKey ].length && this.comparingCompanies[ key ].financialDetails[ subChildKey ] !== 0 ? this.comparingCompanies[ key ].financialDetails[ subChildKey ] : [],

									latestYearValue = obj && obj.length && obj !== 0 ? obj[ obj.length - 1] && obj[ obj.length - 1][ dataValueKey ] && obj[ obj.length - 1][ dataValueKey ] !== null ? parseFloat( obj[ obj.length - 1][ dataValueKey ] ) : 0 : 0,

									previousYearValue = obj && obj.length && obj !== 0 ? obj[ obj.length - 2] && obj[ obj.length - 2][ dataValueKey ] && obj[ obj.length - 2][ dataValueKey ] !== null ? parseFloat( obj[ obj.length - 2][ dataValueKey ] ) : 0 : 0;

								this.financialCardDatasets[ key ][ childKey ][ subChildKey ] = {
									latestYearValue: latestYearValue,
									previousYearValue: previousYearValue,
									diffPercentageValue: this.checkPercentageDiff( latestYearValue, previousYearValue ),
									chartDatasets: obj && obj.length ? this.createMiniLineChartDataset( obj, subChildKey ) : 0,
									valueType: this.numberTypeFinancialData.includes( subChildKey ) ? '' : this.selectedGlobalCurrency,
									companyName: this.comparingCompanies[ key ].companyName,
									companyNumber: this.comparingCompanies[ key ].companyNumber,
									hasZScore: this.comparingCompanies[ key ].hasZScore,
									hasCAGR: this.comparingCompanies[ key ].hasCAGR,
									hasSafeAlerts: this.comparingCompanies[ key ].hasSafeAlerts,
									hasFinances: this.comparingCompanies[ key ].hasFinances
								}
								
							});
							
						});
						
					}
					
				}

				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 2000);
					
			});
				
		} else {

			this.fieldValidate =  true;
			
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 2000);
		}

	}
	
	validateForm() {

		if ( this.companyNameNumberSearchKey1 !== undefined && this.companyNameNumberSearchKey1 !== null && this.companyNameNumberSearchKey2 !== undefined && this.companyNameNumberSearchKey2 !== null ) {
			return true;
		}

		return false;

	}

	initGaugeOptionNPlugin() {

		// Registering Gauge Chart Options
		this.gaugeChartOptionsProps = {
			layout: {
				padding: { bottom: 20 }
			},
			cutout: '80%',
			circumference: 180,
			rotation: -90,
			plugins: {
				datalabels: {
					display: false
				},
				tooltip: {
					enabled: false
				},
				legend: {
					position: 'right',
					align: 'center',
					labels: {
						fontFamily: 'Roboto',
						fontSize: 13,
						usePointStyle: true,
						pointStyle: 'circle',
						padding: 25
					}
				},
			},
			events: [],
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad',
				onProgress: ( animation ) => {
					this.gaugeAnimationProgressValue = animation.currentStep / animation.numSteps;
					this.gaugeNeedleCreationContext = window.requestAnimationFrame( this.createGaugeNeedle );
				},
				onComplete: () => {
					window.cancelAnimationFrame( this.gaugeNeedleCreationContext );
				}
			}
		};

		// Registering Gauge Value Indicator Plugin
		this.gaugeChartPluginProps = [
			{
				afterDatasetDraw: ( chart, args, options ) => {

					const { ctx, config, data, width, height } = chart;
					let coloredArcs = chart.getDatasetMeta(0).data;

					ctx.save();
					
					const totalDataValues = data.datasets[0].data.reduce( ( a, b ) => a + b, 0 );
					const pointerValue = data.datasets[0].pointerValue;
					const gaugeAngle = Math.PI / 2 + ( 1 / totalDataValues * pointerValue * Math.PI );

					let needleCircleRadius = ( coloredArcs[0].innerRadius * 10 ) / 100;
					
					// Gauge Needle
					this.createGaugeNeedle( { ctx, coloredArcs, needleCircleRadius, gaugeAngle } )

				}
		
			}
		];
		
	}

	createGaugeNeedle( requiredValuesForNeedle ) {

		const { ctx, coloredArcs, needleCircleRadius, gaugeAngle } = requiredValuesForNeedle, baseGaugeAngle = 1.57;

		if ( ctx ) {

			let modifiedGaugeAngle = this.gaugeAnimationProgressValue * gaugeAngle,
				finalGaugeAngle = 0;

			finalGaugeAngle = modifiedGaugeAngle < baseGaugeAngle ? baseGaugeAngle : modifiedGaugeAngle;

			// Dashed inner gray line
			ctx.save();
			ctx.beginPath();
			ctx.setLineDash([ 6, 10 ]);
			ctx.arc( coloredArcs[0].x, coloredArcs[0].y, coloredArcs[0].innerRadius - 25, 0, Math.PI, true );
			ctx.strokeStyle = finalGaugeAngle > baseGaugeAngle ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)';
			ctx.stroke();
			ctx.restore();
					
			// Needle bottom big dark circle
			ctx.save();
			ctx.beginPath();
			ctx.arc( coloredArcs[0].x, coloredArcs[0].y, needleCircleRadius, 0, Math.PI * 2, true );
			ctx.fillStyle = finalGaugeAngle > baseGaugeAngle ? '#777' : 'rgba(0, 0, 0, 0)';
			ctx.fill();
			ctx.restore();
					
			// Needle Triangle
			ctx.save();
			ctx.translate( coloredArcs[0].x, coloredArcs[0].y );
			ctx.rotate( finalGaugeAngle );
			ctx.beginPath();
			ctx.lineCap = 'round';
			ctx.moveTo( -needleCircleRadius, 2 );
			ctx.lineTo( 0, coloredArcs[0].innerRadius + 20 );
			ctx.lineTo( 2, coloredArcs[0].innerRadius + 20 );
			ctx.lineTo( needleCircleRadius, 2 );
			ctx.fillStyle = finalGaugeAngle > baseGaugeAngle ? '#777' : 'rgba(0, 0, 0, 0)';
			ctx.closePath();
			ctx.fill();
			ctx.restore();
					
			// Needle bottom small white circle
			ctx.save();
			ctx.beginPath();
			ctx.arc( coloredArcs[0].x, coloredArcs[0].y, needleCircleRadius/2.5, 0, Math.PI * 2, true );
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.strokeStyle = finalGaugeAngle > baseGaugeAngle ? '#6e6e6e' : 'rgba(0, 0, 0, 0)';
			ctx.stroke();
			ctx.restore();
	
			this.gaugeNeedleCreationContext = window.requestAnimationFrame( this.createGaugeNeedle );

		}

	}

	initGaugeChart( inputValue ) {
		
		// Registering Gauge Chart Dataset Values
		let chartDatasetValues = {
			labels: [ 'Not Scored /Very High Risk',  'High Risk', 'Moderate', 'Low Risk', 'Very Low Risk' ],
			datasets: [
				{
					data: [ 20, 20, 20, 20, 20 ],
					pointerValue: Math.round( inputValue ),
					backgroundColor: [ '#D92727', '#ee9512', '#ffcc00', '#59ba9b', '#6dc470' ],
					hoverBackgroundColor: [ '#D92727', '#ee9512', '#ffcc00', '#59ba9b', '#6dc470' ],
					borderWidth: 2,
					borderColor: '#fff',
					hoverBorderColor: [ '#D92727', '#ee9512', '#ffcc00', '#59ba9b', '#6dc470' ]
				}
			]
		};

		return chartDatasetValues;

	}

	cancel() {

		this.sharedLoaderService.showLoader();
		this.showHideInputFieldBool['company2'] = false;
		this.showHideInputFieldBool['company3'] = false;
		this.compareButtonDisable = false;

		this.getCompareCompanyData.reset();
		this.fieldValidate = false;
		this.companyNameNumberSearchKey1 = undefined;
		this.companyNameNumberSearchKey2 = undefined;
		this.companyNameNumberSearchKey3 = undefined;
		this.companyNumberArr = [];
		this.compareCompaniesData = undefined;

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 1000);
		
	}

	lastSearches(){

		let recentSearches = JSON.parse(window.localStorage.getItem('lastSearchesCompany'));

		if ( recentSearches != null ){

			this.companyNameNumberSearchKey1 = recentSearches['tempCompanyNameNumberSearchKey1'];
			this.companyNameNumberSearchKey2 = recentSearches['tempCompanyNameNumberSearchKey2'];
			this.companyNameNumberSearchKey3 = recentSearches['tempCompanyNameNumberSearchKey3'];
			this.selectedCompany1 = recentSearches['selectedCompany1'];
			this.selectedCompany2 = recentSearches['selectedCompany2'];
			this.selectedCompany3 = recentSearches['selectedCompany3'];
			this.showHideInputFieldBool['company2'] = true;
			this.showHideInputFieldBool['company3'] = true;

			this.compareButtonDisable = true;

		}


		
	}

	calculateAccountOverduePeriod(overdueDate) {
		let todayDate = new Date(),
			dueDate = this.commonService.changeToDate(overdueDate);

		return todayDate > dueDate;
	}

	calculateDays(inputDate) {
		let todayDate = new Date(),
			dueDate = this.commonService.changeToDate(inputDate),
			diffInTime, diffInDays;

		if( dueDate ) {
			if (todayDate > dueDate) {
			diffInTime = todayDate.getTime() - dueDate.getTime(),
				diffInDays = diffInTime / (1000 * 3600 * 24);
		}
		}

		return Math.round(diffInDays);
	}

	goToTab( compNumber, cmpName, tab ) {

		let urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company/' + compNumber + '/' + this.formatCompanyNameForUrl( cmpName ) ], { queryParams: [ 'viewGovernmentEnablerSupplier', 'viewGovernmentEnablerBuyer' ].includes( tab ) ? { businessType: tab } : { type: tab } } ) );

		window.open( urlStr, '_blank' );
    }

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	scrollToElement( id ) {

		setTimeout(() => {
			
			( document.getElementById( id ) as HTMLElement ).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });			

		}, 500);

	}

	checkPercentageDiff( latestYearValue, previousYearValue ): any {

		let increased = { increased: 0 },
			decreased = { decreased: 0 },
			equal = { equal: 0 };

		if ( previousYearValue ) {

			if ( latestYearValue > previousYearValue ) {
				increased.increased = ( ( latestYearValue - previousYearValue ) / previousYearValue ) * 100;
				increased.increased = increased.increased < 0 ? increased.increased * -1 : increased.increased;
				return increased;
			} else if ( latestYearValue < previousYearValue ) {
				decreased.decreased = ( ( previousYearValue - latestYearValue ) / previousYearValue ) * 100;
				decreased.decreased = decreased.decreased < 0 ? decreased.decreased * -1 : decreased.decreased;
				return decreased;
			}
	
			return equal;

		}

		return;

	}
	
	createMiniLineChartDataset( inputValues, dataKey ) {

        let outputDataset,
			colorRGBForChartPositive = '21 195 129',
			colorRGBForChartNegative = '176 0 32',
			barBgColors = [],
			dataValueKey = [ 'cagr', 'zScore' ].includes( dataKey ) ? dataKey : 'value',
			chartLabels = inputValues.map( val => val['year'] ),
			chartData = inputValues.map( val => val[ dataValueKey ] ? parseFloat( val[ dataValueKey ] ) : 0 );

        outputDataset = {
			labels: chartLabels,
            datasets: [
				{
					title: dataKey,
                    data: chartData,
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderWidth: 1,
                    borderColor: [],
                    hoverBorderColor: [],
					barPercentage: 0.6,
                }
            ]
        };

		if ( dataKey == 'zScore' ) {

			barBgColors = [];
		
			for ( let { zScore } of inputValues ) {
				if ( zScore <= 1.8 ) {
					barBgColors.push('#ff4500');
				} else if ( ( zScore >= 1.8 ) && ( zScore < 3 ) ) {
					barBgColors.push('#808080');
				} else if ( zScore > 3 ) {
					barBgColors.push('#008000');
				}
			}

			outputDataset.datasets[0]['backgroundColor'] = barBgColors;
			outputDataset.datasets[0]['hoverBackgroundColor'] = barBgColors;
			outputDataset.datasets[0]['borderWidth'] = 0;
			outputDataset.datasets[0]['borderColor'] = 'rgba(0, 0, 0, 0)';
			outputDataset.datasets[0]['hoverBorderColor'] = 'rgba(0, 0, 0, 0)';
			
		} else {

			barBgColors = [];
		
			for ( let { value, cagr } of inputValues ) {
				if ( ( value || cagr ) < 0 ) {
					barBgColors.push( `rgb( ${ colorRGBForChartNegative } / 50% )` );
				} else {
					barBgColors.push( `rgb( ${ colorRGBForChartPositive } / 50% )` );
				}
			}

			outputDataset.datasets[0]['backgroundColor'] = barBgColors;
			outputDataset.datasets[0]['hoverBackgroundColor'] = barBgColors.map( val => val.replace( '/ 50%', '' ) );
			outputDataset.datasets[0]['borderColor'] = barBgColors.map( val => val.replace( '/ 50%', '' ) );
			outputDataset.datasets[0]['hoverBorderColor'] = barBgColors.map( val => val.replace( '/ 50%', '' ) );

		}

        return outputDataset;

    }

	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
		
        this.cd.detectChanges();
	}

	returnZero() {
		return 0;
	}

}
