import { Component, OnInit } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { PreferencesOptionIndex } from './filter.preference.const';
import { AuthService } from '../services/auth/auth.service';
import { GlobalServerComminicationService } from '../services/global-server-comminication.service';

@Component({
	selector: 'app-filter-form',
	templateUrl: './filter-form.component.html',
	styleUrls: ['./filter-form.component.scss']
})

export class FilterFormComponent implements OnInit {

	REDIRECT_URI = `${ window.location.origin }/hubspot-ui/dg-authenticate`;
	preferencesOptionIndex = PreferencesOptionIndex;

	first: number = 0;
	rows: number = 25;
	totalRecordsCount: any = 0;
	totalRecords: any = 0;
	userLimit: number;
	event: any;
	radiusValue: number = 0;
	showDialog: boolean;
	showProgressSpinner: boolean = false; 
	isMultipleContact: boolean = false; 
	showDialogForListName: boolean = false;
	filterCompanyName!: string;
	searchName: string = 'Company';
	listNameForHubSpot: string;
	maxSelectableDate = new Date();

	incorporationDate = {
		startingDate: undefined,
		endingDate: undefined
	};

	lastFiledAccounts = {
		startingDate: undefined,
		endingDate: undefined
	};

	actualTurnover = {
		minimumTurnover: undefined,
		maximumTurnover: undefined
	};

	preferenceOperator: object = {
		'hasEmail': false,
		'isDirector': false,
		'hasPersonLinkedIn': false,
		'hasContactNumber': false,
		'hasCtpsNumber': false
	};

	payloadForApi = {
		aggregateBy: '',
		filterData: []
	};

	payloadForImport = {
		filterData: []
	};

	latLong: object = {};

	riskRatingOptions: Array<{ label: string, key: string, count: number }> = [];
	industryTagList: Array<{ label: string, key: string, count: number }> = [];
	categoryOptions: Array<{ label: string, key: string, count: number }> = [];
	postCodeOptions: Array<{ label: string, key: string, count: number }> = [];
	numberOfEmployeesOptions: Array<{ label: string, key: string, count: number }> = [];
	regionOptions: Array<{ label: string, key: string, count: number }> = [];
	positionOptions: Array<{ label: string, key: string, count: number }> = [];
	townCityOptions: Array<{ label: string, key: string, count: number }> = [];
	sicCodeOptions: Array<any> = [];

	riskRating: Array<any> = [];
	selectedSicCode: Array<any> = [];
	selectedIndustryTag: Array<any> = [];
	selectedCategory: Array<any> = [];
	selectedPostCode: Array<any> = [];
	selectedNumberOfEmployees: Array<any> = [];
	selectedRegion: Array<any> = [];
	selectedPositions: Array<any> = [];
	selectedTownCity: Array<any> = [];
	chipGrpArr: Array<any> = [];
	tempArr: Array<any> = [];
	sicSelectedArray: Array<any> = [];
	selectedPreference: Array<string> = [];
	hasPreferences: Array<object> = [];
	tableData: Array<any> = [];
	selectedCompany: Array<any> = [];
	msgs: Array<any> = [];
	cols: Array<{ field: string, header: string, minWidth: string, maxWidth: string, textAlign: string, tableValueType: string }> = [];

	constructor(
		private router: Router,
		public decimalPipe: DecimalPipe,
		private titlecase: TitleCasePipe,
		private globalServerComminication: GlobalServerComminicationService,
	) { }

	ngOnInit() {

		// this.preferenceOperator['hasEmail'] = true;

		this.globalServerComminication.getSicCode().subscribe(res => {
			this.sicCodeOptions = res.result;
		});

		this.globalServerComminication.getDataFromAggregateByParam({ aggregateBy: 'RegAddress_Modified.postalCode.keyword', filterData: [] }).subscribe(data => {
			if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
				for (let item of data.distinct_categories.buckets) {
					this.postCodeOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
				}
			}
		});

		this.globalServerComminication.getDataFromAggregateByParam({ aggregateBy: 'industryTagList.keyword', filterData: [] }).subscribe((data) => {
			if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
				for (let item of data.distinct_categories.buckets) {
					if (item.key != 'lending') {
						this.industryTagList.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
					}
				}
			}
		});

		this.globalServerComminication.getDataFromAggregateByParam({ aggregateBy: 'person_contact_details.personPosition.keyword', filterData: [] }).subscribe(data => {
			if (data.person_contact_details && data.person_contact_details.buckets && data.person_contact_details.buckets.length > 0) {
				for (let item of data.person_contact_details.buckets) {
					this.positionOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
				}
			}
		});
		
		this.globalServerComminication.getDataFromAggregateByParam({ aggregateBy: 'RegAddress_Modified.district.keyword', filterData: [] }).subscribe((data) => {
			if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
				for (let item of data.distinct_categories.buckets) {
					this.townCityOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
				}
			}
		});

		this.cols = [
			{ field: 'companyName', header: 'Company Name', minWidth: '240px', maxWidth: '240px', textAlign: 'left', tableValueType: '-' },
			{ field: 'riskBand', header: 'Risk Band', minWidth: '150px', maxWidth: '150px', textAlign: 'left', tableValueType: '-' },
			{ field: 'numberOfEmplyees', header: 'No. of Employees', minWidth: '130px', maxWidth: '130px', textAlign: 'right', tableValueType: 'number' },
			{ field: 'estimatedTurnover', header: 'Turnover', minWidth: '120px', maxWidth: '120px', textAlign: 'right', tableValueType: 'currency' },
			{ field: 'companyAge', header: 'Age', minWidth: '80px', maxWidth: '80px', textAlign: 'right', tableValueType: 'number' },
			{ field: 'postCode', header: 'Post Code', minWidth: '130px', maxWidth: '130px', textAlign: 'left', tableValueType: 'uppercase' },
			{ field: 'sicCodeDescription', header: 'SIC Code', minWidth: '280px', maxWidth: 'none', textAlign: 'left', tableValueType: 'titlecase' },
		];

		// this.changePreference(undefined, 'Preferences', 'hasEmail', 'Person must have email');

		for( let preferenceOption of this.preferencesOptionIndex ) {
			const { items } = preferenceOption;
			for( let item of items ) {
				if( item.chckbxNgModel == true) {
					this.changePreference( undefined, 'Preferences', item.preferenceOperator, item.chipValue, item.checkBoxName, item.chckbxNgModel );
				}
			}
		}
	}

	changePreference(event, from, preference, preferenceStr, checkBoxName, checkBoxNgModel) {
		
		if ( checkBoxName == 'employeeEmailYes' && checkBoxNgModel == true ) {
			this.preferencesOptionIndex[1].items[0].disable = true;
			this.preferencesOptionIndex[2].items[0].disable = true;
		} else if ( checkBoxName == 'employeeEmailYes' && checkBoxNgModel == false ) {
			this.preferencesOptionIndex[1].items[0].disable = false;
			this.preferencesOptionIndex[2].items[0].disable = false;
		}

		if ( checkBoxName == 'employeeLinkedInYes' && checkBoxNgModel == true ) {
			this.preferencesOptionIndex[1].items[1].disable = true;
			this.preferencesOptionIndex[2].items[1].disable = true;
		} else if ( checkBoxName == 'employeeLinkedInYes' && checkBoxNgModel == false ) {
			this.preferencesOptionIndex[1].items[1].disable = false;
			this.preferencesOptionIndex[2].items[1].disable = false;
		}

		if ( ( checkBoxName == 'pscEmailYes' || checkBoxName == 'directorEmailYes' ) && checkBoxNgModel == true ) {
			this.preferencesOptionIndex[0].items[0].disable = true;
		} else if (  ( checkBoxName == 'pscEmailYes' || checkBoxName == 'directorEmailYes') && checkBoxNgModel == false && this.preferencesOptionIndex[1].items[0].chckbxNgModel == false && this.preferencesOptionIndex[2].items[0].chckbxNgModel == false ) {
			this.preferencesOptionIndex[0].items[0].disable = false;
		}

		if ( ( checkBoxName == 'pscLinkedInYes' || checkBoxName == 'directorLinkedInYes') && checkBoxNgModel == true) {
			this.preferencesOptionIndex[0].items[1].disable = true;
		} else if ( ( checkBoxName == 'pscLinkedInYes' || checkBoxName == 'directorLinkedInYes') && checkBoxNgModel == false && this.preferencesOptionIndex[1].items[1].chckbxNgModel == false && this.preferencesOptionIndex[2].items[1].chckbxNgModel == false ) {
			this.preferencesOptionIndex[0].items[1].disable = false;
		}

		// if (this.preferenceOperator['hasContactNumber']) {

		// 	if (!this.selectedPreference.includes('Company must have phone number')) {
		// 		this.selectedPreference.push('Company must have phone number');
		// 		this.hasPreferences.push({ hasContactNumber: this.preferenceOperator['hasContactNumber'].toString() });
		// 	}

		// }

		if (!this.selectedPreference.includes(preferenceStr)) {
			this.selectedPreference.push(preferenceStr);
			this.hasPreferences.push(preference);
		}

		if (this.payloadForApi.filterData.length) {
			let count = 1;

			for (let index = 0; index < this.payloadForApi.filterData.length; index++) {

				if (this.payloadForApi.filterData[index].chip_group.includes(from)) {

					if (!this.payloadForApi.filterData[index].chip_values.includes(preferenceStr) && this.payloadForApi.filterData[index].preferenceOperator.includes(preference)) {
						this.payloadForApi.filterData[index].chip_values = this.selectedPreference;
						this.payloadForApi.filterData[index].preferenceOperator = this.hasPreferences;
					}

				} else {

					if (count == this.payloadForApi.filterData.length) {
						if (this.payloadForApi.filterData[index].chip_group !== from) {
							this.payloadForApi.filterData.push({ chip_group: from, chip_values: this.selectedPreference, preferenceOperator: this.hasPreferences });
						}
					}
					count++;

				}
			}

		} else {
			this.payloadForApi.filterData.push({ chip_group: from, chip_values: this.selectedPreference, preferenceOperator: this.hasPreferences });
		}

		if (event && !event.checked) {
			for (let item of this.payloadForApi.filterData) {
				if (item.chip_group.includes(from)) {
					if (item.chip_values.length > 1 && item.preferenceOperator.length > 1) {
						let preferenceIndex = item.chip_values.indexOf(preferenceStr);
						item.chip_values.splice(preferenceIndex, 1);

						// preferenceIndex = item.preferenceOperator.indexOf(preference);
						item.preferenceOperator.splice(preferenceIndex, 1);
					} else {
						this.payloadForApi.filterData = this.payloadForApi.filterData.filter((item) => item.chip_group != from);
						this.selectedPreference = [];
						this.hasPreferences = [];
					}
				}
			}
		}

		// this.selectedPreference = this.selectedPreference.filter((val) => val != preferenceStr);
		// this.hasPreferences = this.hasPreferences.filter((val) => val[preference]);

	}

	async getAggregatedData(event, from?, options?: string) {

		if( options == 'onFilter' && event?.filter.length <= 2 ) {
			return;
		}

		if( this.selectedPostCode.length == 1 ) {
			let postCodeObj = {
				postcode: this.selectedPostCode[0].key.toUpperCase()
			};

			const getlatLongValue = await lastValueFrom(this.globalServerComminication.getLatLong(postCodeObj));
			if( getlatLongValue.status == 200 ) {
				this.latLong = getlatLongValue['results'];
			}
		}

		let aggregationPayload = {};
		aggregationPayload = JSON.parse(JSON.stringify(this.payloadForApi));
		aggregationPayload['filterData'].push( { "chip_group": "Status", "chip_values": [ "live" ] } );

		aggregationPayload['filterData'].map( ( val ) =>{
			if( val.chip_group == 'Post Code' ) {
				if( this.selectedPostCode.length == 1 ) {
					val['userLocation'] = this.latLong;
				}
			}
			return val;
		});

		aggregationPayload['filterData'] = aggregationPayload['filterData'].filter( val => val.chip_group !== from );

		setTimeout(() => {

			if (from == 'Industry') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = 'industryTagList.keyword';
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe((data) => {
					this.industryTagList = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							if (item.key != 'lending') {
								this.industryTagList.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
							}
						}
					}
				});
			}

			else if (from == 'Bands') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = 'internationalScoreDescription.keyword';
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.riskRatingOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.riskRatingOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
						}
					}
				});
			}

			else if (from == 'Category') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = "companyType.keyword";
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.categoryOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.categoryOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
						}
					}
				});
			}

			else if (from == 'Number of Employees') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = "statutoryAccounts.numberOfEmployees";
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.numberOfEmployeesOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.numberOfEmployeesOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
						}
					}
				});
			}

			else if (from == 'Post Code') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = "RegAddress_Modified.postalCode.keyword";

				if ( options == 'onFilter') {
					aggregationPayload['filterSearchArray'] = [ { "value": event.filter, "field": "RegAddress_ModifiedPostalCode" } ];
					aggregationPayload['filterData'].push( { chip_group: 'keywordPostCode', chip_values: event.filter } );
					// aggregationPayload['filterData'].map( ( val ) =>{
					// 	if( val.chip_group == 'Post Code' ) {
					// 		val.chip_group = 'keywordPostCode';
					// 		val.chip_values = event.filter;
					// 	}
		            // });
				}

				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.postCodeOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.postCodeOptions.push({ label: item.key.toUpperCase(), key: item.key, count: item.doc_count });
						}
					}
				});
			}

			else if (from == 'Region') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = "RegAddress_Modified.region.keyword";
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.regionOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.regionOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
						}
					}
				});
			}

			else if (from == 'Person Positions') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = "person_contact_info_latest.personPosition.keyword";
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.positionOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.positionOptions.push({ label: item.key.replace(/(^|\s)\S/g, function (t: string) { return t.toUpperCase() }), key: item.key, count: item.doc_count });
						}
					}
				});
			}

			else if (from == 'Town / City') {
				this.chipGrpArr.push(from);
				aggregationPayload['aggregateBy'] = "RegAddress_Modified.district.keyword";
				this.globalServerComminication.getDataFromAggregateByParam(aggregationPayload).subscribe(data => {
					this.townCityOptions = [];
					if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
						for (let item of data.distinct_categories.buckets) {
							this.townCityOptions.push({ label: this.titlecase.transform(item.key.replace(/,/, ', ')), key: item.key, count: item.doc_count });
						}
					}
				});
			}
		}, 0);

	}

	changeRadius(event) {
		this.radiusValue = event.value;
		this.setPayloadData(this.event, 'Post Code');
	}

	setPayloadData(event, from?) {

		this.event = event;

		if (from == 'Industry') {
			this.tempArr = this.selectedIndustryTag.map(item => item.key);
		} else if (from == 'Bands') {
			this.tempArr = this.riskRating.map(item => item.key);
		} else if (from == 'Category') {
			this.tempArr = this.selectedCategory.map(item => item.key);
		} else if (from == 'Number of Employees') {
			this.tempArr = this.selectedNumberOfEmployees.map(item => {
				let structureArray = [];
				structureArray = item.key.split('-');
				return structureArray;
			});
		} else if (from == 'Post Code') {
			this.tempArr = this.selectedPostCode.map(item => {
				let tempStr = item.key.toUpperCase() + ' ' + `( ${ (this.radiusValue > 0 && this.selectedPostCode.length == 1) ? this.radiusValue : 0 } miles )`;
				return tempStr;
			});
			if( this.selectedPostCode.length == 1 && this.radiusValue > 0 ) {
				this.tempArr = [this.tempArr];
			}
		} else if (from == 'Region') {
			this.tempArr = this.selectedRegion.map(item => item.key);
		} else if (from == 'Person Positions') {
			this.tempArr = this.selectedPositions.map(item => item.key);
		} else if (from == 'Town / City') {
			this.tempArr = this.selectedTownCity.map(item => item.key);
		}

		if (this.chipGrpArr.includes(from)) {
			if (this.payloadForApi.filterData.length) {
				let count = 1;

				for (let index = 0; index < this.payloadForApi.filterData.length; index++) {

					if (this.payloadForApi.filterData[index].chip_group.includes(from)) {

						if (!this.payloadForApi.filterData[index].chip_values.includes(event.itemValue.key)) {
							if (this.payloadForApi.filterData[index].chip_group == 'Post Code') {
								this.payloadForApi.filterData[index].chip_values = this.tempArr;
							} else if (this.payloadForApi.filterData[index].chip_group == 'Number of Employees') {
								this.payloadForApi.filterData[index].chip_values = this.tempArr;
							} else {
								this.payloadForApi.filterData[index].chip_values.push(event.itemValue.key);
							}
						}

					} else {

						if (count == this.payloadForApi.filterData.length) {
							if (this.payloadForApi.filterData[index].chip_group !== from) {
								this.payloadForApi.filterData.push({ chip_group: from, chip_values: this.tempArr });
							}
						}
						count++;

					}
				}

			} else {
				this.payloadForApi.filterData.push({ chip_group: from, chip_values: this.tempArr });
			}

			this.payloadForApi.filterData.forEach((val, index) => {
				if (val.chip_group == from) {
					if (!this.tempArr.length) {
						this.payloadForApi.filterData = this.payloadForApi.filterData.filter(item => item.chip_group != from);
					} else {
						this.payloadForApi.filterData[index].chip_values = this.tempArr;
					}
				}
			});

		}

	}

	selectSicCode(event, from?) {

		if (from == 'SIC Codes') {
			// this.tempArr.push(event.node.label);
			// this.sicSelectedArray.push(event.node.data);
			this.tempArr = this.selectedSicCode.map(item => item.label);
			this.sicSelectedArray = this.selectedSicCode.map(item => item.data);
		}

		if (this.payloadForApi.filterData.length) {
			let count = 1;

			for (let index = 0; index < this.payloadForApi.filterData.length; index++) {

				if (this.payloadForApi.filterData[index].chip_group.includes(from)) {
					if (this.selectedSicCode.length) {
						if (!this.payloadForApi.filterData[index].chip_values.includes(this.selectedSicCode[this.selectedSicCode.length - 1].label) && !this.payloadForApi.filterData[index].chip_industry_sic_codes.includes(this.selectedSicCode[this.selectedSicCode.length - 1].data)) {
							this.payloadForApi.filterData[index].chip_industry_sic_codes.push(this.selectedSicCode[this.selectedSicCode.length - 1].data);
							this.payloadForApi.filterData[index].chip_values.push(this.selectedSicCode[this.selectedSicCode.length - 1].label);
						}
					}

				} else {

					if (count == this.payloadForApi.filterData.length) {
						if (this.payloadForApi.filterData[index].chip_group !== from) {
							this.payloadForApi.filterData.push({ chip_group: from, chip_industry_sic_codes: this.sicSelectedArray, chip_values: this.tempArr });
						}
					}
					count++;

				}
			}

		} else {
			this.payloadForApi.filterData.push({ chip_group: from, chip_industry_sic_codes: this.sicSelectedArray, chip_values: this.tempArr });
			// this.payloadForApi.filterData = this.payloadForApi.filterData.filter(val => val.chip_group != from);
		}

		this.payloadForApi.filterData.forEach((val, index) =>{
		  if(val.chip_group == from) {
		    if(!this.tempArr.length && !this.sicSelectedArray.length) {
		      this.payloadForApi.filterData = this.payloadForApi.filterData.filter(item => item.chip_group != from);
		    } else {
		      this.payloadForApi.filterData[index].chip_industry_sic_codes = this.sicSelectedArray;
		      this.payloadForApi.filterData[index].chip_values = this.tempArr;
		    }          
		  }
		});

	}

	getValue(event) {

		let searchString = '';
		this.payloadForApi.filterData = this.payloadForApi.filterData.filter((item) => {
			if (!['Company Name/Number'].includes(item.chip_group)) {
				return item;
			}
		});

		let andSearch = document.getElementById('and');
		let orSearch = document.getElementById('or');

		if( event.target.textContent === 'Contains all of keyword' ) {
			searchString = 'and';
			orSearch.classList.remove('c-teal');
			orSearch.classList.add('c-grey');

			if( andSearch.classList.contains('c-grey') ) {
				andSearch.classList.remove('c-grey');
				andSearch.classList.add('c-teal');
			} else {
				andSearch.classList.remove('c-teal');
				andSearch.classList.add('c-grey');
			}

		} else if( event.target.textContent === 'Contains any one of keyword' ) {
			searchString = 'or';
			andSearch.classList.remove('c-teal');
			andSearch.classList.add('c-grey');

			if( orSearch.classList.contains('c-grey') ) {
				orSearch.classList.remove('c-grey');
				orSearch.classList.add('c-teal');
			} else {
				orSearch.classList.remove('c-teal');
				orSearch.classList.add('c-grey');
			}
		}

		if (this.filterCompanyName) {
			let strctArray = [];
			strctArray.push(this.filterCompanyName);
			this.payloadForApi.filterData.push({ chip_group: 'Company Name/Number', chip_values: strctArray, companySearchAndOr: searchString });
			strctArray = [];
			// this.filterCompanyName = '';
		}
		searchString = '';
	}

	handleBlur(event) {

		this.payloadForApi.filterData = this.payloadForApi.filterData.filter((item) => {
			if (!['Company Name/Number', 'Incorporation Date', 'Last Filing Date', 'Key Financials'].includes(item.chip_group)) {
				return item;
			}
		});

		const { startingDate, endingDate } = this.incorporationDate;
		
		if (startingDate && endingDate) {
			let dateArray = [];
			dateArray.push(startingDate.toLocaleDateString('en-GB'), endingDate.toLocaleDateString('en-GB'), `From ${startingDate.toLocaleDateString('en-GB').replaceAll('/', '-')} to ${endingDate.toLocaleDateString('en-GB').replaceAll('/', '-')}`);
			this.payloadForApi.filterData.push({ chip_group: 'Incorporation Date', chip_values: [dateArray] });
			dateArray = [];
		}

		if (this.lastFiledAccounts['startingDate'] && this.lastFiledAccounts['endingDate']) {
			let dateArray = [];
			dateArray.push(this.lastFiledAccounts['startingDate'].toLocaleDateString('en-GB'), this.lastFiledAccounts['endingDate'].toLocaleDateString('en-GB'), `From ${this.lastFiledAccounts['startingDate'].toLocaleDateString('en-GB').replaceAll('/', '-')} to ${this.lastFiledAccounts['endingDate'].toLocaleDateString('en-GB').replaceAll('/', '-')}`);
			this.payloadForApi.filterData.push({ chip_group: 'Last Filing Date', chip_values: [dateArray] });
			dateArray = [];
		}

		// if (this.filterCompanyName) {
		// 	let strctArray = [];
		// 	strctArray.push(this.filterCompanyName);
		// 	this.payloadForApi.filterData.push({ chip_group: 'Company Name/Number', chip_values: strctArray, companySearchAndOr: searchString });
		// 	strctArray = [];
		//  this.filterCompanyName = '';
		// }

		const { minimumTurnover, maximumTurnover } = this.actualTurnover;

		if ((minimumTurnover && maximumTurnover) || (maximumTurnover && !minimumTurnover) || (minimumTurnover && !maximumTurnover)) {
			let turnoverObj = {
				key: 'turnover',
				greater_than: +minimumTurnover,
				less_than: +maximumTurnover,
				financialBoolean: false,
				validate: false
			}
			 
			this.payloadForApi.filterData.push({ chip_group: 'Key Financials', chip_values: [ turnoverObj, { ...turnoverObj, key: 'estimated_turnover' } ] });
			turnoverObj = undefined;
		}
	}

	async searchData() {

		if( this.selectedPostCode.length == 1 ) {
			let postCodeObj = {
				postcode: this.selectedPostCode[0].key.toUpperCase()
			};

			const getlatLongValue = await lastValueFrom(this.globalServerComminication.getLatLong(postCodeObj));
			if( getlatLongValue.status == 200 ) {
				this.latLong = getlatLongValue['results'];
			}

			this.payloadForApi.filterData.map( ( val ) =>{
				if( val.chip_group == 'Post Code' ) {
					if( this.selectedPostCode.length == 1 ) {
						val['userLocation'] = this.latLong;
					}
				}
				return val;
			});
		}

		let obj = {
			pageSize: this.rows ? this.rows : 25,
			startAfter: this.first ? this.first : 0
		};

		obj['filterData'] = this.payloadForApi.filterData;

		this.payloadForImport['filterData'] = JSON.parse(JSON.stringify(this.payloadForApi['filterData']));

		this.globalServerComminication.getSearchData(obj).subscribe(res => {
			if (res.status == 200) {
				this.tableData = res.results.map( ( value ) =>{
					if( value['sicCode'] || value['sicCodeDescription'] ) {
						value['sicCodeDescription'] = `${value['sicCode']} - ${value['sicCodeDescription']}`;
					}
					return value;
				});

				this.totalRecordsCount = res.totalResults;
				this.totalRecords = +(this.totalRecordsCount);
				this.totalRecordsCount = this.decimalPipe.transform( res.totalResults, '1.0-0');
				this.totalRecords = this.totalRecords < 10000 ? this.totalRecords : 10000;
			} else if(res.response_code == 498) {
				localStorage.clear();
				this.router.navigate(['hubspot-ui/dg-authenticate']);
			}
		});

		this.showDialog = true;
	}

	async checkCrmLimit() {

		// let userData = { userId: localStorage.getItem('userId') };
		let exportData = await lastValueFrom( this.globalServerComminication.getUserExportLimit() );

		if ( exportData.status == 200 ) {
			this.userLimit = exportData.results[0].crmLimit;
		}

		if ( this.userLimit > 0 ) {
			if ( this.selectedCompany.length <= this.userLimit ) {
				this.importData();
			} else {
				this.msgs = [];
				this.msgs.push( { severity: 'info', summary: "You don't have enough CRM limit to push companies to HubSpot. To upgrade limit please contact your administrator!" } );
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		} else {
			this.msgs = [];
			this.msgs.push( { severity: 'info', summary: 'Your CRM limit is zero. To upgrade limit please contact your administrator!' } );
			this.showDialog = false;
			setTimeout(() => {
				this.msgs  = [];
			}, 3000);
		}
	}

	importData() {

		// let companiesToAdd = [];
		// companiesToAdd = this.selectedCompany.map((company) => company['companyRegistrationNumber']);
		this.showDialogForListName = true;

		// let obj = {
		// 	pageSize: this.rows ? this.rows : 25,
		// 	startAfter: this.first ? this.first : 0,
		//     redirect_uri: this.REDIRECT_URI,
		// 	sourceType: this.listNameForHubSpot
		// };

		// obj['filterData'] = this.payloadForImport['filterData'];

		// if( this.isMultipleContact ) {
		// 	obj['isMultiContactImport'] = this.isMultipleContact;
		// }

		// if(companiesToAdd.length) {
		// 	obj['companiesInList'] = companiesToAdd,
		// 	obj['pageName'] =  'companyListPage'
		// }
		
		// if ( this.listNameForHubSpot ) {
		// 	this.showProgressSpinner = true;
		// 	this.globalServerComminication.setImportData(obj).subscribe((res) =>{
		// 		if(res.status == 200) {
		// 			this.msgs = [];
		// 			this.msgs.push({ 
		// 				severity: 'success', summary: res.message,
		// 			});
		// 			setTimeout(() => {
		// 				this.msgs = [];
		// 			}, 3000);
		// 			this.showDialog = false;
		// 			this.showProgressSpinner = false;
		// 		} else if(res.response_code == 498) {
		// 			localStorage.clear();
		// 			this.router.navigate(['dg-authenticate']);
		// 		} else {
		// 			this.msgs = [];
		// 			this.msgs.push({ 
		// 				severity: 'success', summary: res.message,
		// 			});
		// 			setTimeout(() => {
		// 				this.msgs = [];
		// 			}, 3000);
		// 			this.showDialog = false;
		// 			this.showProgressSpinner = false;
		// 		}
		// 		// else if(res.status == 400) {
		// 		// 	this.authService.checkAuth(localStorage.getItem('auth_code')).subscribe((res) =>{
		// 		// 		if(res.status == 200) {
		// 		// 			localStorage.removeItem('access_token');
		// 		// 			localStorage.setItem('access_token', res.results['access_token']);
		// 		// 			this.globalServerComminication.setImportData(obj).subscribe(res =>{
		// 		// 				if(res.status == 200) {
		// 		// 					this.msgs = [];
		// 		// 					this.msgs.push({ 
		// 		// 						severity: 'success', summary: res.message,
		// 		// 					});
		// 		// 					setTimeout(() => {
		// 		// 						this.msgs = [];
		// 		// 					}, 3000);
		// 		// 					this.showDialog = false;
		// 		// 					this.showProgressSpinner = false;
		// 		// 				}
		// 		// 			});
		// 		// 		}
		// 		// 	});
		// 		// }
		// 		this.clearData();
		// 	});
		// }


		// this.authService.checkAuth().subscribe(response => {
		// 	// const { success } = response;
		// 	if ( response.results.isAuthenticatedWithHubspot == true ) {			  
		// 	  this.globalServerComminication.setImportData(obj).subscribe(res => {
		// 		  if(res) {
		// 			  if(res.status == 200) {
		// 				  this.msgs = [];
		// 				  this.msgs.push({ 
		// 					  severity: 'success', summary: res.message,
		// 				  });
		// 				  setTimeout(() => {
		// 					  this.msgs = [];
		// 				  }, 3000);
		// 				  this.showDialog = false;
		// 				  this.showProgressSpinner = false;
		// 			  } else if(res.response_code == 498) {
		// 				localStorage.clear();
		// 				this.router.navigate(['dg-authenticate']);
		// 			  } else if(res.status == 400) {
		// 				this.msgs = [];
		// 				this.msgs.push({ 
		// 					severity: 'error', summary: 'Token has expired!',
		// 				});
		// 				setTimeout(() => {
		// 					this.msgs = [];
		// 					this.router.navigate(['dg-authenticate']);
		// 				}, 3000);
		// 				this.showDialog = false;
		// 				this.showProgressSpinner = false;
		// 			} else {
		// 				this.msgs = [];
		// 				this.msgs.push({ 
		// 					severity: 'error', summary: res.message,
		// 				});
		// 				setTimeout(() => {
		// 					this.msgs = [];
		// 				}, 3000);
		// 				this.showDialog = false;
		// 				this.showProgressSpinner = false;
		// 			}
		// 		  }
		// 	  });
	  
		// 	  this.clearData();
		// 	} else {
		// 		this.router.navigate( ['dg-authenticate'] );
		// 		// this.clearData();
		// 	    //   this.authService.regenerateToken(localStorage.getItem('refresh_token')).subscribe(response => {
		// 		// this.authService.storeHsTokens(response.result);

		// 		// this.globalServerComminication.setImportData(obj).subscribe(res => {
		// 		// 	if(res) {
		// 		// 		if(res.status == 200) {
		// 		// 			this.msgs = [];
		// 		// 			this.msgs.push({ 
		// 		// 				severity: 'success', summary: res.message,
		// 		// 			});
		// 		// 			setTimeout(() => {
		// 		// 				this.msgs = [];
		// 		// 			}, 3000);
		// 		// 			this.showDialog = false;
		// 		// 			this.showProgressSpinner = false;
		// 		// 		} else if( res.response_code == 498 ) {
		// 		// 			localStorage.clear();
		// 		// 			this.router.navigate(['dg-authenticate']);
		// 		// 		} else {
		// 		// 			this.msgs = [];
		// 		// 			this.msgs.push({ 
		// 		// 				severity: 'error', summary: res.message,
		// 		// 			});
		// 		// 			setTimeout(() => {
		// 		// 				this.msgs = [];
		// 		// 			}, 3000);
		// 		// 			this.showDialog = false;
		// 		// 			this.showProgressSpinner = false;
		// 		// 		}
		// 		// 	}
		// 		// });
		// 	//   })
		// 	}
		// });

		// setTimeout(() => {
		// 	this.showDialog = false;
		// 	this.showProgressSpinner = false;
		// }, 1500);
		  
		
		// this.selectedCompany = [];
		// this.preferenceOperator['hasEmail'] = true;
	}

	pushCompaniesToHubSpot() {

		let companiesToAdd = [];
		companiesToAdd = this.selectedCompany.map((company) => company['companyRegistrationNumber']);
		this.showProgressSpinner = true;

		let obj = {
			pageSize: this.rows ? this.rows : 25,
			startAfter: this.first ? this.first : 0,
		    redirect_uri: this.REDIRECT_URI,
			sourceType: this.listNameForHubSpot,
			isHubSpot: false
		};

		obj['filterData'] = this.payloadForImport['filterData'];

		if( this.isMultipleContact ) {
			obj['isMultiContactImport'] = this.isMultipleContact;
		}

		if(companiesToAdd.length) {
			obj['companiesInList'] = companiesToAdd,
			obj['pageName'] =  'companyListPage'
		}
		
		// this.showProgressSpinner = true;
		this.globalServerComminication.setImportData(obj).subscribe((res) =>{
			if(res.status == 200) {
				this.msgs = [];
				this.showDialogForListName = false;
				this.listNameForHubSpot = '';
				this.msgs.push({ 
					severity: 'success', summary: res.message,
				});
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
				this.showDialog = false;
				this.showProgressSpinner = false;
			} else if(res.response_code == 498) {
				localStorage.clear();
				this.router.navigate(['hubspot-ui/dg-authenticate']);
			} else {
				this.msgs = [];
				this.msgs.push({ 
					severity: 'success', summary: res.message,
				});
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
				this.showDialog = false;
				this.showProgressSpinner = false;
				this.listNameForHubSpot = '';
				this.showDialogForListName = false;
			}
			
			this.clearData();
		});
		  
		this.selectedCompany = [];
		this.preferenceOperator['hasEmail'] = true;
	}

	clearData() {
		this.filterCompanyName = '';
		this.radiusValue = 0;
		this.incorporationDate['startingDate'] = undefined;
		this.incorporationDate['endingDate'] = undefined;
		this.lastFiledAccounts['startingDate'] = undefined;
		this.lastFiledAccounts['endingDate'] = undefined;
		this.actualTurnover['minimumTurnover'] = undefined;
		this.actualTurnover['maximumTurnover'] = undefined;
		this.riskRating = [];
		this.selectedSicCode = [];
		this.selectedIndustryTag = [];
		this.selectedCategory = [];
		this.selectedPostCode = [];
		this.selectedNumberOfEmployees = [];
		this.selectedRegion = [];
		this.selectedPositions = [];
		this.selectedTownCity = [];
		this.preferenceOperator = {
			'hasEmail': false,
			'isDirector': false,
			'hasPersonLinkedIn': false,
			'hasContactNumber': false
		};
		this.payloadForApi = {
			aggregateBy: '',
			filterData: []
		};
		this.payloadForImport = {
			filterData: []
		}

		for( let preferenceOption of this.preferencesOptionIndex ) {
			const { items } = preferenceOption;

			if( preferenceOption.header == 'Employee Contact' ) {
				this.selectedPreference = [];
				this.hasPreferences = [];
				for(let item of items) {
					if( ( item.checkBoxName == 'employeeEmailYes' || item.checkBoxName == 'employeeLinkedInYes' ) ) {
						item.chckbxNgModel = true;
						item.disable = false;
						this.changePreference( undefined, 'Preferences', item.preferenceOperator, item.chipValue, item.checkBoxName, item.chckbxNgModel );
					}
				}
			} else {
				for( let item of items ) { 
					item.chckbxNgModel = false;
				}
			}
		}

	}

	pageChange(event) {
		this.first = event.first;
		this.rows = event.rows;
		// this.selectedCompany = [];
		this.searchData();
	}

	hideDialog(){
		this.first = 0;
		this.rows = 25;
		this.tableData = [];
		this.selectedCompany = [];
		this.totalRecordsCount = 0;
		this.isMultipleContact = false;
	}

	formatCompanyNameForUrl(companyName) {
		return this.globalServerComminication.formatCompanyNameForUrl(companyName);
	}

	resetOptions(inputOptionsArray) {
		// inputOptionsArray = [];
	}
}