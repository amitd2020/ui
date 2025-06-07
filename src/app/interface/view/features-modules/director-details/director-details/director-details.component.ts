import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { take } from 'rxjs';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { subscribedPlan } from 'src/environments/environment';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ConfirmationService } from 'primeng/api';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-director-details',
	templateUrl: './director-details.component.html',
	styleUrls: ['./director-details.component.scss']
})
export class DirectorDetailsComponent implements OnInit {

    @Input() thisPage: string;

    @Output() updateDirectorsMonitorBoolean = new EventEmitter<any>();

	isLoggedIn: boolean = false;
	userDetails: Partial< UserInfoType > = {};
	descriptionValue: string;
    showLoginDialog: boolean = false;
    showUpgradePlanDialog: boolean = false;

	monthsEnum: any = Month;
	directorDetailData: any;
	directorDetailCompaniesSummeryData: any;
	directorContactsData: any = {};
	newDirectorData: any;
	newDirectorShipCountsData: any = {};
	directorShareholdingDataForPNR: any;
	directorLink: any;
	directorName: any;

	directorFailureData:any;
	possibleCompanies: any = undefined;
	companyNameValue: any;
	companyOriginalName: any[];
	dateOfBirthValue: any;
    directorsAllOccupations: Array<any> = [];
	directorshipsCounts: any = [{
        active_count: 0,
        non_active_count: 0,
        resigned_count: 0,
        total: 0
    }];
    countryCodemap = new Map();
    countryNameMap = new Map();
	chartOptions = {};
	totalResultCount: number;
    tabViewPanelName: any ;
	sic_code: undefined;
    companiesSummeryTabData: Array<any> = [] ;
	directorDetailsCompanySummaryColumns: Array<{ field: string, header: string, minWidth: string, maxWidth: string, textAlign: string }> = [];
    directorDetailsShareholdingsSummaryColumns: Array<any> = [];
	possibleDirectorDetailsShareholdingsSummaryColumns: Array<any> = [];
    possibleDirectorDetailsShareholdingsSummaryData: Array<any> = ['1'];

	companyNumber: number;
	newDirectorDetailsCompanySummaryData: Array<any> = [];
	newShareholdingSummaryData: Array<any> = [];
	shareholdingSummaryCount: number;
    directorDetailsShareholdingsSummaryData: Array<any> = ['1'];
    subscribedPlanModal: any = subscribedPlan;
    constantMessages: any = UserInteractionMessages;
    msgs = [];
	rows: number = 10;
	first: number = 0;
	directorMonitor: boolean = false;
	directorPossibleCompaniesCount: number;
	possibleShareholdingsCount: number;
	directorPossibleCompaniesData: object[] = [];
	possibleShareholdingsData: object[] = [];
    showOrHideDirectorContactInfoModal: boolean = false;
    directorDataInfoObj: any = {
        userId: undefined,
        companyNumber: '',
        companyName: undefined,
        directorPNR: undefined,
        directorFirstName: undefined,
        directorLastName: undefined,
        directorEmail: undefined,
        directorJobTitle: undefined,
        directorTelephone: undefined,
        directorLinkedin: undefined,
    };

	selectedGlobalCountry: string = 'uk';
	directorTotalCompaniesCount: number;
	isShowMonitor: boolean;

	constructor(
		private userAuthService: UserAuthService,
		private _activatedRoute: ActivatedRoute,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private canonicalService: CanonicalURLService,
        private toCurrencyPipe: CurrencyPipe,
        private toNumberSuffix: NumberSuffixPipe,
        private confirmationService: ConfirmationService,
        private router: Router,

	) {

		// this.companyNumber = this._activatedRoute.snapshot.params["companyNumber"];
		
		if (this._activatedRoute.snapshot.params["directorLink"]) {
			this.directorLink = this._activatedRoute.snapshot.params["directorLink"];
		}

		if (this._activatedRoute.snapshot.params["directorName"]) {
			let regex = /-/g;
			this.directorName = this._activatedRoute.snapshot.params["directorName"].replace(regex, ' ');
		}
		if (this._activatedRoute.snapshot.params["directorName"]) {
			this.directorLink = this._activatedRoute.snapshot.params?.['directorLink']
		}
		
		this.canonicalService.setCanonicalURL(); //For updating Canonical URL at Directors Detail Page, For Seo Purpose.

	}
	
	ngOnInit() {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.isShowMonitor = ['admin', 'default'].includes( JSON.parse(localStorage.getItem('types'))[0] ) || this.userAuthService.hasAddOnPermission('companyMonitorPlus');

		this.sharedLoaderService.showLoader();
		
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( loggedIn => {
			this.isLoggedIn = loggedIn;
			
            if ( this.isLoggedIn ) {
				this.userDetails = this.userAuthService?.getUserInfo();
            }
			
        });
		
		if ( this.isLoggedIn ) {
			this.getLatestDirectorDetails();
			this.getDirectorInformationDetails();
		}

		this.directorDetailsCompanySummaryColumns = [
			{ field: 'companyNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'center' },
            { field: 'companyName', header: 'Name', minWidth: '450px', maxWidth: 'none', textAlign: 'left' },
            { field: 'companyStatus', header: 'Company Status', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
            { field: 'directorOccupation', header: 'Occupation', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
            { field: 'directorRole', header: 'Role', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
            { field: 'directorStatus', header: 'Director Status', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
            { field: 'personEntitled', header: 'Person Entitled', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
            { field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
            { field: 'dateOfJoining', header: 'Date Of Joining', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
            { field: 'dateOfResigning', header: 'Date Of Resigned', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
            { field: 'turnover', header: 'Turnover', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'totalAssets', header: 'Total Assets', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'totalLiabilities', header: 'Total Liabilities', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'netWorth', header: 'Net-Worth', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'directorQualification', header: 'Qualification', minWidth: '120px', maxWidth: '120px', textAlign: 'left' }
		]

		this.directorDetailsShareholdingsSummaryColumns = [
            { field: 'businessName', header: 'Company Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
            { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
            { field: 'companyStatus', header: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
            { field: 'shareType', header: 'Share Type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
            { field: 'currency', header: 'Currency', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
            { field: 'person_entitled', header: 'Person Entitled', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
            { field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
            { field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
            { field: 'sharePercent', header: '% of Total Share Count', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
            { field: 'value', header: 'Nominal Value', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
            { field: 'sic_code', header: 'Sic Code', minWidth: '500px', maxWidth: '500px', textAlign: 'left' },
        ];

		this.possibleDirectorDetailsShareholdingsSummaryColumns = [
            { field: 'shareHoldingCompanyName', header: 'Company Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
            { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
            { field: 'shareHoldingCompanyStatus', header: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
            { field: 'shareType', header: 'Share Type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
            { field: 'currency', header: 'Currency', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
            { field: 'person_entitled', header: 'Person Entitled', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
            { field: 'internationalScoreDesc', header: 'Risk Band', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
            { field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
            { field: 'share_percent', header: '% of Total Share Count', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
            { field: 'value', header: 'Nominal Value', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
            { field: 'sic_code', header: 'Sic Code', minWidth: '500px', maxWidth: '500px', textAlign: 'left' },
        ];

		this.initBreadcrumbAndSeoMetaTags();

	}

	initBreadcrumbAndSeoMetaTags() {

		if (this._activatedRoute.snapshot.url[0].path !== 'company-search') {
			// this.breadcrumbService.setItems([
			// 	{ label: 'Company Search', routerLink: ['/company-search'] },
			// 	{ label: 'Director Details' }
			// ]);
		}

	}
	
	getLatestDirectorDetails( pageSize?, pageNumber? ) {
		
		let queryParam =  [ 
			// { key: 'cn', value: this.companyNumber },
			{ key: 'pnr', value: this._activatedRoute['params']['_value']['directorLink'] },
			// { key: 'id', value: this.userDetails?.dbID },
			{ key: 'row', value: pageSize ? pageSize : 10 },
			{ key: 'startAfter', value: pageNumber ? pageNumber : 0 }
		];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_DIRECTOR_DETAILS_2', 'director', undefined, undefined, queryParam).subscribe(res => {
			if ( res.body.code == 200 ) {
				this.companiesSummeryTabData = [];
				// let dataArray = res.body.response?.directorCompanies;
				// this.newDirectorData[ 'directorMonitor' ] = res.body.response?.directorMonitor;
				
				this.directorMonitor = res.body?.response?.directorMonitor;
				this.directorTotalCompaniesCount = res.body.response?.directorTotalCompaniesCount;
				
				this.companiesSummeryTabData = this.formattedDirectorData( res.body?.response?.directorCompanies );
				this.companiesSummeryTabData = this.formatSearchingData( this.companiesSummeryTabData );
				
				for( let item of this.companiesSummeryTabData ) {
					if ( item?.dateOfJoining ) {
						item['dateOfJoining'] = this.formatDateToIso( item?.dateOfJoining );
					} 
					if ( item?.dateOfResigning ) {
						item['dateOfResigning'] = this.formatDateToIso( item?.dateOfResigning );
					}
				}

				this.directorPossibleCompaniesData = this.formattedDirectorData(res.body?.response?.directorPossibleCompanies );
				this.directorPossibleCompaniesData = this.formatSearchingData( this.directorPossibleCompaniesData );
				
				this.directorPossibleCompaniesCount = res.body?.response?.directorPossibleCompaniesCount;
			}
			
			this.shareholdingSummaryData();
		})
	}

	formatDateToIso( date ) {
		const [day, month, year] = date.split("-");
		return new Date(`${year}-${month}-${day}`).toISOString();
	}

	formatSearchingData( searchedData ) {
		for( let item of searchedData ) {
			let financialObj = item.financialData[0] && Object.keys( item.financialData[0] );
			if ( financialObj ) {
				for( let financial of financialObj ) {
					item[financial] = item.financialData[0][financial];
				}
			}
		}
		return searchedData;
	}

	getDirectorInformationDetails() {
		let queryParam = [ { key: 'pnr', value: this._activatedRoute['params']['_value']['directorLink'] } ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_DIRECTOR_DETAILS_2', 'director', ['info-and-counts'], undefined, queryParam ).subscribe( res =>{
			if ( res.body.code == 200 ) {
				this.newDirectorShipCountsData = res.body.response?.directorshipsCounts || {};
				this.newDirectorData = res.body.response?.directorInformation || {};
				this.companyNumber = res.body.response?.directorInformation.companyNumber;
			}
		});
	}

    getMessage(event) {

        if( event.status !== undefined && event.msgs !== undefined ) {

            this.msgs = [];

            this.msgs.push({ severity: event.status, summary: event.msgs });
            
            setTimeout(() => {
                this.msgs = [];
            }, 4000);

        }
        
    }

	formattedDirectorData(data) {
		let result = [];

		data?.forEach( item => {
			this.newDirectorDetailFinancialChart( item );
			const numberOfDuplicates = item.directorData.length;

			for (let i = 0; i < numberOfDuplicates; i++) {
				let tempObj = { ...item, ...item.directorData[i] };
				result.push( tempObj );
				delete item.directorData[i];
			}
		});

		return result;
	}

	possibleCompaniesSummary(event) {

		this.tabViewPanelName = event.originalEvent.srcElement.innerText;
    }

	shareholdingSummaryData() {
		let shareHoldingTabApiParam =  [
			{ key: 'pnr', value: this._activatedRoute['params']['_value']['directorLink'] },
		];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_DIRECTOR_DETAILS_2', 'directorShareholders', undefined, undefined, shareHoldingTabApiParam).subscribe({
			next: ( res ) => {

				if ( res.body.code == 200 ) {

					this.shareholdingSummaryCount = res.body.response.finalResponse.shareHoldingsCounts;
					
					this.newShareholdingSummaryData = res.body.response.finalResponse.shareHoldings;   
					this.possibleShareholdingsCount = res.body.response?.finalResponse?.possibleShareholdingsCounts;   
					this.possibleShareholdingsData = res.body.response?.finalResponse?.possibleShareholdings;   
					
					for (let item of this.newShareholdingSummaryData) {
						
						this.sic_code = item.sicCode07[0];
					}
				}
				this.sharedLoaderService.hideLoader();

			},
			error: ( err ) => {
				console.log('err>>>>',err);
				this.sharedLoaderService.hideLoader();

			}
		})
	}

	// getUpdateTableDataList( event ) {

	// 	if ( event.tableName == 'companiesSummaryTable' ) {
	// 		// this.getDirectorDetails( event.event.rows, event.event.first );
	// 	}

	// }

	// disqualifiedDirectorDetails() {
	// 	let obj = { "pnr": [+this.directorLink] };

	// 	this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_DIRECTOR_DETAILS', 'disqualifiedDirectors', obj).subscribe(res => {
			
	// 		let data = res.body;
	// 		if (data.status == 200) {

	// 			if (data.results.length > 0) {

	// 				for (let dirDetail of this.directorDetailData) {

	// 					for (let disqualifiedDirDetail of data.results) {

	// 						if (dirDetail.directorData.directorPnr == disqualifiedDirDetail.PNR) {
	// 							dirDetail.directorData['disqualificationDetails'] = disqualifiedDirDetail;
	// 						}

	// 					}

	// 				}

	// 			}

	// 		}
	// 	})
	// }

	newDirectorDetailFinancialChart ( dirDetailData ) {
		let finOverviewChartYears = [];
		if (dirDetailData.financialData) {

			dirDetailData['financeTurnoverData'] = [];
			dirDetailData['financeTotalAssetsData'] = [];
			dirDetailData['financeTotalLiabilitiesData'] = [];
			dirDetailData['financeNetWorthData'] = [];

			for (let finOverData of dirDetailData.financialData) {
				let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();

				finOverviewChartYears.push(finYear);

				dirDetailData['financeTurnoverData'].push(finOverData.turnover ? finOverData.turnover : 0);
				dirDetailData['financeTotalAssetsData'].push(finOverData.totalAssets ? finOverData.totalAssets : 0);
				dirDetailData['financeTotalLiabilitiesData'].push(finOverData.totalLiabilities ? finOverData.totalLiabilities : 0);
				dirDetailData['financeNetWorthData'].push(finOverData.netWorth ? finOverData.netWorth : 0);
			}
		}

		dirDetailData.financeChartData = {
			labels: finOverviewChartYears,
			datasets: [
				{
					label: 'Turnover',
					data: dirDetailData.financeTurnoverData,
					fill: false,
					borderColor: '#5b9bd5'
				},
				{
					label: 'Total Assets',
					data: dirDetailData.financeTotalAssetsData,
					fill: false,
					borderColor: '#ffc000'
				},
				{
					label: 'Total Liabilities',
					data: dirDetailData.financeTotalLiabilitiesData,
					fill: false,
					borderColor: '#ed7d31'
				},
				{
					label: 'Net Worth',
					data: dirDetailData.financeNetWorthData,
					fill: false,
					borderColor: '#60af60'
				}
			]

		};


		this.chartOptions = {
			tension: 0.4,
			scales: {
				x: {
					ticks: {
						font: {
							family: 'Roboto',
						},
						padding: 8
					}
				},
				y:  {
					ticks: {
						font: {
							family: 'Roboto',
						},
						padding: 8,
						callback: (label, index, labels) => {
							return this.toNumberSuffix.transform( label, 0, 'GBP' );
						}
					}
				}
			},
			plugins: {
				datalabels: {
					display: false
				},
				legend: {
					labels: {
						fontFamily: 'Roboto',
						padding: 15
					}
				},
				title: {
					fontFamily: 'Roboto',
				},
				tooltip: {
					enabled: true,
					titleFontFamily: 'Roboto',
					bodyFontFamily: 'Roboto',
					callbacks: {
						label: ( tooltipItem ) => {
							return `${ tooltipItem.dataset.label }: ${ this.toCurrencyPipe.transform( tooltipItem.raw, 'GBP', 'symbol', '1.0-0' ) }`;
						}
					}
				},
			}
		}

	}

	// directorsAge(date_of_birth) {
	// 	return this.commonService.directorsAge(date_of_birth);
	// }

	// sortCompanies(tempArr) {
	// 	var len = tempArr.length,
	// 		min;
	// 	for (let i = 0; i < len; i++) {
	// 		min = i;
	// 		for (let j = i + 1; j < len; j++) {
	// 			if (tempArr[j]['IncDate'] > tempArr[min]['IncDate']) {
	// 				min = j;
	// 			}
	// 		}

	// 		if (i != min) {
	// 			this.swap(tempArr, i, min);
	// 		}
	// 	}
	// 	return (tempArr);
	// }

	// swap(items, firstIndex, secondIndex) {
	// 	var temp = items[firstIndex];
	// 	items[firstIndex] = items[secondIndex];
	// 	items[secondIndex] = temp;
	// }

	addDirectorToWatchList( ) {

        if ( this.isLoggedIn ) {

            if ( this.userAuthService.hasFeaturePermission( 'Director Monitor' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

                let requestObject = {
                    directorsList: [
                        {
                            directorPnr: this._activatedRoute['params']['_value']['directorLink'],
                            directorName: this.directorName,
                            companyNumber: this.companyNumber,
                        }
                    ],
                    // userId: this.userDetails?.dbID
                };

                this.confirmationService.confirm({
                    message: this.constantMessages['confirmation']['addDirectorMonitorList'],
                    header: 'Confirmation',
                    icon: 'pi pi-exclaimation-triangle',
                    key: 'director',
                    accept: () => {
                        // let obj = {
                        //     userId: this.userDetails?.dbID
                        // }
                        this.globalServerCommunication.globalServerRequestCall('get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
                            let userData = res.body.results[0];
                            if (userData && userData.directorMonitorLimit > 0) {
                                this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListDirectors', requestObject ).subscribe( res => {
                                    if (res.status == 200) {
										// this.directorInMonitor = !this.directorInMonitor;
                                        // this.updateDirectorsMonitorBoolean.emit({ thisPage: 'director', directorInMonitor: !this.directorInMonitor });
                                        this.msgs = [];
										this.getLatestDirectorDetails();
                                        this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['directorMonitorSuccess'] });
    
                                        setTimeout(() => {
                                            this.msgs = [];
                                        }, 3000);
                                    } else if (res.status == 201) {
                                        if (res.message == 'Directors Already Exists') {
                                            this.msgs = [];
                                            this.msgs.push({ severity: 'info', summary: `Director has been already added to the monitoring list.` });
    
                                            setTimeout(() => {
                                                this.msgs = [];
                                                // this.router.navigate([`/director/${this.formatDirectorNameForUrl(directorData.detailedInformation.fullName)}/${directorData.directorPnr}`]);
                                            }, 3000);
                                        }
                                    }
                                });
                                let directorMonitorLimit = userData.directorMonitorLimit - requestObject.directorsList.length;
                                this.reduceExportLimit(directorMonitorLimit, "directorMonitorLimit");
                            } else {
                                this.msgs = [];
                                this.msgs.push({ severity: 'info', detail: 'No available Limit to add director in monitor!!' });
                                setTimeout(() => {
                                    this.msgs = [];
                                }, 2000);
                            }
                        });
    
                    }
                });

            } else {
                event.preventDefault();
                event.stopPropagation();
                this.showUpgradePlanDialog = true;
            }


        } else {
            event.preventDefault();
            event.stopPropagation();
            this.showLoginDialog = true;
        }

    }

    removeDirectorFromWatchList( directorData ) {

        if ( this.isLoggedIn ) {

            let requestObject = {
                directorsList: [ directorData.directorPnr ],
                userId: this.userDetails?.dbID
            };

            this.confirmationService.confirm({
                message: this.constantMessages['confirmation']['removeDirectorMonitorList'],
                header: 'Confirmation',
                icon: 'pi pi-exclaimation-triangle',
                key: 'director',
                accept: () => {

                    this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'removeFromDirectorWatchList', requestObject ).subscribe( res => {
                        if ( res.status == 200 ) {
							// this.directorInMonitor = !this.directorInMonitor;
                            // this.updateDirectorsMonitorBoolean.emit( { thisPage: this.thisPage, directorInMonitor: this.directorInMonitor } );
                            this.msgs = [];
							this.getLatestDirectorDetails();
                            this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['directorMonitorRemoved'] });
                            
                            setTimeout( () => {
                                this.msgs = [];
                            }, 3000);
                        } else if ( res.status == 201 ) {
                            if ( res.message == 'Directors Already removed' ) {
                                this.msgs = [];
                                this.msgs.push({ severity: 'info', summary: `Director has been already removed from the monitoring list.` });

                                setTimeout(() => {
                                    this.msgs = [];
                                    // this.router.navigate([`/director/${ this.formatDirectorNameForUrl( directorData.detailedInformation.fullName ) }/${ directorData.directorPnr }`]);
                                }, 3000);
                            }
                        }
                    });

                }
            });

        } else {
            event.preventDefault();
            event.stopPropagation();
            this.showLoginDialog = true;
        }

    }

    messageCommunicator( event ) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: event.msgs});
        setTimeout( () => {
            this.msgs = [];
        }, 3000);
    }

	reduceExportLimit(newLimit, thisPage) {
		let obj = {
			userId: this.userDetails?.dbID,
            thisPage: thisPage,
            newLimit: newLimit
        }
        this.globalServerCommunication.reduceExportLimit(obj);
    }

	updateTableDataList(event) {
		this.rows = event.rows;
		this.first = event.first;
		this.getLatestDirectorDetails( this.rows, this.first );
	}

	firstName(director_name) {
		let firstName = "";
		if (director_name !== undefined) {
			let indexOfComma = director_name.indexOf(",");
			if (indexOfComma !== -1) {
				let firstName1 = director_name.substring(indexOfComma + 1).trim();
				if (firstName1.indexOf(' ') > -1)
					firstName = firstName1.substr(0, firstName1.indexOf(' '));
				else
					firstName = firstName1;
			} else if (director_name.indexOf(" ") !== -1) {
				firstName = director_name.substring(0, director_name.indexOf(" "));
			}
		}
		return firstName;
	}

	lastName(director_name) {
		let lastName = "";
		if (director_name !== undefined) {
			let indexOfComma = director_name.indexOf(",");
			if (indexOfComma !== -1) {
				lastName = director_name.substring(0, indexOfComma).trim();
			} else if (director_name.indexOf(" ") !== -1) {
				lastName = director_name.substring(director_name.lastIndexOf(" ") + 1);
			}
		}
		return lastName;
	}

	linkedInUrlForDirector(director_name, userUID) {
		userUID =  this.directorLink;
		var FinalName = " ";

		if ( this.isLoggedIn ) {

			if ( ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {
				this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'relatedCompanyToDirector', [userUID] ).subscribe( res => {
					
					if (res.body.status === 200) {
						let companiesarray = res.body['results'];
						let length = (companiesarray.length > 5) ? 5 : companiesarray.length;

						for (let j = 0; j < length; j++) {
							if (companiesarray[j].label !== undefined) {
								var NewName = companiesarray[j].label.trim().split(" ");
								// FinalName += NewName[0]
								for (let i = 0; i < NewName.length; i++) {
									if (NewName[i] !== "LIMITED" && NewName[i] !== "LTD") {
										FinalName += NewName[i] + "%20";
									}
								}
							}
							if (j !== length - 1) {
								FinalName += "%20OR%20";
							}

							if (j == length - 1) {
								let url = "https://www.linkedin.com/search/results/people/?firstName=" + this.firstName(director_name) + "&lastName=" + this.lastName(director_name);
								window.open(url, "_blank").focus();
							}
						}
					}
				});

			} else {
				event.preventDefault();
				event.stopPropagation();
				this.showUpgradePlanDialog = true;
			}

		} else {
			this.showLoginDialog = true;
		}

	}

	onDirectorUpdateInfo(dirDetailData) {

        if ( this.isLoggedIn ) {
            this.showOrHideDirectorContactInfoModal = true;
            this.directorDataInfoObj.companyNumber = dirDetailData.companyNumber;
            this.directorDataInfoObj.userId = this.userDetails?.dbID;
            this.directorDataInfoObj.companyName = dirDetailData?.companyName;
            this.directorDataInfoObj.directorPNR = dirDetailData?.PNR;
            this.directorDataInfoObj.directorEmail = dirDetailData.directorEmail && dirDetailData.directorEmail != "-" ? dirDetailData.directorEmail : "";
            this.directorDataInfoObj.directorJobTitle = dirDetailData.directorRole && dirDetailData.directorRole != "-" ? dirDetailData.directorRole : "";
            // this.directorDataInfoObj.directorTelephone = dirDetailData.directorData.tel_1 && dirDetailData.directorData.tel_1 != "-" ? dirDetailData.directorData.tel_1 : "";
            this.directorDataInfoObj.directorLinkedin = dirDetailData?.directorLinkedin ? dirDetailData.directorLinkedin : "";
            this.directorDataInfoObj.directorFirstName = this.newDirectorData?.directorForename ? this.newDirectorData?.directorForename : "";
            this.directorDataInfoObj.directorMiddleName = dirDetailData.directorData.detailedInformation?.middleName ? dirDetailData.directorData.detailedInformation.middleName : "";
            this.directorDataInfoObj.directorLastName = this.newDirectorData?.directorSurname ? this.newDirectorData?.directorSurname : "";
        } else {
            this.showLoginDialog = true;
        }

    } 
    onDirectorUpdateInformation() {        
        this.showOrHideDirectorContactInfoModal = false;   
        if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
            this.directorDataInfoObj["isAdmin"] = true;
            
            this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateDirectorContactInfoData', this.directorDataInfoObj ).subscribe( res => {
            
				if (res.body.status === 200) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: "Director contact information Updated!!" });
                    let reqobj = [ this.directorDataInfoObj.companyNumber ];
                    this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', reqobj ).subscribe( res => {
								if (res.status == "200 ") {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Company Indexing Started" })
								} else {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
								}
							},
							err => {
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
							})
                    setTimeout(() => {
                        this.msgs = [];
                    }, 3000);

                    setTimeout(() => {
                        const currentUrl = this.router.url;
                        /*
                            Do not enable the below code before discussing with Akmal.
                            It reloads the `AppMainComponent`, which is the main
                            layout container and parent for all of the Components/Modules.
                            ===============================================================
                            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                            ===============================================================
                        */
                        this.router.onSameUrlNavigation = 'reload';
                        this.router.navigate([currentUrl]);
                    }, 4000);

				} else {
					this.msgs = [];
					this.msgs.push({ severity: 'error', summary: "Director contact information not updated!!" });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
			});

        } else {
            this.directorDataInfoObj["isAdmin"] = false;
            
            this.globalServerCommunication.globalServerRequestCall('post', 'DG_HELPDESK', 'directorSuggestRequest', this.directorDataInfoObj ).subscribe( res => {
                this.msgs = [];
                if (res.body) {
                    if(res.body.status === 201) {
                        this.msgs.push({ severity: 'info', summary: 'Already a suggestion for this director is there.', detail: '' });    
                    }
                    else {
                        this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Your data sent to the Admin for verification.' });
                    }
                    setTimeout(() => {
                        this.msgs = [];
                    }, 4000);
                }
            });
        }                 
    }

}