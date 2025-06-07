import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-charges',
	templateUrl: './charges.component.html',
	styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit {

	isLoggedIn: boolean = false;
	currentPlan: unknown;
	companyData: any;
	
	companyChargesData: Array<any> = undefined;

	chargesDataColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; countryAccess: Array<string>; }[];
	selectedGlobalCountry: string = 'uk';
	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private dataCommunicatorService: DataCommunicatorService,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( ( res: any ) => this.companyData = res );

		if ( this.userAuthService.hasFeaturePermission( 'Charges' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData.companyRegistrationNumber ) ) ) {

			this.currentPlan = this.userAuthService?.getUserInfo('planId');

			this.getCompanyChargesData();
			if(this.selectedGlobalCountry != 'uk'){
				this.chargesDataColumn = [
					{ field: 'submissionNumber', header: 'Submission Number', minWidth: '120px', maxWidth: '120px', textAlign: 'right', countryAccess: [ 'ie' ] },
					{ field: 'personEntitledName', header: 'Person Entitled', minWidth: '160px', maxWidth: '160px', textAlign: 'left', countryAccess: [ 'ie' ] },
					{ field: 'chargeTypeDescription', header: 'Charges Description', minWidth: '160px', maxWidth: '160px', textAlign: 'left', countryAccess: [ 'ie' ] },
					{ field: 'status', header: 'Status', minWidth: '140px', maxWidth: '140px', textAlign: 'center', countryAccess: [  'ie' ] },
					{ field: 'created_on', header: 'Created On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'ie' ] },
					{ field: 'registered_on', header: 'Registered On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'ie' ] },
					{ field: 'delivered_on', header: 'Satisfied On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'ie' ] },
					{ field: 'amountSecured', header: 'Amount-secured', minWidth: '350px', maxWidth: 'none', textAlign: 'left', countryAccess: [ 'ie' ] }
				];
			} else {
				this.chargesDataColumn = [
					{ field: 'charge_number', header: 'Charge No.', minWidth: '130px', maxWidth: '130px', textAlign: 'right', countryAccess: [ 'uk' ] },
					{ field: 'chargeCode', header: 'Charge Code', minWidth: '200px', maxWidth: '200px', textAlign: 'right', countryAccess: [ 'uk' ] },
					{ field: 'persons_entitled', header: 'Person Entitled', minWidth: '300px', maxWidth: '300px', textAlign: 'left', countryAccess: [ 'uk' ] },
					{ field: 'classification', header: 'Charge-description', minWidth: '300px', maxWidth: '300px', textAlign: 'left', countryAccess: [ 'uk' ] },
					{ field: 'status', header: 'Status', minWidth: '140px', maxWidth: '140px', textAlign: 'center', countryAccess: [ 'uk' ] },
					{ field: 'created_on', header: 'Created On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', countryAccess: [ 'uk' ] },
					{ field: 'registered_on', header: 'Registered On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', countryAccess: [ 'uk' ] },
					{ field: 'delivered_on', header: 'Satisfied On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', countryAccess: [ 'uk' ] },
					{ field: 'secured_details', header: 'Amount-secured', minWidth: '550px', maxWidth: 'none', textAlign: 'left', countryAccess: [ 'uk' ] },
					{ field: 'particulars', header: 'Short-particulars', minWidth: '550px', maxWidth: 'none', textAlign: 'left', countryAccess: [ 'uk' ] },
				];
			}

		}
	}

	getCompanyChargesData() {
		this.sharedLoaderService.showLoader();

		let compNo = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'companyChargesData', compNo ).subscribe( res => {

			if (res.body["status"] == 200) {

				if (res.body.results) {
					let tempArr: Array<any> = [];
					let sortingArray: Array<number> = [];
					let outstandingCount = 0;
					let partialSatisfiedCount = 0;
					let satifiedCount = 0;
					res.body.results.forEach(charge => {
						let tempCharge = {};
						for (let key in charge) {
							if (key == "mortgageNumber") {
								sortingArray.push(charge[key]);
								tempCharge["charge_number"] = charge[key];
							}
							else if (key == "regDate") {
								if (charge[key] != null && charge[key] != undefined) {
									let regDate = charge[key].split("/");
									tempCharge["registered_on"] = new Date(regDate[2], parseInt(regDate[1]) - 1, regDate[0]);
								}
							}
							else if (key == "createdDate") {
								if (charge[key] != null && charge[key] != undefined) {
									let createdDate = charge[key].split("/");
									tempCharge["created_on"] = new Date(createdDate[2], parseInt(createdDate[1]) - 1, createdDate[0]);
								}
							}
							else if (key == "satisfiedDate") {
								if (charge[key] != null && charge[key] != undefined) {
									let satisfiedDate = charge[key].split("/");
									tempCharge["delivered_on"] = new Date(satisfiedDate[2], parseInt(satisfiedDate[1]) - 1, satisfiedDate[0]);
								}
							}
							else if (key == "memorandumNature") {
								if (["b", "f", "p", "r"].includes(charge[key])) {
									tempCharge["status"] = "Fully Satisfied";
									satifiedCount++;
								}
								if (charge[key] == 's') {
									tempCharge["status"] = "Part Satisfied";
									partialSatisfiedCount++;
								}
								if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(charge[key])) {
									tempCharge["status"] = "Outstanding";
									outstandingCount++;
								}
							}
							else if ( key == 'status' ) {
								tempCharge["status"] = charge.status;
								outstandingCount++;
							}
							else if (key == "mortgageDetails") {
								charge[key].forEach((details: { recordType: string; description: string; }) => {
									if (details.recordType == "persons entitled") {
										tempCharge["persons_entitled"] = this.commonService.formatNameForPersonEntitled(details.description.split(";"));
									}
									if (details.recordType == "amount secured") {
										tempCharge["secured_details"] = details.description.replace(/[!@#$%^&*()�,.?";:{}|<>]/g, " ");
										// replace(/[^\w\s]/gi, '')
									}
									if (details.recordType == "mortgage type") {
										tempCharge["classification"] = details.description;
									}
									if (details.recordType == "mortgage detail") {
										tempCharge["particulars"] = details.description.replace(/[!@#$%^&*()�?";:{}|<>]/g, " ");
									}
								});

							}
							else {
								tempCharge[key] = charge[key]
							}
						}
						tempArr.push(tempCharge);
					});
					// tempArr = this.sortCharges(tempArr);

					this.companyChargesData = JSON.parse(JSON.stringify(tempArr));
					this.companyData['mortgagesOutstandingCount'] = outstandingCount;
					this.companyData['mortgagesPartialSatisfiedCount'] = partialSatisfiedCount;
					this.companyData['mortgagesSatifiedCount'] = satifiedCount;
				}
			}

            this.sharedLoaderService.hideLoader();

		});
	}

	sortCharges(tempArr) {
		var len = tempArr.length,
			min;
		for (let i = 0; i < len; i++) {
			min = i;
			for (let j = i + 1; j < len; j++) {
				if (tempArr[j]["status"] < tempArr[min]["status"]) {
					min = j;
				}
			}

			if (i != min) {
				this.swap(tempArr, i, min);
			}
		}
		return (tempArr.reverse())
	}

	swap(items, firstIndex, secondIndex) {
		var temp = items[firstIndex];
		items[firstIndex] = items[secondIndex];
		items[secondIndex] = temp;
	}

}
