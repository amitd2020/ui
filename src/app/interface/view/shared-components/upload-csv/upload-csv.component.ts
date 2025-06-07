import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload'
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'dg-upload-csv',
	templateUrl: './upload-csv.component.html',
	styleUrls: ['./upload-csv.component.scss'],
})
export class UploadCsvComponent implements OnInit {


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
	searchMethod: string = 'companyNumber';
	companyNameNumberList: any = [];
	addAllListOfCompArr: any = [];
	tempAddAllSimilarCmpArray: any = [];
	exactMatchListOptions: any = [];
	noMatchListOptions: any = [];
	companyNameNumber: any = [];
	onClickButtonValue: string = 'exactButton';
	searchType: string = 'similarMatch';
	selectedListItem: Array<any>;
	noMatchCompaniesCount: number;
	similarExactMatchCompaniesCount: number;
	multiMatchListOptions: any = [];
	addAllListForMultiMatch: any = [];
	multiMatchCompaniesCount: number;
	totalSearchedRecords: number = 0;

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
		this.companyNameNumberList = [];
		this.exactMatchListOptions = [];
		this.multiMatchListOptions = [];
		this.noMatchListOptions = [];
		this.file_name = '';
		this.showUploadLimitBoolean = false;
		this.includeDissolvedCheckBool = false;
		this.searchType = 'similarMatch';
		this.totalSearchedRecords = 0
	}

	clearInputText(){
		this.companyNameNumberList = [];
		this.showUploadLimitBoolean = false;
		this.searchType = 'similarMatch';
		this.includeDissolvedCheckBool = false;
		this.totalSearchedRecords = 0;
		this.clearListBox();
	}

	clearListBox() {
		this.file_name = '';
		this.exactMatchListOptions = [];
		this.multiMatchListOptions = [];
		this.noMatchListOptions = [];
	}

	searchInputText() {
		this.sharedLoaderService.showLoader();
		let obj;

		if ( this.companyNameNumberList.split(/[\n]+/).filter(e => e != "").length <= 1000 || ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.companyNameNumberList.split(/[\n]+/).filter(e => e != "").length <= 5000 ) ) {
			this.showUploadLimitBoolean = false;
			if (this.searchMethod == 'companyNumber') {
				obj = {
					selectedCompany: this.companyNameNumberList.split(/[\n,]+/).filter(e => e != ""),
					inputType: "companyNumber",
					includeDissolved: this.includeDissolvedCheckBool,
				}
				obj['selectedCompany'] = obj['selectedCompany'].map( obj => obj.toLowerCase().trim());
			} else if (this.searchMethod == 'companyName') {
				obj = {
					selectedCompany: this.companyNameNumberList.split(/[\n]+/).filter(e => e != ""),
					inputType: "companyName",
					searchType: this.searchType,
					includeDissolved: this.includeDissolvedCheckBool,
				}
				obj['selectedCompany'] = obj['selectedCompany'].map( obj => obj.toLowerCase().trim() )
			}
			this.validateUploadedCsv(obj);
		} else {
			this.showUploadLimitBoolean = true;
			this.sharedLoaderService.hideLoader();
		}
	}

	textRepresentationForNameNumber( event ) {
		setTimeout(() => {
			const { target: { value } } = event;
			this.totalSearchedRecords = value.split(/[\n]+/).filter(e => e != "").length;
		}, 0);
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
		this.companyNameNumber = [];
		const file = event.files[0];

		if (!(CustomUtils.isNullOrUndefined(file))) {

			this.file = file;
			this.file_name = file.name;
			const fileReader = new FileReader();

			fileReader.onload = (e) => {
				if (this.searchMethod == 'companyNumber') {
					this.companyNameNumber = this.readCompanyNumbers(fileReader.result);
				}
				else {
					this.companyNameNumber = this.readCompanyNames(fileReader.result);
				}

				if (this.companyNameNumber[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "companynumbers" ||
					this.companyNameNumber[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "companynumber") {
					this.companyNameNumber.splice(0, 1);

					if (( this.companyNameNumber.length <= 1000 ) || ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.companyNameNumber.length <= 5000 )) {
						this.selectedCompany = this.companyNameNumber;
						this.uploadButton();
						this.uploadCsvBool = false;
					} else {
						if( this.userAuthService.hasRolePermission( ['Super Admin'] )) {
							this.selectedCompany = this.companyNameNumber.splice(0, 5000);
							this.msgs = [];
							this.msgs.push({ severity: 'warn', detail: 'Only 5000 companies can be uploaded at a time.' });
						} else {
							this.selectedCompany = this.companyNameNumber.splice(0, 1000);
							this.msgs = [];
							this.msgs.push({ severity: 'warn', detail: 'Only 1000 companies can be uploaded at a time.' });
						}
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						setTimeout(() => {
							this.uploadButton();
						}, 3000);
						this.uploadCsvBool = false;
					}
				} else if (this.companyNameNumber[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "companynames" ||
					this.companyNameNumber[0].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase() === "companyname") {
					this.companyNameNumber.splice(0, 1);
					if (this.companyNameNumber.length <= 1000 || ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.companyNameNumber.length <= 5000 )) {
						this.selectedCompany = this.companyNameNumber;
						this.uploadButton();
						this.uploadCsvBool = false;

					} else {
						if( this.userAuthService.hasRolePermission( ['Super Admin'] )) {
							this.selectedCompany = this.companyNameNumber.splice(0, 5000);
							this.msgs = [];
							this.msgs.push({ severity: 'warn', detail: 'Only 5000 companies can be uploaded at a time.' });
						} else {
							this.selectedCompany = this.companyNameNumber.splice(0, 1000);
							this.msgs = [];
							this.msgs.push({ severity: 'warn', detail: 'Only 1000 companies can be uploaded at a time.' });
						}
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						setTimeout(() => {
							this.uploadButton();
						}, 3000);
						this.uploadCsvBool = false;
					}

				} else {
					this.uploadCsvBool = false;
					this.msgs = [];
					this.msgs.push({ severity: 'error', detail: 'CSV Not Uploaded Please use only one column with "Company Name or Numbers" header' });
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
   
	readCompanyNames(result) {
		result = result.split("\n")
		result = result.map(obj => obj.trim());
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
			
			for (let i = 0; i < csvRecords_temp.length; i++) {

				if (this.searchMethod == "companyNumber") {
					csvRecords_temp[i] = csvRecords_temp[i].padStart(8, "0").toString().toLowerCase();
					this.companyNumberArray.push(csvRecords_temp[i]);
				} else {
					this.companyNumberArray.push(csvRecords_temp[i].toString().toLowerCase());
				}
			}

			if (this.searchMethod == 'companyNumber') {
				obj = {
					selectedCompany: this.companyNumberArray,
					inputType: "companyNumber",
					includeDissolved: this.includeDissolvedCheckBool,
				}
			} else if (this.searchMethod == 'companyName') {
				obj = {
					selectedCompany: this.companyNumberArray,
					inputType: "companyName",
					searchType: this.searchType,
					includeDissolved: this.includeDissolvedCheckBool,
				}
			}
			
			this.validateUploadedCsv(obj);
		}
	}

	private validateUploadedCsv(obj: any) {
		this.sharedLoaderService.showLoader();
		this.addAllListOfCompArr = [];
		this.addAllListForMultiMatch = [];
		this.exactMatchListOptions = []; 
		this.multiMatchListOptions = [];
		this.noMatchListOptions = [];
		
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_UPLOADCSVAPI', 'validateUploadedCSV_V2', obj ).subscribe( res =>  {

			let tempExactDataOptions = [], tempNoMatchDataOptions = [];
			this.noMatchCompaniesCount = res.body['results'].noMatchCompaniesCount;
			this.multiMatchCompaniesCount = res['body']['results'].multiMatchCompaniesCount;
	        this.similarExactMatchCompaniesCount = res.body['results'].exactMatchCompaniesCount || res.body['results'].similarMatchCompaniesCount;

			if ( ( this.searchMethod == 'companyNumber' ) || ( this.searchMethod == 'companyName' && this.searchType == 'exactMatch' ) ) {
				for (let exactCompanyNameNumber of res.body['results']['exactMatchCompanies']) {
				   this.addAllListOfCompArr.push(exactCompanyNameNumber.companyRegistrationNumber);
				}

				for (let exactCompanyNameNumber of res.body['results']['multiMatchCompanies']) {
					this.addAllListForMultiMatch.push(exactCompanyNameNumber.companyRegistrationNumber);
				}

				this.exactMatchListOptions = res.body['results']['exactMatchCompanies'];
				this.multiMatchListOptions = res.body['results']['multiMatchCompanies'];
				this.selectedListItem = JSON.parse( JSON.stringify( this.addAllListForMultiMatch ) );

			} else if ( ( this.searchMethod == 'companyName' && this.searchType == 'similarMatch' ) ) {
				for (let exactCompanyNameNumber of res.body['results']['similarMatchCompanies']) {
					this.addAllListOfCompArr.push(exactCompanyNameNumber.companyRegistrationNumber);
				}

				for (let exactCompanyNameNumber of res.body['results']['multiMatchCompanies']) {
					this.addAllListForMultiMatch.push(exactCompanyNameNumber.companyRegistrationNumber);
				}
				
				this.exactMatchListOptions = res.body['results']['similarMatchCompanies'];
				this.multiMatchListOptions = res.body['results']['multiMatchCompanies'];
				this.selectedListItem = JSON.parse( JSON.stringify( this.addAllListForMultiMatch ) );
			}

			for (let noMatchCompanyNameNumber of res.body['results']['noMatchCompanies']) {
				tempNoMatchDataOptions.push(this.titlecasepipe.transform(noMatchCompanyNameNumber));
			}

			let uniqueArray = tempNoMatchDataOptions.filter(function (value, index) {
				return tempNoMatchDataOptions.indexOf(value) == index;
			});
			tempNoMatchDataOptions = uniqueArray;
			
			this.noMatchListOptions = tempNoMatchDataOptions;
			this.sharedLoaderService.hideLoader();
		});
	}

	// showSimilarExactCompanies( similarExactMatchArr ) { 

	// 	this.exactMatchListOptions = [];
		
	// 	for( let exactCompanyNameNumber of similarExactMatchArr ) {
	// 		this.addAllListOfCompArr.push(exactCompanyNameNumber.companyRegistrationNumber);
	// 	}

	// 	this.selectedListItem = JSON.parse( JSON.stringify( this.addAllListOfCompArr ) );
	// 	this.exactMatchListOptions = similarExactMatchArr;

	// }

	selectCompanyForList(event) {

		if ( event.value.length ) {
			this.addAllListForMultiMatch = [];
			this.addAllListForMultiMatch = event.value.map( item => item?.companyRegistrationNumber ); 
		} else {
			this.addAllListForMultiMatch = this.selectedListItem;
		}
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

		const csvSampleFile = this.searchMethod == 'companyNumber' ? 'assets/utilities/data/DG_CompanyNumberSample.csv' : 'assets/utilities/data/DG_CompanyNameSampleCSV.csv';

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
