import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, skip, take, toArray } from 'rxjs';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';

@Component({
	selector: 'dg-responsible-procurement',
	templateUrl: './responsible-procurement.component.html',
	styleUrls: ['./responsible-procurement.component.scss']
})

export class ResponsibleProcurementComponent implements OnInit {

	selectlist: object = {};
	globalFilterDataObject: any = {
		listId: '',
		pageSize: 5000,
		startAfter: 0,
		pageName: '',
		listName:''
	};

	diversityInclusionData: any;
	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;
	clickedBusiness: string;
	newListId: string;
	title: string = '';
	description: string = '';
	allDiversityInclusionTableData: Array<any> = [];
	diversityIndexDataColumn: Array<any> = [];
	diversityIndexDataValue: Array<any> = [];
	diversityIndexFilteredDataValue: Array<any> = [];
    diversitySaveList: Array<{}> = [];
	searchTotalCount: number;

	// counts: any = {
	// 	ethnic: {
	// 		label: 'Ethnic Minority Business',
	// 		value: 0,
	// 		materialIconClassName: 'diversity_2',
	// 		iconDisplay: true,
	// 		colorVar: '--violetRGB',
	// 		infoMsg: 'Discover businesses led by ethnically diverse directors in the UK.'
	// 	},
	// 	female: {
	// 		label: 'Female Owned Business',
	// 		value: 0,
	// 		materialIconClassName: 'female',
	// 		iconDisplay: true,
	// 		colorVar: '--pinkRGB',
	// 		infoMsg: 'Understand more about companies owned by women in the UK.'
	// 	},
	// 	msdukCertification: {
	// 		label: "MSDUK Certified Business",
	// 		value: 0,
	// 		materialIconClassName: 'person_outline',
	// 		imageName: 'msduk_certified',
	// 		colorVar: '--amberRGB',
	// 		infoMsg: ''
	// 	},
	// 	bcorpCertification: {
	// 		label: "B Corp Certified Business",
	// 		value: 0,
	// 		materialIconClassName: 'person_outline',
	// 		imageName: 'b_corp_certified',
	// 		colorVar: '--lightgreenRGB',
	// 		infoMsg: 'Discover businesses with B Corp Certification, recognised for their commitment to high social and environmental performance standards.'
	// 	},
	// 	vcse_categoryCount: {
	// 		label: 'VCSE Category',
	// 		value: 0,
	// 		materialIconClassName: 'castle',
	// 		iconDisplay: true,
	// 		colorVar: '--skyblueRGB',
	// 		infoMsg: 'Discover VCSE businesses dedicated to community well-being and social impact.'
	// 	},
	// 	netZeroTargetCount: {
	// 		label: 'Net-Zero Target',
	// 		value: 0,
	// 		materialIconClassName: 'warehouse',
	// 		iconDisplay: true,
	// 		colorVar: '--lightblueRGB',
	// 		totalSpent: 0,
	// 		filterName: 'net-zero target',
	// 		infoMsg: 'Find companies committed to achieving net-zero carbon emissions and environmental sustainability.'
	// 	},
	// 	ppcCategoryCount: {
	// 		label: 'Prompt Payment Code',
	// 		value: 0,
	// 		materialIconClassName: 'person_outline',
	// 		colorVar: '--blueRGB',
	// 		imageName: 'PPC',
	// 		filterName: 'ppc_certification',
	// 		infoMsg: 'Identify businesses that have signed up for the Prompt Payment Code, demonstrating their commitment to fair and timely payments, supporting suppliers and small businesses.'
	// 	}

	// }

	counts: any = {

		bcorpCertification: {
			label: "B Corp Certified Business",
			value: 0,
			percentage: null,
			materialIconClassName: 'person_outline',
			imageName: 'B-Corp-Website',
			colorVar: '--lightgreenRGB',
			filterName: 'B Corp Certified Business',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/b-corp-certified.png',
			infoMsg: 'Beyond Profit: Journey to B Corp Certification<br> Certified for Good: Highest Social & Environmental Standards<br> B Corp & Beyond: Driving Purpose-Driven Business Success<br> Balancing Purpose & Profit: B Corp Matters',
			urlLink: '<br><a href="https://bcorporation.uk" target="_blank">https://bcorporation.uk</a>'
		},
		female: {
			label: 'Woman Owned Business',
			value: 0,
			percentage: null,
			materialIconClassName: 'female',
			iconDisplay: true,
			colorVar: '--pinkRGB',
			totalSpent: 0,
			filterName: 'Woman Owned Business',
			chipGrp: 'Segmentation by Ownership',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/women-owned.png',
			infoMsg: 'Woman-Led, Impact-Driven: Empowering Business Through Female Leadership<br> Breaking Barriers: Thriving as a Female-Owned Enterprise<br> Leading with Innovation: The Power of Woman-Owned Businesses<br> Championing Woman in Business: Story & Commitment'
		},
		ethnic: {
			label: 'Ethnic Minority Business',
			value: 0,
			percentage: null,
			materialIconClassName: 'diversity_2',
			iconDisplay: true,
			colorVar: '--violetRGB',
			totalSpent: 0,
			filterName: 'Ethnic Minority Business',
			chipGrp: 'Segmentation by Ownership',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/ethnic-minority.png',
			infoMsg: 'Diversity in Action: Celebrating Ethnic Minority Leadership<br> Representation Matters: Driving Inclusion & Opportunity<br> Empowering Ethnic Minority Entrepreneurs & Professionals<br> Strength in Diversity: Fostering an Inclusive Business Landscape'
		},
		militaryVeterans: {
			label: "Military Veterans",
			value: 0,
			percentage: null,
			materialIconClassName: 'military_tech',
			iconDisplay: true,
			colorVar: '--aquaRGB',
			totalSpent: 0,
			filterName: 'Military Veterans',
			chipGrp: 'Segmentation by Ownership',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/military-veterans.png',
			infoMsg: 'From Service to Success: Empowering Military Veterans in Business<br> Veteran-Owned & Operated: Leadership, Integrity, and Innovation<br> Supporting Those Who Served: Championing Veteran Entrepreneurs<br> Mission-Driven: How Military Experience Fuels Business Excellence'
		},
		// vcse_categoryCount: {
		// 	label: 'VCSE Category',
		// 	value: 0,
		// 	percentage: null,
		// 	materialIconClassName: 'castle',
		// 	iconDisplay: true,
		// 	colorVar: '--skyblueRGB',
		// 	totalSpent: 0,
		// 	filterName: ['Registered Charitable Organization', 'Community Interest Business'],
		// 	chipGrp: 'Mission Spectrum',
		// 	imageSource: 'assets/layout/images/responsible-procurement-tags-images/military-veterans.png',
		// 	infoMsg: 'VCSE stands for Voluntary, Community, and Social Enterprise—organizations focused on social or community benefit rather than profit.'
		// },
		registeredCharitableOrganizationCount: {
			label: 'Registered Charitable Organization',
			value: 0,
			percentage: null,
			materialIconClassName: 'castle',
			iconDisplay: true,
			colorVar: '--skyblueRGB',
			totalSpent: 0,
			filterName: 'Registered Charitable Organization',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/registered-charitable-org.png',
			infoMsg: 'Smiling volunteers serving food or distributing clothes, donation boxes.',
			urlLink: '<br><a href="https://register-of-charities.charitycommission.gov.uk/en/register/full-register-download" target="_blank">https://register-of-charities.charitycommission.gov.uk/en/register/full-register-download</a>'
		},
		netZeroTargetCounts: {  
			label: 'Net-Zero Target',
			value: 0,
			percentage: null,
			materialIconClassName: 'warehouse',
			iconDisplay: true,
			colorVar: '--skyblueRGB',
			totalSpent: 0,
			filterName: 'Net-Zero Target',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/net-zero-target.png',
			infoMsg: 'Our Path to Net Zero: Commitment, Action & Impact<br> Towards a Sustainable Future: Achieving Net Zero Emissions<br> Carbon Neutrality & Beyond: Net Zero Strategy<br> Reducing Our Footprint: Roadmap to Net Zero',
			urlLink: '<br><a href="https://sciencebasedtargets.org/target-dashboard" target="_blank">https://sciencebasedtargets.org/target-dashboard</a>'
		},
		communityInterestBusinessCount: {
			label: 'Community Interest Business',
			value: 0,
			percentage: null,
			materialIconClassName: 'castle',
			iconDisplay: true,
			colorVar: '--violetRGB',
			totalSpent: 0,
			filterName: 'Community Interest Business',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/community-interest-cmp.png',
			infoMsg: 'Community workshops, local business owners collaborating, town hall scenes.',
			urlLink: '<br><a href="https://findthatcharity.uk/orgid/type/community-interest-company" target="_blank">https://findthatcharity.uk/orgid/type/community-interest-company</a>'
		},
		modernSlaveryCount: {
			label: "Modern Slavery Statement",
			value: 0,
			percentage: null,
			materialIconClassName: 'person_outline',
			imageName: 'B-Corp-Website',
			colorVar: '--darkOrangeRGB',
			filterName: 'Modern Slavery Statement',
			chipGrp: 'Mission Spectrum',
			totalSpent: 0,
			riskRegisterCount: 0,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/modern-slavery.png',
			infoMsg: 'Combatting Modern Slavery: Commitment to Ethical Business<br> Ending Exploitation: Transparency in Supply Chain<br> Modern Slavery & Human Rights: Annual Disclosure<br> Taking a Stand: Approach to Modern Slavery Prevention',
			urlLink: '<br><a href="https://modern-slavery-statement-registry.service.gov.uk" target="_blank">https://modern-slavery-statement-registry.service.gov.uk</a>'
		},
		ppcCategoryCount: {
			label: 'Prompt Payment Code Signatories',
			value: 0,
			percentage: null,
			materialIconClassName: 'person_outline',
			colorVar: '--blueRGB',
			imageName: 'PPC',
			totalSpent: 0,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/ppc-signatories.png',
			infoMsg: 'Business policies ensuring suppliers and vendors are paid on time to maintain financial stability.',
			urlLink: '<br><a href="https://www.smallbusinesscommissioner.gov.uk/fpc/awardees" target="_blank">https://www.smallbusinesscommissioner.gov.uk/fpc/awardees</a>'
		},
		genderpayGapReportingCount: {
			label: 'Gender Pay Gap Reporting',
			value: 0,
			percentage: null,
			materialIconClassName: 'female',
			iconDisplay: true,
			colorVar: '--orangeRGB',
			totalSpent: 0,
			riskRegisterCount: 0,
			filterName: 'Gender Pay Gap Reporting',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/gender-pay-gap-reporting.png',
			infoMsg: 'Bridging the Gap: A Transparent Look at Gender Pay Equality<br> Gender Pay Gap Insights: Progress, Challenges, and Commitments<br> Equal Pay for Equal Work: Gender Pay Gap Report <br> Closing the Divide: Gender Pay Gap Trends and Action Plans',
			urlLink: '<br><a href="https://gender-pay-gap.service.gov.uk/viewing/download" target="_blank">https://gender-pay-gap.service.gov.uk/viewing/download</a>'
		},
		raceAtWork: {
			label: 'Race at Work',
			value: 0,
			percentage: null,
			materialIconClassName: 'warehouse',
			iconDisplay: true,
			colorVar: '--aquaRGB',
			totalSpent: 0,
			filterName: 'Race at Work',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/race-at-work.png',
			infoMsg: 'Championing Diversity: Race & Ethnicity in the Workplace<br> Race at Work: Driving Inclusion, Equality, and Opportunity<br> Building an Inclusive Workforce: Commitment to Racial Equity<br> Diversity & Representation: Creating Equal Opportunities for All',
			urlLink: '<br><a href="https://www.bitc.org.uk/race/the-race-at-work-charter" target="_blank">https://www.bitc.org.uk/race/the-race-at-work-charter</a>'
		},
		dataControllersCount: {
			label: "ICO Registered Business",
			value: 0,
			percentage: null,
			materialIconClassName: 'person_outline',
			colorVar: '--yellowRGB',
			imageName: 'PPC',
			filterName: 'ICO Registered Business',
			chipGrp: 'Mission Spectrum',
			totalSpent: 0,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/ico-registered.png',
			infoMsg: "Information Commissioner's Office Registered entities or individuals responsible for determining how and why personal data is processed under data protection laws.",
			urlLink: '<br><a href="https://ico.org.uk/about-the-ico/what-we-do/register-of-fee-payers/download-the-register" target="_blank">https://ico.org.uk/about-the-ico/what-we-do/register-of-fee-payers/download-the-register</a>'
		}
	} 


    msmeStatusColor = {
        'Micro': '#59ba9b',
        'Small': '#ffcc00',
        'Medium': '#ee9512',
        'Large Enterprise': '#e1b12c',
		'Unknown': '#aabbcc',
    }

	constructor(
		private userAuthService: UserAuthService,
		private globalServerCommunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private seoService: SeoService,
		private router: Router
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( !this.userAuthService.hasAddOnPermission('diversityAndInclusion') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
			this.router.navigate(['/']);
		}

	}

	ngOnInit() {

		this.sharedLoaderService.showLoader();

		this.diversityIndexDataColumn = [
			{ field: 'company_name', header: 'Company Name', colunName: 'Company Name', minWidth: '360px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'company_number', header: 'Company Number', colunName: 'Company Number', minWidth: '130px', maxWidth: '130px', textAlign: 'right', value: true },
			{ field: 'is_ethnic_minority', header: 'Ethnic Minority Business', colunName: 'Ethnic Minority Business', minWidth: '220px', maxWidth: '220px', textAlign: 'center', value: true },
			{ field: 'ethnic_share_percentage', header: 'Ethnic Share %', colunName: 'Ethnic Share %', minWidth: '110px', maxWidth: '110px', textAlign: 'left', value: true },
			{ field: 'female_founded', header: 'Woman Owned Business', colunName: 'Woman Owned Business', minWidth: '160px', maxWidth: '160px', textAlign: 'center', value: true },
			{ field: 'female_owned_share_percentage', header: 'Woman Owned Business Share %', colunName: 'Woman Owned Business Share %', minWidth: '220px', maxWidth: '220px', textAlign: 'left', value: true },
			{ field: 'militaryVeterans', header: 'Military Veterans', colunName: 'Military Veterans', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
			{ field: 'msmeCategory', header: 'MSME Category', colunName: 'MSME Category', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
			{ field: 'vcseCategory', header: 'VCSE Category', colunName: 'VCSE Category', minWidth: '160px', maxWidth: '160px', textAlign: 'center', value: true },
			{ field: 'share_holders_count', header: 'No. of Shareholders', colunName: 'No. of Shareholders', minWidth: '160px', maxWidth: '160px', textAlign: 'right', value: true },
			{ field: 'active_director_count', header: 'No. of Active Directors', colunName: 'No. of Active Directors', minWidth: '160px', maxWidth: '160px', textAlign: 'right', value: true },
			{ field: 'age_director_diversity', header: 'Director\'s by Age', colunName: 'Director\'s by Age', minWidth: '320px', maxWidth: '320px', textAlign: 'left', value: true },
			{ field: 'net-zero_target', header: 'Net-Zero Target', colunName: 'Net-Zero Target', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
			{ field: 'ppc_certification', header: 'PPC Signatories', colunName: 'PPC Signatories', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
		];

		this.initBreadcrumbAndSeoMetaTags();
		
		this.diversityInclusionSaveList();
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Responsible Procurement', routerLink: ['/insights/responsible-procurement'] }
		// ]);
		this.title = "DataGardener Responsible Procurement - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	getDiversityIndexdData( selectedList? ) {

		if ( selectedList ) {

			this.globalFilterDataObject['listId'] = selectedList['_id'];
			this.globalFilterDataObject['pageName'] = selectedList['pageName'];
			this.globalFilterDataObject['listName'] = selectedList['listName'];
		}

		this.sharedLoaderService.showLoader();


		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'getEthnicityDataByList', this.globalFilterDataObject ).subscribe(
			{
				next: ( res ) => {

					
					if ( res.body.status == 200 ) {

						this.diversityInclusionData = res.body;

						this.allDiversityInclusionTableData = this.diversityInclusionData.results;
						this.searchTotalCount = this.diversityInclusionData.total;
			
						this.counts.ethnic.value = this.diversityInclusionData.ethnicCompanyCount;
						this.counts.female.value = this.diversityInclusionData.femaleOwnedCompanyCount;
						this.counts.militaryVeterans.value = this.diversityInclusionData.militaryVeteranCount;
						// this.counts.msdukCertification.value = this.diversityInclusionData.msduk_certificationCount;
						this.counts.bcorpCertification.value = this.diversityInclusionData.bcorp_certificationCount;
						// this.counts.vcse_categoryCount.value = this.diversityInclusionData.vcse_categoryCount;
						// this.counts.netZeroTargetCount.value = this.diversityInclusionData.netZeroTargetCount;
						this.counts.ppcCategoryCount.value = this.diversityInclusionData.ppc_categoryCount;
						from( this.allDiversityInclusionTableData ).pipe( take(25), toArray() ).subscribe( data => this.diversityIndexDataValue = data);
						this.counts.raceAtWork.value = this.diversityInclusionData.raceAtWorkCount;
						this.counts.netZeroTargetCounts.value = this.diversityInclusionData.netZeroTargetCount;
						this.counts.modernSlaveryCount.value = this.diversityInclusionData.modernSlaveryStatementCount;
						this.counts.genderpayGapReportingCount.value = this.diversityInclusionData.genderPayGapReportingCount;
						this.counts.dataControllersCount.value = this.diversityInclusionData.icoRegisteredBusinessCount;
						this.counts.registeredCharitableOrganizationCount.value = this.diversityInclusionData.charity_categoryCount;
						this.counts.communityInterestBusinessCount.value = this.diversityInclusionData.community_interest_business_categoryCount;

						this.counts.modernSlaveryCount.riskRegisterCount = this.diversityInclusionData.modern_slavery_risk_register_count;
						this.counts.genderpayGapReportingCount.riskRegisterCount = this.diversityInclusionData.gender_pay_gap_risk_register_count;

					}

					setTimeout(() => {
						this.sharedLoaderService.hideLoader();
					}, 100);

				},
				error: ( err ) => {
					console.log(err);
					this.sharedLoaderService.hideLoader();
				}
			}
		);

	}

	async updateTableAfterPagination( event, cardLabel? ) {

		this.sharedLoaderService.showLoader();

		if ( event && event.isDiversityReset ) {
			this.clickedBusiness = '';
		}

		if( cardLabel ) {
			this.clickedBusiness = cardLabel;
		}

		if ( this.clickedBusiness != '' ) {
			cardLabel = this.clickedBusiness ;
		}

		this.diversityIndexFilteredDataValue = JSON.parse( JSON.stringify( this.allDiversityInclusionTableData ) );
		

		if ( event && event.filterSearchArray && event.filterSearchArray.length ) {

			this.diversityIndexFilteredDataValue = await this.filterTableData( this.diversityIndexFilteredDataValue, event.filterSearchArray );

		}

		if ( event && event.sortOn && event.sortOn.length ) {

			this.diversityIndexFilteredDataValue = await this.sortTableData( this.diversityIndexFilteredDataValue, event.sortOn );
			
		}

		if ( cardLabel ) {

			this.diversityIndexFilteredDataValue = await this.filterCertifiedCompany( this.diversityIndexFilteredDataValue, cardLabel );

		}

		this.searchTotalCount = this.diversityIndexFilteredDataValue.length;

		from( this.diversityIndexFilteredDataValue ).pipe(
			skip(event && event.startAfter ? event.startAfter : 0),
			take(event && event.pageSize ? event.pageSize : 25),
			toArray()
		)
		.subscribe( data => this.diversityIndexDataValue = data );

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 1000);

	}

	filterTableData( inputData, filterArgs ): Array<any> {

		let outputData = [];
 
		for ( let filter of filterArgs ) {

			outputData = outputData.length ? outputData : inputData;

			outputData = outputData.filter( val => val[ filter.field ].toString().toLowerCase().includes( filter.value.toString().toLowerCase() ) );

		}

		return outputData;

	}

	sortTableData( inputData, sortArgs ) {

		let outputData = [];

		const [ firstIndxStr, ...restStr ] = ( Object.keys( sortArgs[0] )[0] ).split(' ');
		let dataKey = firstIndxStr.toLowerCase() + restStr.join('') == 'companyName' ? 'company_name' : firstIndxStr.toLowerCase() + restStr.join('');
		let dataSortType = Object.values( sortArgs[0] )[0];

		// outputData = inputData.sort( ( a, b ) => dataSortType == 'asc' ? a[ dataKey ].toString().localeCompare( b[ dataKey ] ) : b[ dataKey ].toString().localeCompare( a[ dataKey ] ) );

		outputData = inputData.sort((a, b) => {
			if (a[dataKey] === undefined) a[dataKey] = '';
			if (b[dataKey] === undefined) b[dataKey] = '';
			const aValue = a[dataKey];
			const bValue = b[dataKey]
			return dataSortType === 'asc' ? a[dataKey].localeCompare(b[dataKey]) : b[dataKey].localeCompare(a[dataKey]);
		});

		return outputData

	}

	preventDefaultSort() {
		return 0;
	}

	filterCertifiedCompany( inputData, labelArgs ) {
		
		let outputData = [];

		let companyCertifiedKey: string = '';

		if ( labelArgs == 'Ethnic Minority Business' ) {
			companyCertifiedKey = 'is_ethnic_minority'
		} else if ( labelArgs == 'Woman Owned Business' ) {
			companyCertifiedKey = 'female_founded';
		} else if (  labelArgs == 'MSDUK Certified Business' ) {
			companyCertifiedKey = 'msduk_certification'; 
		} else if (  labelArgs == 'B Corp Certified Business' ) {
			companyCertifiedKey = 'bcorp_certification';
		} else if (  labelArgs == 'VCSE Category' ) {
			companyCertifiedKey = 'vcseCategory';
		} else if ( labelArgs == 'Net-Zero Target' ) {
			companyCertifiedKey = 'net-zero_target';
		} else if ( labelArgs == 'Prompt Payment Code Signatories' ) {
			companyCertifiedKey = 'ppc_certification';
		} else if ( labelArgs == 'Military Veterans' ) {
			companyCertifiedKey = 'militaryVeterans';
		}else if ( labelArgs == 'Race at Work' ) {
			companyCertifiedKey = 'race_At_Work';
		}else if ( labelArgs == 'Modern Slavery Statement' ) {
			companyCertifiedKey = 'modern_Slavery_Statement';
		}else if ( labelArgs == 'Gender Pay Gap Reporting' ) {
			companyCertifiedKey = 'genderPayGapReporting';
		}else if ( labelArgs == 'ICO Registered Business' ) {
			companyCertifiedKey = 'ICO_Registered_Business';
		}else if ( labelArgs == 'Registered Charitable Organization' ) {
			companyCertifiedKey = 'charity_category';
		}else if ( labelArgs == 'Community Interest Business' ) {
			companyCertifiedKey = 'community_interest_business_category';
		}

		outputData = inputData.filter( data => [ 'is_ethnic_minority', 'female_founded', 'vcseCategory', 'net-zero_target', 'ppc_certification', 'militaryVeterans', 'race_At_Work', 'ICO_Registered_Business', 'genderPayGapReporting', 'modern_Slavery_Statement', 'charity_category', 'community_interest_business_category' ].includes( companyCertifiedKey ) ? ( data[companyCertifiedKey] == 'yes' || data[companyCertifiedKey] == true ) : data[companyCertifiedKey] );

		return outputData;

	}

	diversityInclusionSaveList() {

		// let newpayload = {
		// 	'userId' : this.userAuthService?.getUserInfo('dbID')
		// }

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_API', 'getUserDiversityList' ).subscribe({
			next: ( res ) => {

				if ( res.status === 200 ) {
					this.diversitySaveList = res.body.results;
					this.selectlist = this.diversitySaveList?.[0] || undefined;
					this.getDiversityIndexdData( this.selectlist );
					// this.newListId =  res.body.results[0]
				}

			},
			error: ( err ) => {
				console.log( err );
			}
		})

	}
}
