import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { subscribedPlan } from 'src/environments/environment';
import { take } from 'rxjs';
import { SearchCompanyService } from '../../features-modules/search-company/search-company.service';

@Component({
	selector: 'dg-shared-search-bar',
	templateUrl: './shared-search-bar.component.html',
	styleUrls: ['./shared-search-bar.component.scss']
})
export class SharedSearchBarComponent implements OnInit {
	
	@Input() thisPage: string;

	dataArr = [];
	msgs = [];
	industryArry: Array<any> = [];
	dashSearchData: Array<any> = [];
	dashRecentData: Array<any> = [];
	notesTableData: Array<any> = [];
	filteredCompanyNameArray: any[];
	filteredIndustryNameArray: any[];
	dashUserlistData: Array<any> = [];
	dashWatchlistData: Array<any> = [];
	popularSearchesData: Array<any> = [];
	searchForOptions: { label: string, value: string }[] = [
		{ label: 'Company', value: 'company' },
		{ label: 'Director', value: 'director' },
		{ label: 'Industry', value: 'industry' }
	];

	irelandSearchForOptions :{ label: string, value: string }[] = [
		{ label: 'Company', value: 'company' },
		{ label: 'Director', value: 'director' }
	];
	subscribedPlanModal: any = subscribedPlan;
	selectedGlobalCountry: string = 'uk';

	results: any;
	titleDeedData: any;
	timeout: any = null;
	industryNameSearchkey: string = '';
	directorNameSearchKey:  string = '';
	companyNameNumberSearchKey: string = '';
	delayedCheckForLoggedin: boolean = false;
	isLoggedIn: boolean = false;

	fieldSearchFor: string = 'company';

	constructor(
		private userAuthService: UserAuthService,
		private router: Router,
		public commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private globalServerCommunicate: ServerCommunicationService, 
		public searchCompanyService: SearchCompanyService
	) { }

	ngOnInit() {
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		if( this.isLoggedIn ){
			this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		}

		if ( window.innerWidth < 1025 || ( !this.userAuthService.hasFeaturePermission( 'Global Filter' ) && !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

			this.searchForOptions = [
				{ label: 'Company', value: 'company' },
				{ label: 'Director', value: 'director' }
			];

		}
	}

	searchOnEnter(event, type) {
		
		let stringg = event.target.value;
		let stringcompany: Array<String> = [];
		let stringIndustry: Array<String> = [];
		let finalString = "";

		if (type == 'company') {
			for (let i = 0; i < stringg.length; i++) {
				stringcompany[i] = stringg.charAt(i);
			}

			finalString = stringcompany.join("");

			if (event.target.value !== "") {
				this.companyNameNumberSearchKey = finalString;
			}
		}

		if (type == 'Industry') {
			for (let i = 0; i < stringg.length; i++) {
				stringIndustry[i] = stringg.charAt(i);
			}

			finalString = stringIndustry.join("");

			if (event.target.value !== "") {
				this.industryNameSearchkey = finalString;
			}
		}

		if (event.keyCode == 13) {
			if (type == 'company') {
				this.companyNameNumberSearchKey = finalString;
				this.searchCompanyService.showStatsButton = true;
				this.router.navigate(['/company-search'], { queryParams: { company: this.companyNameNumberSearchKey } });
			} else if (type == 'director') {
				this.router.navigate(['/company-search'], { queryParams: { directorName: this.directorNameSearchKey } });
			} else if (type == 'Industry') {
				this.industryNameSearchkey = finalString;
				if (this.industryArry.length > 0) {
					this.router.navigate(['/company-search'], { queryParams: { industryName: this.industryArry } });
				} else {
					this.router.navigate(['/company-search'], { queryParams: { industryName: this.industryNameSearchkey } });
				}
			}
		}
	}

	filteredCompanyName(event) {
		clearTimeout(this.timeout);
		let $this = this;

		this.timeout = setTimeout(function () {
			if (event.keyCode != 13) {
				if (event.query.length > 2) {
					let obj = {
						companyName: event.query.toString().toLowerCase(),
						// companyStatus: "live"
					};

					if( $this.isLoggedIn ) {
						$this.globalServerCommunicate.globalServerRequestCall('post', 'DG_API', 'companyNameSuggestionsNew', obj).subscribe(res => {
							let data = res.body;
	
							if (data && data.status == 200) {
	
								if (data['results']) {
	
									let suggestedCompaniesData = data['results']['hits'];
	
									if (suggestedCompaniesData['total']['value'] == 0) {
	
										$this.filteredCompanyNameArray = [];
	
									} else if (suggestedCompaniesData['total']['value'] > 0) {
	
										$this.filteredCompanyNameArray = [];
	
										for (let val of suggestedCompaniesData['hits']) {
	
											let companyAddress;
	
											if (val['_source']['contactDetails'] || val['_source']['RegAddress_Modified']) {
	
												if (val['_source']['contactDetails'] && val['_source']['RegAddress_Modified']) {
													companyAddress = $this.commonService.formatCompanyAddress(val['_source']['contactDetails']);
												} else if ((!val['_source']['contactDetails']) && val['_source']['RegAddress_Modified']) {
													companyAddress = $this.commonService.formatCompanyAddress(val['_source']['RegAddress_Modified']);
												} else if (val['_source']['contactDetails'] && (!val['_source']['RegAddress_Modified'])) {
													companyAddress = $this.commonService.formatCompanyAddress(val['_source']['contactDetails']);
												}
											}
											$this.filteredCompanyNameArray.push({
												key: $this.titlecasePipe.transform(val['_source']['businessName']).toUpperCase(),
												companyNumber: $this.titlecasePipe.transform(val['_source']['companyRegistrationNumber']),
												companyAddress: companyAddress,
												companyStatus: $this.titlecasePipe.transform(val['_source']['companyStatus'])
											});
										}
	
									}
	
								} else {
									$this.filteredCompanyNameArray = [];
								}
	
							}
	
						});
					} else {
						$this.globalServerCommunicate.getPublicSuggestions(obj).subscribe(res => {

							let data = res, tempArray = [];
							if ( data && data.status == 200 ) {
								
								if ( data['results'] ) {
									
									for( let item of data.results ) {
										tempArray.push({
											key: $this.titlecasePipe.transform(item.companyName).toUpperCase(),
											companyNumber: $this.titlecasePipe.transform(item.companyNumber),
											companyStatus: $this.titlecasePipe.transform(item.companyStatus)
										});
									}

									$this.filteredCompanyNameArray = tempArray;
	
								} else {
									$this.filteredCompanyNameArray = [];
								}
	
							}
						});
					}
				} else {
					$this.filteredCompanyNameArray = [];
				}
			}
		}, 1000);
	}

	filteredIndustryName(event) {
		clearTimeout(this.timeout);
		let $this = this;

		this.timeout = setTimeout(function () {
			if (event.keyCode != 13) {
				if (event.query.length > 2) {
					let obj = {
						industryName : event.query.toString().toLowerCase()
					}
					
					$this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'industryNameSuggestions', obj ).subscribe( res => {

						let data = res.body;

						if (data && data.status == 200) {

							if (data['results']) {

								let suggestedIndustriesData = data['results']['aggregations']['distinct_categories']['buckets'];

								if (suggestedIndustriesData == null) {

									$this.filteredIndustryNameArray = [];

								} else if (suggestedIndustriesData) {

									$this.filteredIndustryNameArray = [];

									for (let val of suggestedIndustriesData) {
										$this.filteredIndustryNameArray.push({
											key: $this.titlecasePipe.transform(val.key)
										});
									}
								}

							} else {
								$this.filteredIndustryNameArray = [];
							}

						}
					});
					
				} else {
					$this.filteredIndustryNameArray = [];
				}
			}
		}, 1000);
	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	searchCompany(event, label) {

		this.companyNameNumberSearchKey = '';
		
		if (label == 'company') {
			this.router.navigate(['/company', event.value.companyNumber.toLowerCase(), this.formatCompanyNameForUrl(event.value.key)]);
		}

		if (label == 'Industry') {
			this.industryArry.push(event.value.key);
		}
	}

	searchRouteFor( type: any ) {

		if (type == 'company') {

			this.router.navigate(['/company-search'], { queryParams: { company: this.companyNameNumberSearchKey['key'] ? this.companyNameNumberSearchKey['key'] : this.companyNameNumberSearchKey } });
			this.companyNameNumberSearchKey = '';
			// this.companyNameNumberSearchKey['key'] = '';

		} else if (type == 'director') {

			this.router.navigate(['/company-search'], { queryParams: { directorName: this.directorNameSearchKey } });

		} else if (type == 'Industry') {

			if (this.industryArry.length > 0) {
				this.searchCompanyService.showStatsButton = true;
				this.router.navigate(['/company-search'], { queryParams: { industryName: this.industryArry } });
			} else {
				this.router.navigate(['/company-search'], { queryParams: { industryName: this.industryNameSearchkey } });
			}

		}

	}

	unselectIndustryTagChip( event ) {

		this.industryArry = this.industryArry.filter(industry => industry !== event.value.key);
		
	}

}
