import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload'
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'dg-upload-your-network',
	templateUrl: './linkedin-upload-csv.component.html',
	styleUrls: ['./linkedin-upload-csv.component.scss']
})
export class LinkedinUploadCsvComponent implements OnInit {


	@Output() selectedList = new EventEmitter<any>();

	@ViewChild('fileUploader', { static: false }) fileUpload: FileUpload;

	listArr = [];
	ListArrayData: any[];
	CompanyForAddList: any = [];
	selectedCompany: any = [];
	listArray = [];
	msgs = [];
	file: any;
	correctCompanies: any = [];
	correctCompanies2: any = [];
	companyNumberArray: any = [];
	file_name: any = '';
	favList: any;
	newCreateListName: string = "";
	currentPlan: unknown;
	title: string = '';
	description: string = '';
	displayModal: boolean;
	recordsAfterFilter: boolean = false;
	listboxReset: boolean = true;
	constantMessages: any = UserInteractionMessages;
	showUploadLimitBoolean: boolean = false;
	includeDissolvedCheckBool: boolean = false;
	isClientUser: boolean;

	//--------------------------------------------
	uploadCsvBool: boolean = false;
	displayUplaodPanel: boolean = false;
	searchMethod: string = 'personLinkedin';
	companyPersonLinkedinList: any = [];
	addAllListOfCompArr: any = [];
	tempAddAllSimilarCmpArray: any = [];
	exactMatchListOptions: any = [];
	noMatchListOptions: any = [];
	companyPersonLinkedin: any = [];
	onClickButtonValue: string = 'exactButton';
	searchType: string = 'similarMatch';
	urlObject = {
		companyLinkedin: 'companySocial_url',
		personLinkedin: 'person_linkedIn_url'
	}


	constructor (
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private titlecasepipe: TitleCasePipe,
		private sharedLoaderService:SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private http: HttpClient
	) { }

	ngDoCheck() {
		if (this.uploadCsvBool == false) {
			if (this.fileUpload) {
				this.fileUpload.files = [];
			}
		}
	}

	ngOnInit() {
		this.isClientUser= this.userAuthService.hasRolePermission( ['Client User'] )
		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		this.initBreadcrumbAndSeoMetaTags();
		this.sharedLoaderService.showLoader();
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Upload CSV', routerLink: ['/common-features/upload-csv'] }
		// ]);
		
		this.title = "Download & Upload CSV - DataGardener";
		this.description = "Easy Access to Download and  Upload csv files at datagardener.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	ShowingListData() {

		this.listArray = [];

		for (let i = 0; i < this.listArr.length; i++) {
			this.listArray.push({
				"name": this.listArr[i].listName + " (" + this.listArr[i].companiesInList + ")",
				"id": this.listArr[i].id, "listName": this.listArr[i].listName
			})
		}

		this.favList = this.listArray;
		this.listboxReset = true;
		this.sharedLoaderService.hideLoader();

	}

	uploadCsvButton() {
		this.uploadCsvBool = true;
	}

	next(){
		this.displayUplaodPanel= true;
	}

	back(){
		this.displayUplaodPanel= false;
		this.companyPersonLinkedinList = [];
		this.exactMatchListOptions = [];
		this.noMatchListOptions = [];
		this.file_name = '';
		this.showUploadLimitBoolean = false;
		this.includeDissolvedCheckBool = false;
		this.searchType = 'similarMatch';
	}

	clearInputText(){
		this.companyPersonLinkedinList = [];
		this.showUploadLimitBoolean = false;
		this.searchType = 'similarMatch';
		this.includeDissolvedCheckBool = false;
		this.clearListBox();

	}

	clearListBox() {
		this.file_name = '';
		this.exactMatchListOptions = [];
		this.noMatchListOptions = [];
	}

	searchInputText() {
		this.sharedLoaderService.showLoader();
		let obj;

		if ( this.companyPersonLinkedinList.split(/[\n,]+/).filter(e => e != "").length <= 1000 || ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.companyPersonLinkedinList.split(/[\n,]+/).filter(e => e != "").length <= 5000 ) ) {
			this.showUploadLimitBoolean = false;
			if (this.searchMethod == 'companyLinkedin') {
				obj = {
					linkedIn_url: this.companyPersonLinkedinList.split(/[\n,]+/).filter(e => e != ""),
					inputType: "company_linkedIn",
					// includeDissolved: this.includeDissolvedCheckBool,
				}
				obj['linkedIn_url'] = obj['linkedIn_url']
				// obj['linkedIn_url'] = obj['linkedIn_url'].map( obj => obj.toLowerCase().trim());
			} else if (this.searchMethod == 'personLinkedin') {
				obj = {
					linkedIn_url: this.companyPersonLinkedinList.split(/[\n,]+/).filter(e => e != ""),
					inputType: "person_linkedIn",
					// searchType: this.searchType,
					// includeDissolved: this.includeDissolvedCheckBool,
				}
				obj['linkedIn_url'] = obj['linkedIn_url']
				// obj['linkedIn_url'] = obj['linkedIn_url'].map( obj => obj.toLowerCase().trim() )
			}
			this.validateUploadedCsv(obj);
		} else {
			this.showUploadLimitBoolean = true;
			this.sharedLoaderService.hideLoader();
		}
	}

	onUploadData(){
		this.recordsAfterFilter = false;
		let obj = {
			listName: this.newCreateListName,
			userId: this.userAuthService?.getUserInfo('dbID'),
			page: "companySearch"
		};
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'addListForAUser', obj ).subscribe( res => {

			let data = res.body;

			if ( data.status === 200 ) {
				this.listArr.unshift({
					listName: data['body']['listName'],
					id: data["body"]["_id"],
					created: data["body"]["created"],
					lastUpdated: data["body"]["lastUpdated"],
					companiesInList: data["body"]["companiesInList"].length,
				});
				
				let obj1 = {
					value: {
						listName: data["body"]["listName"],
						id: data["body"]["_id"]
					}
				}
				this.newCreateListName = "";
				this.listboxReset = false;
				setTimeout(() => (this.listboxReset = true), 0);
				
				this.displayModal = false;
				this.selectedCompany = [];
			}
		});
	}

	onSelectedFile(event) {
		this.selectedCompany = [];
		this.companyPersonLinkedin = [];
		const file = event.files[0];

		if (!(CustomUtils.isNullOrUndefined(file))) {

			this.file = file;
			this.file_name = file.name;
			const fileReader = new FileReader();

			fileReader.onload = (e) => {
				// if (this.searchMethod == 'companyLinkedin') {
				// 	this.companyNameNumber = this.readCompanyNumbers(fileReader.result);
				// }
				// else {
				// 	this.companyNameNumber = this.readCompanyNames(fileReader.result);
				// }
				this.companyPersonLinkedin = this.readCompanyPersonLinkedin(fileReader.result);

				// if (this.companyNameNumber.length <= 1000) {
				// 	this.selectedCompany = this.companyNameNumber;
				// 	this.uploadButton();
				// 	this.uploadCsvBool = false;
				// } else {
				// 	this.selectedCompany = this.companyNameNumber.splice(0, 1000);
				// 	this.msgs = [];
				// 	this.msgs.push({ severity: 'warn', detail: 'Only 1000 companies can be uploaded at a time.' });
				// 	setTimeout(() => {
				// 		this.msgs = [];
				// 	}, 3000);
				// 	setTimeout(() => {
				// 		this.uploadButton();
				// 	}, 3000);
				// 	this.uploadCsvBool = false;
				// } this.searchMethod == 'companyLinkedin'

				if ( ( this.searchMethod == 'companyLinkedin' && (this.companyPersonLinkedin[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "companylinkedins" || this.companyPersonLinkedin[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "companylinkedin" )) || ( this.searchMethod != 'companyLinkedin' && (this.companyPersonLinkedin[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "personlinkedins" || this.companyPersonLinkedin[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "personlinkedin" )) ) {
					this.companyPersonLinkedin.splice(0, 1);

					if (this.companyPersonLinkedin.length <= 1000 || ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.companyPersonLinkedin.length <= 5000 )) {
						this.selectedCompany = this.companyPersonLinkedin;
						this.uploadButton();
						this.uploadCsvBool = false;
					} else {
						if( this.userAuthService.hasRolePermission( ['Super Admin'] )) {
							this.selectedCompany = this.companyPersonLinkedin.splice(0, 5000);
							this.msgs = [];
							this.msgs.push({ severity: 'warn', detail: 'Only 5000 linkedin can be uploaded at a time.' });
						} else {
							this.selectedCompany = this.companyPersonLinkedin.splice(0, 1000);
							this.msgs = [];
							this.msgs.push({ severity: 'warn', detail: 'Only 1000 linkedin can be uploaded at a time.' });
						}
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						setTimeout(() => {
							this.uploadButton();
						}, 3000);
						this.uploadCsvBool = false;
					}
				}  else {
					this.uploadCsvBool = false;
					this.msgs = [];
					this.msgs.push({ severity: 'error', detail: this.searchMethod == 'companyLinkedin' ? 'CSV Not Uploaded Please use only one column with "Company Linkedin" header' : 'CSV Not Uploaded Please use only one column with "Person Linkedin" header' });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				}
			}

			if (event.files.length > 0) {
				fileReader.readAsText(file);
			}
		}
	}

	readCompanyNumbers(result) {
		let temp_array = [];
		let index = 0;
		let str = '';

		while (index != result.length) {
			let ch = result.charAt(index);

			if (ch === ',' && str.length > 0) {
				temp_array.push(this.getCompanyNo(str));
				str = '';
			}
			else if (ch === '\n' && str.length >= 1) {
				temp_array.push(this.getCompanyNo(str));
				str = '';
			}
			if (ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch >= 'a' && ch <= 'z') {
				str += ch;
			}
			index++;
		}

		if (str.length >= 6)
			temp_array.push(this.getCompanyNo(str.toUpperCase()));
		return temp_array;

	}

	private getCompanyNo(CompanyNumber) {
		if (CompanyNumber !== undefined) {
			for (let i = CompanyNumber.length; i < 8; i++) {
				CompanyNumber = '0' + CompanyNumber;
			}
		}
		return CompanyNumber;
	}
   
	readCompanyPersonLinkedin(result) {
		result = result.split("\n")
		result = result.map(obj => obj.trim().replace(/,/g, ''));
		return result;
	}

	uploadButton() {
		let obj;
		
		if (this.file_name === "" || this.file_name === "File Name") {
			this.msgs = [];
			this.msgs.push({ severity: 'error', detail: 'Please Choose any file' });
			setTimeout(() => {
				this.msgs = [];
			}, 4000);
			this.file_name = "File Name";
			this.selectedCompany = [];
		}
		if (this.selectedCompany.length <= 0) {
			this.msgs = [];
			this.msgs.push({ severity: 'error', detail: 'CSV Not Uploaded, Please insert data in file and use only one column with Company Name or Number header' });
			setTimeout(() => {
				this.msgs = [];
			}, 7000);
			this.file_name = "File Name";
			this.selectedCompany = [];
		} else {
			let csvRecords_temp: any = [];
			csvRecords_temp = this.selectedCompany;
			this.selectedCompany = [];
			this.companyNumberArray = [];
			
			if ( csvRecords_temp.length ) {

				// if (this.searchMethod == "companyNumber") {
				// 	csvRecords_temp[i] = csvRecords_temp[i].padStart(8, "0").toString().toLowerCase();
				// 	this.companyNumberArray.push(csvRecords_temp[i]);
				// } else {
				// }
				this.companyNumberArray = csvRecords_temp;
			}

			if (this.searchMethod == 'personLinkedin') {
				obj = {
					
					linkedIn_url: this.companyNumberArray,
					inputType: "person_linkedIn",
					// includeDissolved: this.includeDissolvedCheckBool,
				}
			} else if (this.searchMethod == 'companyLinkedin') {
				obj = {
					linkedIn_url: this.companyNumberArray,
					inputType: "company_linkedIn",
					// searchType: this.searchType,
					// includeDissolved: this.includeDissolvedCheckBool,
				}
			}

			this.validateUploadedCsv(obj);
		}
	}

	private validateUploadedCsv(obj: any) {
		this.sharedLoaderService.showLoader();
		this.addAllListOfCompArr = [];
		this.exactMatchListOptions = []; 
		this.noMatchListOptions = [];
		
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_UPLOADCSVAPI', 'validateLinkedinUploadedCSV', obj ).subscribe( res =>  {

			let tempNoMatchDataOptions = [];

			if ( res.body?.status == 200 ) {
				if ( res.body.inputType == 'company_linkedIn' ) {
					for (let exactCompanyNameNumber of res.body['results']) {;
						this.addAllListOfCompArr.push(exactCompanyNameNumber?.profileId);
					}
				} else {
					for (let exactCompanyNameNumber of res.body['results']) {
						this.addAllListOfCompArr.push(exactCompanyNameNumber.profileId);
					}
				}
				// this.exactMatchListOptions = tempExactDataOptions;
				this.exactMatchListOptions = res.body['results'];
	
				for (let noMatchCompanyNameNumber of res.body?.['notMatched']) {
	
					tempNoMatchDataOptions.push(noMatchCompanyNameNumber);
	
				}

			}

			let uniqueArray = tempNoMatchDataOptions.filter(function (value, index) {
				return tempNoMatchDataOptions.indexOf(value) == index;
			});
			tempNoMatchDataOptions = uniqueArray;
			
			this.noMatchListOptions = tempNoMatchDataOptions;
			this.sharedLoaderService.hideLoader();
		});
	}

	keyupSearch( event: any ) {

		this.newCreateListName = event._filterValue;

		for ( let i = 0; i < this.listArray.length; i++ ) {

			let listName = this.listArray[i]["name"];

			if (listName.includes(this.newCreateListName)) {
				this.recordsAfterFilter = false;
				break;
			} else {
				this.recordsAfterFilter = true;
			}
			
		}
	}

	// hasWhiteSpace(s) {

	// 	if (s !== null) {
	// 		return s.indexOf(' ') >= 0;
	// 	}
		
	// }

	clearFilterField(event) {
		event._filterValue = "";
		this.file_name = '';
		this.recordsAfterFilter = true;
		this.displayModal = false;
	}

	userMailSender() {

		let obj = {
			emailId: this.userAuthService?.getUserInfo('email'),
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LOGIN', 'upgradePlanEmailNotification', obj ).subscribe( res =>  {
			
		}, err => {
			console.log("obj",obj);
		});
	}

	getMessage(event) {

		this.selectedCompany = [];

		if (event.status !== undefined && event.msgs !== undefined) {

			this.msgs = [];

			this.msgs.push({ severity: event.status, summary: event.msgs });

			setTimeout(() => {
				this.msgs = [];
			}, 4000);

		}

	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	copyText( inputElem: HTMLTextAreaElement ) {
		inputElem.select()
		document.execCommand('copy');
	}

	downloadSampleCsvFile() {

		const csvSampleFile = this.searchMethod == 'companyLinkedin' ? 'assets/utilities/data/DG_companyLinkedInSampleCSV.csv' : 'assets/utilities/data/DG_personLinkedInSampleCSV.csv';

		this.http.get( csvSampleFile, { responseType: 'blob' } ).subscribe( ( data ) => {

			const blob = new Blob( [data], { type: 'text/csv' } );
			const url = window.URL.createObjectURL(blob);
		
			// Create a temporary anchor element for downloading
			const a = document.createElement( 'a' );
			a.href = url;
			a.download = 'DG_Sample_Csv_File.csv';
			document.body.appendChild( a );
		
			// Trigger the click event to start the download
			a.click();
		
			// Cleanup
			window.URL.revokeObjectURL( url );
			document.body.removeChild( a );

		});

	}
	
}
