import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, take } from 'rxjs';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-person-contact-info',
	templateUrl: './person-contact-info.component.html',
	styleUrls: ['./person-contact-info.component.scss']
})
export class PersonContactInfoComponent implements OnInit {

	isLoggedIn: boolean = false;

	dataProviderInfoColumns: any[];
	dataProviderInfo: Array<any>;

	msgs = [];

	companyNumber: any;
	companyName: any;
	othersContactData: any;

	showOrHideContactInfoModal: boolean = false;

	contactInformationObj: any = {
		companyNumber: '',
		companyName: '',
		directorFirstName: '',
		directorLastName: '',
		directorEmail : '',
		// directorJobTitle: '',
		personPosition: '',
		directorLinkedin: '',
		contact_pnr: '',
		// directorPNR: '',
		id: '',
	}

	childComponentCommunicationSubscription: Subscription;

	constructor(
		private dataCommunicatorService: DataCommunicatorService,
		public userAuthService: UserAuthService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		public commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( loggedIn => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				
				this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
					this.companyNumber = res.companyRegistrationNumber;
					this.companyName = res.businessName;
				});
		
				this.getOthersContactInfoData();
				
				this.dataProviderInfoColumns = [
					{ field: 'action', header: 'Action', minWidth: '80px', maxWidth: '80px', textAlign: 'center', visible: true },
					{ field: 'fullName', header: 'Person Name', minWidth: '220px', maxWidth: 'none', textAlign: 'left', visible: true },
					// { field: 'phoneNumber', header: 'Phone Number', minWidth: '200px', maxWidth: '200px', textAlign: 'left', visible: (  this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   ) },
					{ field: 'email', header: 'Email', minWidth: '320px', maxWidth: '320px', textAlign: 'left', visible: ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) },
					{ field: 'position', header: 'Position', minWidth: '350px', maxWidth: '350px', textAlign: 'left', visible: true },
					// { field: 'status', header: 'Status', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: true }
				];
				
			}

		});

	}

	getOthersContactInfoData() {

		let reqArr = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'othersContactInfo', reqArr ).subscribe( res => {
			
			if ( res.body['code'] == 200 ) {

				this.othersContactData = res.body['response'];

				this.othersContactData = this.othersContactData.sort( (a, b) => a.position !== '' ? -1 : 1 );

				if ( this.othersContactData ) {

					this.dataProviderInfo = this.othersContactData;

					for ( let tempDataProviderInfo of this.dataProviderInfo ) {

						if ( tempDataProviderInfo ) {

							let fullname = "";

							if ( tempDataProviderInfo.firstName && tempDataProviderInfo.firstName != "null" ) {
								fullname = tempDataProviderInfo.firstName + " ";

							} if ( tempDataProviderInfo.middleName && tempDataProviderInfo.middleName != "null" ) {
								fullname += tempDataProviderInfo.middleName + " ";

							} if ( tempDataProviderInfo.lastName && tempDataProviderInfo.lastName != "null" ) {
								fullname += tempDataProviderInfo.lastName + " ";

							}

							tempDataProviderInfo['fullName'] = fullname && fullname ? fullname : '-';

							if ( tempDataProviderInfo['position'] ) {

								tempDataProviderInfo['position'] = tempDataProviderInfo['position'].replace(/&amp;/g, '&');

							}

						}
					}

				}

			} else if ( res.body['code'] == 404 ) {

				this.dataProviderInfo = res.body['response'];
	
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
			
		});

	}

	formatCompanyNameForUrl(companyName) {
		if (companyName !== undefined) {
			return this.commonService.formatCompanyNameForUrl(companyName);
		}
	}

	showModalDialogForContact( data ) {
		this.showOrHideContactInfoModal = true;
		this.contactInformationObj.user_id = this.userAuthService.getUserInfo('dbID')
		this.contactInformationObj.companyNumber = data.companyNumber;
		this.contactInformationObj.companyName = data.companyName;
		this.contactInformationObj.directorFirstName = data.firstName;
		this.contactInformationObj.directorLastName = data.lastName;
		this.contactInformationObj.directorEmail = data.email;
		this.contactInformationObj.directorJobTitle = data.position;
		this.contactInformationObj.directorLinkedin = data.sourcePage;
		this.contactInformationObj.id = data.id;
        if (data.contact_pnr) {
            this.contactInformationObj.contact_pnr = data.contact_pnr;
        } else {
            this.contactInformationObj.contact_pnr = "DG_" + data.companyNumber + "_" + Math.floor((Math.random() * 10000000000) + 1);
        }
	}

	onContactInformationUpdate() {

		this.showOrHideContactInfoModal = false;

		if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

			this.contactInformationObj["isAdmin"] = true;
			
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateDirectorContactInfoData', this.contactInformationObj ).subscribe( res => {
				if (res.body.status === 200) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: "Contact Information data updated!!" });

					let reqobj = [ this.contactInformationObj.companyNumber ];
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
						});

					const currentUrl = this.router.url;
					const activateRouteQueryParam = this.activeRoute.snapshot.url.length == 0;

					if (this.router.url.split('?')[0] && activateRouteQueryParam) {

						window.open('/company/' + this.companyNumber + '/' + this.formatCompanyNameForUrl(this.titlecasePipe.transform(this.companyName)) + '?type=viewContactInfo', '_blank');

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
						this.router.navigate([currentUrl]);
					}
					setTimeout(() => {
						this.goToTab('viewContactInfo');
					}, 4000);
					setTimeout(() => {
						this.msgs = [];
					}, 6000);
				} else {
					this.msgs = [];
					this.msgs.push({ severity: 'error', summary: "Contact Information data not updated!!" });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
			});

		} else {
			this.contactInformationObj["isAdmin"] = false;
			this.globalServerCommunication.globalServerRequestCall('post', 'DG_HELPDESK', 'otherContactSuggestRequest', this.contactInformationObj).subscribe(res => {
				let data = res.body;
				if ( data ) {
					if ( data.status == 200 ) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Your data sent to the Admin for verification.' });
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'info', summary: 'Already a suggestion for this company is there.', detail: '' });
					}
					setTimeout(() => {
						this.msgs = [];
					}, 2000);
				}
			});
		}

	}

	goToTab( routes: string ) {
		this.dataCommunicatorService.childComponentUpdateData(routes);
	}

}
