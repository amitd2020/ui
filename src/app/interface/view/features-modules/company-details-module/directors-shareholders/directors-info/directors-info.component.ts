import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}
@Component({
	selector: 'dg-directors-info',
	templateUrl: './directors-info.component.html',
	styleUrls: ['./directors-info.component.scss']
})
export class DirectorsInfoComponent implements OnInit {

	@Input() companyData: any;

	isLoggedIn: boolean = false;
	userId: unknown = '';

	msgs: any[];
	directorDataColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; visible:boolean; countryAccess: Array<string>; }[];

	directorDetails: any = [];
	directorLinkedIn = [];
	directorOverviewArray: Array<any> = undefined;
	disqualifiedDeletedExceptionDirectors: Array<any> = [];
	directorTabData: object = {};
	directorTableData: Array<any> = [];
	companyRegFromChildCommunicator: string = undefined;

	companydirectorStatusCounts: any = {
		total: 0,
		active: 0,
		resigned: 0,
		inactive: 0,
		activeSecretary: 0
	};
	directorDataInfoObj: any = {
        userId: undefined,
        companyNumber: '',
        companyName: undefined,
        directorPNR: undefined,
        directorFirstName: undefined,
		directorMiddleName: undefined,
        directorLastName: undefined,
        directorEmail: undefined,
        directorJobTitle: undefined,
        directorTelephone: undefined,
        directorLinkedin: undefined
    }

	disqualifiedDirectorsCount: number = 0;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	countryCodemap = new Map();

	monthsEnum: any = Month;
	showDirector: boolean;
	showOrHideDirectorContactInfoModal: boolean = false;

    countryNameMap = new Map();
	childComponentCommunicationSubscription: Subscription;
	selectedGlobalCountry: string = 'uk';

	constructor(
		private userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private dataCommunicatorService: DataCommunicatorService,
		private router: Router,
		private activateRouter: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService

	) {
		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();
	}

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn )

		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.companyRegFromChildCommunicator = this.dataCommunicatorService.$dataCommunicatorVar?.['source']?.['_value']?.['companyRegistrationNumber'];
		this.sharedLoaderService.showLoader();

		if( this.selectedGlobalCountry && this.isLoggedIn ) {
			this.directorDataColumn = [
				{ field: 'updateDirectorData', header: 'Action', minWidth: '60px', maxWidth: '60px', textAlign: 'center', visible: true, countryAccess: [ 'uk' ] },
				{ field: 'monitorBoolean', header: '', minWidth: '40px', maxWidth: '40px', textAlign: 'center', visible: ( ['admin', 'default'].includes( JSON.parse(localStorage.getItem('types'))[0] ) || this.userAuthService.hasAddOnPermission('companyMonitorPlus') ) ? true : false, countryAccess: [ 'uk' ]  },
				{ field: 'directorFullName', header: 'Name', minWidth: '320px', maxWidth: '320px', textAlign: 'left', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'directorStatus', header: 'Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'activeDirectorshipsCount', header: 'Active Directorships Count', minWidth: '160px', maxWidth: '160px', textAlign: 'right', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'totalDirectorshipsCount', header: 'Directorships Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'honors', header: 'Honors', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'appointedOn', header: 'Appointed On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'resignedOn', header: 'Resigned On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				// { field: 'directorEmail', header: 'Email', minWidth: '250px', maxWidth: '250px', textAlign: 'left',  visible: ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ? true : false, countryAccess: [ 'uk', 'ie' ] },
				{ field: 'directorOccupation', header: 'Occupation', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'directorRole', header: 'Role', minWidth: '140px', maxWidth: '140px', textAlign: 'left', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'nationality', header: 'Nationality', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'country', header: 'Country', minWidth: '140px', maxWidth: 'none', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'address', header: 'Address1', minWidth: '500px', maxWidth: 'none', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'address', header: 'Address', minWidth: '500px', maxWidth: 'none', textAlign: 'left', visible: true, countryAccess: [ 'ie' ]  },
				{ field: 'serviceAddress', header: 'Address2', minWidth: '500px', maxWidth: 'none', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'dateOfBirth', header: 'Date of Birth', minWidth: '130px', maxWidth: '130px', textAlign: 'center', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'directorAge', header: 'Age', minWidth: '130px', maxWidth: '130px', textAlign: 'right', visible: true, countryAccess: [ 'uk', 'ie' ]  },
				{ field: 'deletedOn', header: 'Deleted On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'exceptions', header: 'Exceptions', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				// { field: 'checkSanctions', header: 'PEP and Sanctions', minWidth: '400px', maxWidth: 'none', textAlign: 'center', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'disqualification', header: 'Disqualification', minWidth: '210px', maxWidth: '210px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  },
				{ field: 'qualification', header: 'Qualification', minWidth: '120px', maxWidth: '120px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ]  }
			];
		}

		// const { companyNo } = this.activateRouter?.params[ '_value' ];
		if ( this.isLoggedIn ) {
			this.directorDataColumn = this.directorDataColumn.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
		}
		this.getCompanyDirectorsData();

	}

	getCompanyDirectorsData() {

		let queryParam = [ { key:'companyNumber', value: this.companyRegFromChildCommunicator } ];
		if ( this.isLoggedIn ) queryParam.push( { key:'id', value: this.userAuthService.getUserInfo( 'dbID' ) as string } );
			
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_DIRECTOR_DETAILS_2', 'directors', undefined, undefined, queryParam).subscribe({
			next: ( res ) => {
				this.directorTabData = res.body.response;
				this.directorTableData = res.body.response.directorsData;	
				this.directorTableData.map( director => {
					if ( director.hasOwnProperty('appointedOn') ) {
						const [ date, month, year ] = director.appointedOn.split('-');
						director['appointedOn'] = `${year}-${month}-${date}`;
					}
					return director;
				});			
				this.sharedLoaderService.hideLoader();
			},
			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}
		})

	}

	updateTableDataList( event ) {
        if ( event.thisPage == 'directorsInfo' ) {
            this.getCompanyDirectorsData();
        }
    }

	formatDirectorAddress(data) {
		return this.commonService.formatDirectorAddress(data);
	}

	directorsAge(date_of_birth) {
		return this.commonService.directorsAge(date_of_birth);
	}

	disqualifiedDirectorDetails() {
		let obj = {
			"pnr": this.disqualifiedDeletedExceptionDirectors,
			"cmpNo": this.companyData?.companyRegistrationNumber
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_DIRECTOR_DETAILS', 'disqualifiedDirectors', obj ).subscribe( res => {
		// this.companyService.getDisqualifiedDirectorDetails(obj).then(data => {
			if (res.body.status == 200) {
				if (res.body.results.length > 0) {

					this.disqualifiedDirectorsCount = res.body.results.length;

					for (let dirDetail of this.directorDetails) {

						for (let disqualifiedDirDetail of res.body.results) {
							if (dirDetail.directorPnr == disqualifiedDirDetail.PNR) {
								dirDetail['disqualifiedDirectors'] = disqualifiedDirDetail;
							}
						}
					}
				}
			}
		})
	}

	deletedDirectorDetails() {

		let obj = {
			"pnr": this.disqualifiedDeletedExceptionDirectors,
			"cmpNo": this.companyData?.companyRegistrationNumber
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_DIRECTOR_DETAILS', 'deletedDirectors', obj ).subscribe( res => {
			if (res.body.status == 200) {
				if (res.body.results.length > 0) {

					this.directorDetails.forEach(dirDetail => {

						for (let deletedDirDetail of res.body.results) {
							if (dirDetail.directorPnr == deletedDirDetail.PNR) {
								for (let key in deletedDirDetail) {
									if (key != "PNR") {
										let newKey = key == "DDATE" ? "deleteDate" : key
										dirDetail[newKey] = deletedDirDetail[key]
									}
								}
							}
						}
					});
				}
			}
		});
		
	}

	messageCommunicator( event ) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: event.msgs});
        setTimeout( () => {
            this.msgs = [];
        }, 3000);
    }

	directorDataInfo(event) {
        this.showOrHideDirectorContactInfoModal = true;  

		this.directorDataInfoObj.companyNumber = event.companyNumber;
		this.directorDataInfoObj.userId = event.userId;
		this.directorDataInfoObj.companyName = event.companyName;
		this.directorDataInfoObj.directorPNR = event.directorPnr;
		this.directorDataInfoObj.directorEmail = event.directorEmail && event.directorEmail != "-" ? event.directorEmail : "";        
		this.directorDataInfoObj.directorJobTitle = event.directorJobTitle && event.directorJobTitle != "-" ? event.directorJobTitle : ""; 
		// this.directorDataInfoObj.directorTelephone = event.tel_1 && event.tel_1 != "-" ? event.tel_1 : "";
		this.directorDataInfoObj.directorLinkedin = event.linkedin_url ? event.linkedin_url : "";
		this.directorDataInfoObj.directorFirstName = event.directorFirstName ? event.directorFirstName : "";
		// this.directorDataInfoObj.directorMiddleName = event.middleName ? event.middleName : "";
		this.directorDataInfoObj.directorLastName = event.directorLastName ? event.directorLastName : "";
    }
	
	onDirectorUpdateInformation() {        
        this.showOrHideDirectorContactInfoModal = false;

		if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
			this.directorDataInfoObj["isAdmin"] = true;
			
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateDirectorContactInfoData', this.directorDataInfoObj ).subscribe( res => {
				if (res.body.status === 200) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: "Director contact information updated!!" });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);

					let reqobj = [ this.directorDataInfoObj.companyNumber ];
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', reqobj ).subscribe( res => {
							if (res.body.status == "200 ") {
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Company Indexing Started" });
								setTimeout(() => {
									this.msgs = [];
								}, 2000);
							} else {
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" });
								setTimeout(() => {
									this.msgs = [];
								}, 2000);
							}
						}, err => {
							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" });
							setTimeout(() => {
								this.msgs = [];
							}, 2000);
						})
						

					const currentUrl = this.router.url;
						const activateRouteQueryParam = this.activateRouter.snapshot.url.length == 0;

						if( this.router.url.split('?')[0] && activateRouteQueryParam ) {

							window.open('/company/' + this.companyData?.companyRegistrationNumber + '/' + this.formatCompanyNameForUrl( this.titlecasePipe.transform( this.companyData?.businessName ) ) + '?type=viewDirectors', '_blank');

						} else {
							/*
								Do not enable the below code before discussing with Akmal.
								It reloads the `AppMainComponent`, which is the main
								layout container and parent for all of the Components/Modules.
								===============================================================
								this.router.routeReuseStrategy.shouldReuseRoute = () => false;
								===============================================================
							*/
							this.router.onSameUrlNavigation = 'reload';
							this.router.navigate( [ currentUrl ] );
						}
					setTimeout(() => {
						this.goToTab( 'viewDirectors' );
					}, 4000);
					setTimeout(() => {
						this.msgs = [];
					}, 6000);
				} else {
					this.msgs = [];
					this.msgs.push({ severity: 'error', summary: "Director contact information not updated!!" });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				}
			});

		} else {
			this.directorDataInfoObj["isAdmin"] = false;
			
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'directorSuggestRequest', this.directorDataInfoObj ).subscribe( res => {
				if (res.body) {
					if(res.body.status === 201) {
						this.msgs = [];
						this.msgs.push({ severity: 'info', summary: 'Already a suggestion for this director is there.', detail: '' });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);    
					}
					else {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Your data sent to the Admin for verification.' });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
					}
					setTimeout(() => {
						this.msgs = [];
					}, 2000);
				}
			});
		}

    }

	getCountryCode() {
		this.sharedLoaderService.showLoader();
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'countryName').subscribe( res => {
			if (res.status === 200) {
				
				for (let i = 0; i < res['body']['result'].length; i++) {
					this.countryCodemap.set(res['body']['result'][i].Nationality.toLowerCase(), res['body']['result'][i].Code.toLowerCase());
                    this.countryNameMap.set(res['body']['result'][i].Country.toLowerCase(), res['body']['result'][i].Code.toLowerCase());
                }
            }
			// this.sharedLoaderService.hideLoader();
        })
    }

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	goToTab( routes: string ) {
		this.dataCommunicatorService.childComponentUpdateData( routes );
    }

}
