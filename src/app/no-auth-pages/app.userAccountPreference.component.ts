import { TitleCasePipe } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { ServerCommunicationService } from "../interface/service/server-communication.service";
import { UserAuthService } from "../interface/auth-guard/user-auth/user-auth.service";

@Component({
	selector: 'dg-userAccountPreference',
	templateUrl: './app.userAccountPreference.component.html',
	styleUrls: [ './no-auth-pages.component.scss' ]
})
export class UserAccountPreferenceComponent {

	index: number;
	showOtherDiv: boolean = false;
	showThankyouDiv: boolean = false;

	/**feature variables */
	otherFeature: String;
	otherProfession: String;
	otherworkingIndustries: String;
	selectedfeature: String;
	otherWorkingSector: String;

	/**dropdown variables */
	workingIndustries: any
	interestedIndustries = [];
	WorkingSector: any
	profession: any
	other_profession: any;
	cities = [];


	/**selection variables */
	selectedProfession: any;
	selectedworkingIndustry: String;
	selectedWorkingSector: String;
	selectedCity: String;
	selectedIndustry: String;
	selectedcategory: any;
	firstButton: String;
	validateFirstPage: Boolean = false;
	showOtherText: Boolean = false;
	showOtherTextOne: Boolean = false;
	showOtherTextTwo: Boolean = false;
	inputTextValidate: Boolean = false;


	constructor(
		private userAuthService: UserAuthService,
		private router: Router,
		private titlecasePipe: TitleCasePipe,
		private changeDetectorRef: ChangeDetectorRef,
		private globalServiceCommnunicate: ServerCommunicationService
	) {

		//An array of profession
		this.profession = [
			{ name: 'Founder', code: 'Founder' },
			{ name: 'Executive', code: 'Executive' },
			{ name: 'Director', code: 'Director' },
			{ name: 'Secretary', code: 'Secretary' },
			{ name: 'Manager', code: 'Manager' },
			{ name: 'Student', code: 'Student' },
			{ name: 'Self-employed individual', code: 'Self-employed individual' },
			{ name: 'Un-employed individual', code: 'Un-employed individual' },
			{ name: 'Others', code: 'Others' }
		];

		//An array of workingCompanies
		this.workingIndustries = [
			{ name: 'Business Development', code: 'Business Development' },
			{ name: 'Finance/Investment', code: 'Finance/Investment' },
			{ name: 'Entrepreneur', code: 'Entrepreneur' },
			{ name: 'Engineering/Product', code: 'Engineering/Product' },
			{ name: 'IT', code: 'IT' },
			{ name: 'Marketing/Advertising', code: 'Marketing/Advertising' },
			{ name: 'Recruiting/HR', code: 'Recruiting/HR' },
			{ name: 'Sales', code: 'Sales' },
			{ name: 'Customer Support', code: 'Customer Support' },
			{ name: 'Others', code: 'Others' }
		];

		//An array of WorkingSector
		this.WorkingSector = [
			{ name: 'Agriculture', code: 'Agriculture' },
			{ name: 'Apparel', code: 'Apparel' },
			{ name: 'Banking', code: 'Banking' },
			{ name: 'Biotechnology', code: 'Biotechnology' },
			{ name: 'Communications', code: 'Communications' },
			{ name: 'Construction', code: 'Construction' },
			{ name: 'Consulting', code: 'Consulting' },
			{ name: 'Education', code: 'Education' },
			{ name: 'Energy', code: 'Energy' },
			{ name: 'Environmental', code: 'Environmental' },
			{ name: 'Entertainment', code: 'Entertainment' },
			{ name: 'Food & Beverage', code: 'Food & Beverage' },
			{ name: 'Government', code: 'Government' },
			{ name: 'Healthcare', code: 'Healthcare' },
			{ name: 'Hospital', code: 'Hospital' },
			{ name: 'Insurance', code: 'Insurance' },
			{ name: 'Media', code: 'Media' },
			{ name: 'Machinery', code: 'Machinery' },
			{ name: 'Manufacturing', code: 'Manufacturing' },
			{ name: 'Recreation', code: 'Recreation' },
			{ name: 'Shipping', code: 'Shipping' },
			{ name: 'Technology', code: 'Technology' },
			{ name: 'Telecommunication', code: 'Telecommunication' },
			{ name: 'Transportation', code: 'Transportation' },
			{ name: 'Others', code: 'Others' },
		];


	}


	ngOnInit() {

		this.sortProfessionArray();
		this.sortWorkingIndustriesArray();
		this.sortWorkingSectorArray();

		this.index = 0;

		//This service gives the industries data from database

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'distinctIndustries' ).subscribe( res => {
			let data = res.body;
			if (data.status === 200) {
				if (data['results']) {
					data['results'].forEach(element => {
						this.interestedIndustries.push({ label: this.titlecasePipe.transform(element), value: element });
					});
				}
			}
		});

		//This service get cities from json
		this.globalServiceCommnunicate.getDataFromJSON( 'ukCities.json').subscribe(res => {
			let data = res.body;
			if (data.status === 200) {
				if (data['result']) {
					data['result'].forEach(element => {
						this.cities.push({ label: this.titlecasePipe.transform(element['city']), value: element['city'] });
						this.cities = this.cities.sort((a, b) => {
							let prevLabel: any = a.label,
								newLabel: any = b.label;
							if (prevLabel < newLabel) return -1;
							if (prevLabel > newLabel) return 1;
                            return 0;
						});
					});
				}

			}
		});
	}

	handleChange(e) {
		this.changeDetectorRef.detectChanges();
		if (this.validateButtons()) {
			this.index = e.index;
			this.validateFirstPage = false;
		} else {
			this.index = 0;
			this.validateFirstPage = true;
		}
	}

	sortProfessionArray() {
		this.profession = this.profession.sort((a, b) => {
			let prevName: any = a.name,
				newName: any = b.name;
			if (prevName < newName) return -1;
			if (prevName > newName) return 1;
            return 0;
		});
	}

	sortWorkingIndustriesArray() {
		this.workingIndustries = this.workingIndustries.sort((a, b) => {
			let prevName: any = a.name,
				newName: any = b.name;
			if (prevName < newName) return -1;
			if (prevName > newName) return 1;
            return 0;
		});
	}

	sortWorkingSectorArray() {
		this.WorkingSector = this.WorkingSector.sort((a, b) => {
			let prevName: any = a.name,
				newName: any = b.name;
			if (prevName < newName) return -1;
			if (prevName > newName) return 1;
            return 0;
		});
	}

	openNext() {
		if (this.validateButtons()) {
			if((this.selectedcategory === 'others') && (this.otherFeature === undefined || this.otherFeature === null || this.otherFeature === "")) {
				this.inputTextValidate = true;
				return;
			}
			this.validateFirstPage = false;
			this.inputTextValidate = false;
			this.index = (this.index === 1) ? 0 : this.index + 1;
		} else {
			this.validateFirstPage = true;
		}
	}


	openPrev() {
		this.index = (this.index === 0) ? 2 : this.index - 1;
		// this.validateFeedbackForm = false;
	}

	openOther() {
		if (this.showOtherDiv === false) {
			this.showOtherDiv = true
		} else {
			this.showOtherDiv = false;
			this.otherFeature = '';
		}
	}

	finish() {
		this.router.navigate(['/']);	   
	}


	validateButtons() {
		if (this.selectedcategory !== undefined && this.selectedcategory !== null && this.selectedcategory !== "") {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Method       : UserPreferenceFormSubmit()
	 * summary      : This method submit the user preference data and save the it into database
	 *                and when we get success response we auto redirect to dashboard by setting
	 *                timeout of 5 sec.
	 * Modified_desc: Put check for undefined values and fixed data casting issue. 
	 */
	UserPreferenceFormSubmit() {
		if (this.index === 1) {
			if (this.selectedcategory != undefined && this.selectedcategory != null) {
				if (this.selectedcategory === 'others') {
					if (this.otherFeature != null && this.otherFeature != undefined) {
						this.selectedfeature = this.otherFeature;
					}

				} else {
					this.selectedfeature = this.selectedcategory;
				}
			}
			let tempSelectedProfession, tempSelectedWorkingIndustry, tempSelectedWorkingSector;
			if (this.selectedProfession && this.selectedProfession['name'] === 'Others' && this.otherProfession != null && this.otherProfession != undefined) {
				tempSelectedProfession = this.otherProfession;
			} else {
				tempSelectedProfession = this.selectedProfession && this.selectedProfession['name'] ? this.selectedProfession['name'] : '';
			}
			if (this.selectedworkingIndustry && this.selectedworkingIndustry['name'] === 'Others' && this.otherworkingIndustries != null && this.otherworkingIndustries != undefined) {
				tempSelectedWorkingIndustry = this.otherworkingIndustries;
			} else {
				tempSelectedWorkingIndustry = this.selectedworkingIndustry && this.selectedworkingIndustry['name'] ? this.selectedworkingIndustry['name'] : '';
			}
			if (this.selectedWorkingSector && this.selectedWorkingSector['name'] === 'Others' && this.otherWorkingSector != null && this.otherWorkingSector != undefined) {
				tempSelectedWorkingSector = this.otherWorkingSector;
			} else {
				tempSelectedWorkingSector = this.selectedWorkingSector && this.selectedWorkingSector['name'] ? this.selectedWorkingSector['name'] : '';
			}


			let userID = this.userAuthService?.getUserInfo('dbID');
			
			let data = {
				userId: userID,
				feature: this.selectedfeature !== undefined && this.selectedfeature !== null ? this.selectedfeature : '',
				interestedCity: this.selectedCity !== undefined && this.selectedCity !== null ? this.selectedCity : '',
				workingSector: tempSelectedWorkingSector !== undefined && tempSelectedWorkingSector !== null ? tempSelectedWorkingSector : '',
				workingIndustry: tempSelectedWorkingIndustry !== undefined && tempSelectedWorkingIndustry !== null ? tempSelectedWorkingIndustry : '',
				profession: tempSelectedProfession !== undefined && tempSelectedProfession !== null ? tempSelectedProfession : '',
				interestedIndustry: this.selectedIndustry !== undefined && this.selectedIndustry !== null ? this.selectedIndustry : ''
			}
			// this service call for inserting the data into database

			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'insertUserAccountPreferenceData', data ).subscribe( res => {
				if (res.body.status == 200) {
					this.showThankyouDiv = true;
					let obj = {
						userId: userID,
						firstLogin: false
					}
					// this service update the boolean value of User after first login
					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'updateFirstLogin', obj ).subscribe( res => {

					});
				} else {
					console.log("error");
				}
			});
		}
	}

	selectIndustryOnClick(check) {

		if (check == 1) {
			this.selectedcategory = 'FinTech';
			this.showOtherDiv = false;
			this.otherFeature = '';
			this.validateFirstPage = false;
		}

		else if (check == 2) {
			this.showOtherDiv = false;
			this.selectedcategory = 'InsureTech';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}

		else if (check == 3) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Accountants';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}

		else if (check == 4) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Insurance';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}

		else if (check == 5) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Startups';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}
		else if (check == 6) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Marketing';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}
		else if (check == 7) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Solicitors';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}
		else if (check == 8) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Import';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}
		else if (check == 9) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Corporate';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}
		else if (check == 10) {
			this.showOtherDiv = false;
			this.selectedcategory = 'Commercial';
			this.otherFeature = '';
			this.validateFirstPage = false;
		}
		else if (check == 11) {
			this.showOtherDiv = true;
			this.selectedcategory = 'others'; 
			// this.selectedcategory = this.otherFeature;
			this.validateFirstPage = false;
		}
	}

	openOtherInput() {
		if (this.selectedProfession['name'] === 'Others') {
			this.showOtherText = true;
		} else {
			this.showOtherText = false;
		}
	}
	openOtherInputOne() {
		if (this.selectedworkingIndustry['name'] === 'Others') {
			this.showOtherTextOne = true;
		} else {
			this.showOtherTextOne = false;
		}
	}
	openOtherInputTwo() {
		if (this.selectedWorkingSector['name'] === 'Others') {
			this.showOtherTextTwo = true;
		} else {
			this.showOtherTextTwo = false;
		}
	}
}
