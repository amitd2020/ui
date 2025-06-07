import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FileUpload, UploadEvent } from "primeng/fileupload";
import { from, skip, take, toArray } from "rxjs";
import { UserAuthService } from "src/app/interface/auth-guard/user-auth/user-auth.service";
import { SeoService } from "src/app/interface/service/seo.service";
import { ServerCommunicationService } from "src/app/interface/service/server-communication.service";
import { SharedLoaderService } from "src/app/interface/view/shared-components/shared-loader/shared-loader.service";
import { subscribedPlan } from "src/environments/environment";
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import * as echarts from 'echarts';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from "@angular/common";
import { diversityIndexDataColumn, supplierResilienceDataColumn } from "./table-column.const";
import { MakePdfService } from "src/app/shared-pdf-report/make-pdf.service";
import { pageConfigsStore } from "src/app/shared-pdf-report/make-pdf-constant.const";
import { PageConfig } from "src/app/shared-pdf-report/page-config.interface";


@Component({
	selector: 'dg-supplier-analytics',
	templateUrl: './supplier-analytics.html',
	styleUrls: ['./supplier-analytics.scss']
})

export class SupplierAnalytics implements OnInit {

	@ViewChild('fileUploader', { static: false }) fileUpload: FileUpload;
	selectlist: object = {};
	globalFilterDataObject: any = {
		listId: '',
		pageSize: 5000,
		startAfter: 0,
		pageName: ''
	};
	headers: Array<any> = [];
	columnData: Array<any> = [];
	transposedArrayData: Array<any> = [];
	showDialog: boolean = false;
	headerDropdownNgModel: Array<any> = [];
	selectedListName: string = '';
	selectedFile: File;
	msgs: Array<any> = [];

	dropdownOptionsArray: Array<any> = [
		{ value: 'None', label: 'None', inactive: false },
		{ value: 'SUPPLIER NAME', label: 'Supplier Name', inactive: false },
		{ value: 'COL SUPPLIER_NUMBER', label: 'Col Supplier Number', inactive: false },
		{ value: 'POSTCODE', label: 'Post Code', inactive: false },
		{ value: 'COUNTRY', label: 'Country', inactive: false },
		{ value: 'VAT_REGISTRATION_NUM', label: 'Vat Registration Num', inactive: false },
		{ value: 'Spend Net', label: 'Spend Net', inactive: false },
		{ value: 'COMPANY REGISTRATION NUMBER', label: 'Company Registration Num', inactive: false },
		{ value: 'DATE PAID', label: 'Date Paid', inactive: false }
	]

	selectedNgModel: Object = {};
	isProcessing: boolean = false;
	
	diversityInclusionData: any;
	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;
	clickedBusiness: string;
	newListId: string;
	title: string = '';
	description: string = '';
	routerUrl: string;
	allDiversityInclusionTableData: Array<any> = [];
	diversityIndexDataColumn: Array<any> = [];
	diversityIndexDataValue: Array<any> = [];
	diversityIndexFilteredDataValue: Array<any> = [];
	diversitySaveList: Array<{}> = [];
	searchTotalCount: number;
	// startAfetr: 0;
	// pageSize: 25;
	filterSearchArray: any[];
	// sortOn: any
	optionForGraph: object = {};
	keyPreparationObj: object = {};

	matchedDataArray: string[] = [];

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
		nonProfitCount: { 
			label: 'Non Profit Organization',
			value: 0,
			percentage: null,
			materialIconClassName: 'warehouse',
			iconDisplay: true,
			colorVar: '--brownRGB',
			totalSpent: 0,
			filterName: 'Non Profit Organization',
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/non-profit-org.png',
			infoMsg: 'Entity that operates for social, charitable, or public benefit rather than profit.'
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
			preferenceValue: 'Company Must Not Be Modern Slavery Risk Register',
			preferenceOperator: {
                "is_modern_slavery_risk_register": "true"
            },
			totalSpent: 0,
			riskRegisterCount:0,
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/modern-slavery.png',
			infoMsg: 'Combatting Modern Slavery: Commitment to Ethical Business<br> Ending Exploitation: Transparency in Supply Chain<br> Modern Slavery & Human Rights: Annual Disclosure<br> Taking a Stand: Approach to Modern Slavery Prevention',
			urlLink: '<br><a href="https://modern-slavery-statement-registry.service.gov.uk" target="_blank">https://modern-slavery-statement-registry.service.gov.uk</a>'
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
			preferenceValue: 'Company Must Be Gender Pay Gap Risk Register',
			preferenceOperator: {
				"is_gender_pay_risk_register": "true"
            },
			chipGrp: 'Mission Spectrum',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/gender-pay-gap-reporting.png',
			infoMsg: 'Bridging the Gap: A Transparent Look at Gender Pay Equality<br> Gender Pay Gap Insights: Progress, Challenges, and Commitments<br> Equal Pay for Equal Work: Gender Pay Gap Report <br> Closing the Divide: Gender Pay Gap Trends and Action Plans',
			urlLink: '<br><a href="https://gender-pay-gap.service.gov.uk/viewing/download" target="_blank">https://gender-pay-gap.service.gov.uk/viewing/download</a>'
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
		livingWageFoundationRegisteredCount: {
			label: "Living Wage Foundation Registered",
			value: 0,
			colorVar: '--aquaRGB',
			filterName: 'Living Wage Foundation Registered',
			chipGrp: 'Mission Spectrum',			
			riskRegisterCount: 0,
			totalSpent: 0,
			preferenceValue: 'Company Must Not Be Living Wage Foundation Registered',
			preferenceOperator: {
				"is_living_wage_foundation_registered": "false"
            },
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/livingWagesFoundationNew.png',
			infoMsg: "The Living Wage Foundation  promotes fair pay by accrediting employers who voluntarily pay a real living wage based on the cost of living.",
			urlLink: '<br><a href="https://www.livingwage.org.uk" target="_blank">https://www.livingwage.org.uk</a>'
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
		msdukCertification: {
			label: "MSDUK Certified",
			value: 0,
			percentage: null,
			materialIconClassName: 'person_outline',
			iconDisplay: true,
			colorVar: '--amberRGB',
			totalSpent: 0,
			infoMsg: ''
		},

		isGovtDeptsCounts: {
			label: 'Govt. Departments',
			value: 0,
			totalSpent: 0,
			iconDisplay: true,
			colorClass: 'yellow-700',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/government-department.png',
			infoMsg: 'Organizations funded and operated by the government, including departments, agencies, and public services.',
		},
		isCouncilCounts: {
			label: 'Councils',
			value: 0,
			totalSpent: 0,
			iconDisplay: true,
			colorClass: 'blue-700',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/councils.png',
			infoMsg: 'Local government entities responsible for services such as planning, transportation, and public welfare.',
		},
		isUniversityCounts: {
			label: 'Universities',
			value: 0,
			totalSpent: 0,
			iconDisplay: true,
			colorClass: 'pink-700',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/universities.png',
			infoMsg: 'Universities, colleges, and research institutions providing advanced education and academic research.',
		},
		isOtherCounts: {
			label: 'Others',
			value: 0,
			totalSpent: 0,
			iconDisplay: true,
			colorClass: 'cyan-700',
			imageSource: 'assets/layout/images/responsible-procurement-tags-images/others.png'
		},
	} 

	msmeStatusColor = {
		'Micro': '#59ba9b',
		'Small': '#ffcc00',
		'Medium': '#ee9512',
		'Large Enterprise': '#e1b12c',
		'Unknown': '#aabbcc',
		'unknown': '#aabbcc',
		'very low risk': '#6DC470',
		'low risk': '#59BA9B',
		'moderate risk': '#FFC201',
		'high risk': '#E4790F',
		'not scored': '#D92727'
	}

	msmeStatusBgColor = {
		'Micro': '#cdeae1',
		'Small': '#fff0b3',
		'Medium': '#fadfb8',
		'Large Enterprise': '#f6e8c0',
		'Unknown': '#e6ebf0',
	}

	internationalScoreStatusColor = {
        'very low risk': '#6dc470',
        'low risk': '#59ba9b',
        'moderate risk': '#ffcc00',
        'high risk': '#ee9512',
		'not scored': '#D92727',
    }

	internationalScoreBgColor = {
        'very low risk': '#c9e9ca',
        'low risk': '#c9e8df',
        'moderate risk': '#fff0b3',
        'high risk': '#fadfb7',
		'not scored': '#f4bebe',
    }
	chartOptions: echarts.EChartsOption;

	pageConfigs: PageConfig[] = pageConfigsStore;
	updatedPageConfigs: PageConfig[] = pageConfigsStore;

	constructor(
		private userAuthService: UserAuthService,
		private globalServerCommunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private seoService: SeoService,
		private router: Router,
		private decimalPipe: DecimalPipe,
		private currencyPipe: CurrencyPipe,
		private toTitleCasePipe: TitleCasePipe,
		private makePdfService: MakePdfService
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if (!this.userAuthService.hasAddOnPermission('diversityCalculation') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan) {
			this.router.navigate(['/']);
		}

		this.routerUrl = this.router.routerState.snapshot.url.split('/')[2];

		if ( this.routerUrl === 'supplier-resilience' ) {
			delete this.counts.ethnic;
			delete this.counts.raceAtWork;
		}

		this.keyPreparationObj = {
			"responsible-procurement": {
				thisPage: 'diversityCalculation',
				fetchTableData: 'diversitySpendsTable',
				tableColumns: diversityIndexDataColumn 
			},
			"supplier-resilience": {
				thisPage: 'supplierResilience',
				fetchTableData: 'diversitySpendsTable',
				tableColumns: supplierResilienceDataColumn
			}
		}

	}

	ngOnInit() {

		this.sharedLoaderService.showLoader();
		this.initBreadcrumbAndSeoMetaTags();
		this.diversityInclusionSaveList();
	}

	initBreadcrumbAndSeoMetaTags() {
		this.title = "DataGardener Responsible Procurement - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description)
	}

	getDiversityIndexdData( selectedList? ) {
		this.sharedLoaderService.showLoader();

		if ( selectedList ) {

			this.globalFilterDataObject['listId'] = selectedList['_id'];
			this.globalFilterDataObject['pageName'] = selectedList['pageName'];
			this.globalFilterDataObject['listName'] = selectedList['listName'];
			this.globalFilterDataObject['filterName'] = selectedList['filterName'];
		}

		this.globalServerCommunicate.globalServerRequestCall('post', 'DG_API', 'diversityCalculation', this.globalFilterDataObject).subscribe(
			{
				next: (res) => {				

					if (res.body.code == 200) {

						this.diversityInclusionData = res.body;

						if ( this.routerUrl !== 'supplier-resilience' ) {
							this.counts.ethnic.value = this.diversityInclusionData.result.ethnicOwnershipCounts.doc_count;
							this.counts.ethnic.totalSpent = this.diversityInclusionData.result.ethnicOwnershipCounts.spendTotal;
							this.counts.raceAtWork.value = this.diversityInclusionData.result.raceAtWork.doc_count; 
							this.counts.raceAtWork.totalSpent = this.diversityInclusionData.result.raceAtWork.spendTotal;
						}
						this.counts.female.value = this.diversityInclusionData.result.femaleOwnedCounts.doc_count;
						this.counts.msdukCertification.value = this.diversityInclusionData.result.msdukCertificationCounts.doc_count;
						this.counts.bcorpCertification.value = this.diversityInclusionData.result.bcorpCertificationCounts.doc_count;
						this.counts.militaryVeterans.value = this.diversityInclusionData.result.militaryVeteranCounts.doc_count;
						this.counts.netZeroTargetCounts.value = this.diversityInclusionData.result.netZeroTargetCounts.doc_count;
						this.counts.ppcCategoryCount.value = this.diversityInclusionData.result.ppcCertificationCounts.doc_count;
						this.counts.female.totalSpent = this.diversityInclusionData.result.femaleOwnedCounts.spendTotal;
						this.counts.msdukCertification.totalSpent = this.diversityInclusionData.result.msdukCertificationCounts.spendTotal;
						this.counts.bcorpCertification.totalSpent = this.diversityInclusionData.result.bcorpCertificationCounts.spendTotal;
						this.counts.militaryVeterans.totalSpent = this.diversityInclusionData.result.militaryVeteranCounts.spendTotal;
						this.counts.netZeroTargetCounts.totalSpent = this.diversityInclusionData.result.netZeroTargetCounts.spendTotal;
						this.counts.ppcCategoryCount.totalSpent = this.diversityInclusionData.result.ppcCertificationCounts.spendTotal;
						this.counts.genderpayGapReportingCount.value = this.diversityInclusionData.result.genderpayGapReportingCount?.doc_count || 0;
						this.counts.genderpayGapReportingCount.totalSpent = this.diversityInclusionData.result.genderpayGapReportingCount?.spendTotal || 0; 
						this.counts.genderpayGapReportingCount.riskRegisterCount = this.diversityInclusionData.result.genderpayGapReportingCount?.gender_pay_gap_risk_register_count || 0;
						this.counts.registeredCharitableOrganizationCount.value = this.diversityInclusionData.result.registeredCharitableOrganizationCount?.doc_count || 0;
						this.counts.registeredCharitableOrganizationCount.totalSpent = this.diversityInclusionData.result.registeredCharitableOrganizationCount?.spendTotal || 0;
						this.counts.modernSlaveryCount.value = this.diversityInclusionData.result.modernSlaveryCount?.doc_count || 0;
						this.counts.modernSlaveryCount.totalSpent = this.diversityInclusionData.result.modernSlaveryCount?.spendTotal || 0;
						this.counts.modernSlaveryCount.riskRegisterCount = this.diversityInclusionData.result.modernSlaveryCount?.modern_slavery_risk_register_count || 0;
						this.counts.dataControllersCount.value = this.diversityInclusionData.result.dataControllersCount?.doc_count || 0;
						this.counts.dataControllersCount.totalSpent = this.diversityInclusionData.result.dataControllersCount?.spendTotal || 0;
						this.counts.nonProfitCount.value = this.diversityInclusionData.result.nonProfitCount?.doc_count || 0;
						this.counts.nonProfitCount.totalSpent = this.diversityInclusionData.result.nonProfitCount?.spendTotal || 0;
						this.counts.communityInterestBusinessCount.value = this.diversityInclusionData.result.communityInterestBusinessCount?.doc_count || 0;
						this.counts.communityInterestBusinessCount.totalSpent = this.diversityInclusionData.result.communityInterestBusinessCount?.spendTotal || 0;


						this.counts.isGovtDeptsCounts.value = this.diversityInclusionData.result.isGovtDeptsCounts?.doc_count || 0;
						this.counts.isGovtDeptsCounts.totalSpent = this.diversityInclusionData.result.isGovtDeptsCounts?.spendTotal || 0;
						this.counts.isCouncilCounts.value = this.diversityInclusionData.result.isCouncilCounts?.doc_count || 0;
						this.counts.isCouncilCounts.totalSpent = this.diversityInclusionData.result.isCouncilCounts?.spendTotal || 0;
						this.counts.isUniversityCounts.value = this.diversityInclusionData.result.isUniversityCounts?.doc_count || 0;
						this.counts.isUniversityCounts.totalSpent = this.diversityInclusionData.result.isUniversityCounts?.spendTotal || 0;
						this.counts.isOtherCounts.value = this.diversityInclusionData.result.isOtherCounts?.doc_count || 0;
						this.counts.isOtherCounts.totalSpent = this.diversityInclusionData.result.isOtherCounts?.spendTotal || 0;

						this.counts.livingWageFoundationRegisteredCount.value = this.diversityInclusionData.result.livingWageFoundationRegisteredCount?.doc_count || 0;
						this.counts.livingWageFoundationRegisteredCount.totalSpent = this.diversityInclusionData.result.livingWageFoundationRegisteredCount?.spendTotal || 0;
						this.counts.livingWageFoundationRegisteredCount.riskRegisterCount = this.diversityInclusionData.result.livingWageFoundationRegisteredCount?.living_wage_foundation_risk_register_count || 0;

						this.sizeDiversityPie( this.diversityInclusionData?.result?.msmeCounts, 'size' );
						this.sizeDiversityPie( this.diversityInclusionData?.result?.internationalScoreDescriptionCounts, 'risk' );

						setTimeout(() => {
							this.sharedLoaderService.hideLoader();
						}, 100); 
					}

				},
				error: (err) => {
					console.log(err);
					this.sharedLoaderService.hideLoader();
				}
			}
		);

	}

	sizeDiversityPie( dataRes, optionFor: string = 'size' ) {
		let data = [] , color=[];
		if( dataRes && dataRes.length ) {
			dataRes.forEach( item => {
				data.push( { value: item.doc_count, name: item.key, spendTotal: item?.spendTotal, color: this.msmeStatusColor[item.key], percentage: item?.spendPercentage || 0 } );
				color.push( this.msmeStatusColor[item.key] )
			} )
		}

		const generateChartOptions = ( data, color, toTitleCasePipe?, decimal?  ) => {
			return {
				title: {
				show: false,
				text: 'Size Diversity',
				// subtext: 'Fake Data',
				left: 'left'
				},
				tooltip: {
					trigger: 'item',
					formatter: function(params) {
						const colorCircle = `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 5px;"></span>`;
						return `${colorCircle}${ toTitleCasePipe.transform(params.name) }: ${ ( decimal.transform( params.value, '1.0-0' )) }`;
					}
				},
				legend: {
					show: false,
					orient: 'vertical',
					left: 'left'
				},
				color: color,
				series: [
					{
						type: 'pie',
						radius: '75%',
						data: data,
						label: {
							show: true,
							position: 'outside',
							formatter: (params) => {
								return `${params.name ? this.toTitleCasePipe.transform(params.name): ''}: ${ params.value ? this.currencyPipe.transform( params.data.spendTotal, 'GBP', 'symbol', '1.0-0' ) : params.value } (${ decimal.transform( params.data.percentage, '1.0-2' )}%)`;
							},
							fontSize: 12,
							fontWeight: 'bold'
						},
					}
				]
			}
		}

		this.optionForGraph[optionFor] = generateChartOptions(data, color, this.toTitleCasePipe, this.decimalPipe);
		
	}


	gotToSearchPage( data, filter ) {

		const listValues = data.data?.key || data.data?.name;

		if(!['ppcCategoryCount', 'msdukCertification'].includes( data.key ) && ['Mission Spectrum', 'Segmentation by Ownership'].includes(filter) && !['Credit Risk Bands', 'Public Sector Spent'].includes(filter) ){
			this.globalFilterDataObject['filters'] = [];
			this.globalFilterDataObject['filters'].push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  }, { chip_group: filter, label: filter, chip_values: [data.value.filterName] } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.globalFilterDataObject['filters']), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'],  hideStatsButton: true } }));
	
			window.open( urlStr, '_blank' );
		} else if( filter == 'MSME Classification' ) {

			this.globalFilterDataObject['filters'] = [];
			this.globalFilterDataObject['filters'].push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  }, { chip_group: 'MSME Classification', chip_values: [ data.data?.name ] } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.globalFilterDataObject['filters']), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
	
			window.open( urlStr, '_blank' );
		} else if ( filter == 'Credit Risk Bands' ){

			this.globalFilterDataObject['filters'] = [];
			this.globalFilterDataObject['filters'].push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  }, {chip_group: 'Bands', chip_values: [ listValues ], label: "Credit Risk Bands" } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.globalFilterDataObject['filters']), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
	
			window.open( urlStr, '_blank' ); 
        } else if ( filter == 'Public Sector Spent' && data?.doc_count > 0 ) {

			this.globalFilterDataObject['filters'] = [];
			this.globalFilterDataObject['filters'].push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies', data?.outputLabel], "preferenceOperator": [{"dormant_status": "include"}, data?.preferenceOperator]  } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.globalFilterDataObject['filters']), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
			window.open( urlStr, '_blank' ); 
		}
	}

	gotToComapnySearch( preferenceValue, preferenceOperartor ) {

		this.globalFilterDataObject['filters'] = [];

		this.globalFilterDataObject['filters'].push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', label: 'Preferences', chip_values: ['Include dormant companies', preferenceValue], "preferenceOperator": [{"dormant_status": "include"}, preferenceOperartor]  } );

		let urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.globalFilterDataObject['filters']), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
		window.open( urlStr, '_blank' ); 

	}

	async updateTableAfterPagination(event, cardLabel?) {
		// this.pageSize = event.pageSize;
		// this.startAfetr = event.startAfter;
		// this.sortOn = event.sortOn;
		this.sharedLoaderService.showLoader();
		this.filterSearchArray = event.filterSearchArray;
		if ( event.reset ) {
			this.diversitySpendsTableInformation(this.selectlist);
			return;
		} else if (event.search ){
			this.diversitySpendsTableInformation(this.selectlist);
			return;
		}

		if (event && event.isDiversityReset) {
			this.clickedBusiness = '';
		}

		if (cardLabel) {
			this.clickedBusiness = cardLabel;
		}

		if (this.clickedBusiness != '') {
			cardLabel = this.clickedBusiness;
		}

		this.diversityIndexFilteredDataValue = JSON.parse(JSON.stringify(this.allDiversityInclusionTableData));

		if (event && event.sortOn && event.sortOn.length) {

			this.diversityIndexFilteredDataValue = await this.sortTableData(this.diversityIndexFilteredDataValue, event.sortOn);

		}

		if (cardLabel) {

			this.diversityIndexFilteredDataValue = await this.filterCertifiedCompany(this.diversityIndexFilteredDataValue, cardLabel);

		}

		this.searchTotalCount = this.diversityIndexFilteredDataValue.length;

		from(this.diversityIndexFilteredDataValue).pipe(
			skip(event && event.startAfter ? event.startAfter : 0),
			take(event && event.pageSize ? event.pageSize : 25),
			toArray()
		)
			.subscribe(data => this.diversityIndexDataValue = data);

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 2000);

	}

	// filterTableData(inputData, filterArgs): Array<any> {

	// 	let outputData = [];

	// 	for (let filter of filterArgs) {

	// 		outputData = outputData.length ? outputData : inputData;

	// 		outputData = outputData.filter(val => val[filter.field].toString().toLowerCase().includes(filter.value.toString().toLowerCase()));

	// 	}

	// 	return outputData;

	// }

	sortTableData(inputData, sortArgs) {

		let outputData = [];

		const [ firstIndxStr, ...restStr ] = ( Object.keys( sortArgs[0] )[0] ).split(' ');
		let dataKey = firstIndxStr.toLowerCase() + restStr.join('');
		dataKey = dataKey == 'companyStatus' ? 'company_status' : dataKey; 
		let dataSortType = Object.values(sortArgs[0])[0];

		outputData = inputData.sort((a, b) => {
			if ( dataSortType == 'asc' ) {
				if ( typeof a[dataKey] == 'number' ) {
					return a[dataKey] - b[dataKey];
				}
				return a[dataKey] ? a[dataKey].toString().localeCompare( b[dataKey] ) : '';
			} else {
				if ( typeof a[dataKey] == 'number' ) {
					return b[dataKey] - a[dataKey];
				}
				return b[dataKey] ? b[dataKey].toString().localeCompare( a[dataKey] ) : '';
			}
		});

		return outputData;

	}

	updateClickInChart( event, filterCriteria ){
		this.gotToSearchPage( event, filterCriteria )
	}

	preventDefaultSort() {
		return 0;
	}

	filterCertifiedCompany(inputData, labelArgs) {

		let outputData = [];

		let companyCertifiedKey: string = '';

		if (labelArgs == 'Ethnic Minority Business') {
			companyCertifiedKey = 'is_ethnic_minority'
		} else if (labelArgs == 'Female Owned Business') {
			companyCertifiedKey = 'female_founded';
		} else if (labelArgs == 'MSDUK Certified Business') {
			companyCertifiedKey = 'msduk_certification';
		} else if (labelArgs == 'B Corp Certified Business') {
			companyCertifiedKey = 'bcorp_certification';
		} else if (labelArgs == 'VCSE Category') {
			companyCertifiedKey = 'vcseCategory';
		}

		outputData = inputData.filter(data => ['is_ethnic_minority', 'female_founded', 'vcseCategory'].includes(companyCertifiedKey) ? data[companyCertifiedKey] == 'yes' : data[companyCertifiedKey]);

		return outputData;

	}

	diversityInclusionSaveList() {
		let queryParam = [ { key: 'pageName', value: this.keyPreparationObj[this.routerUrl].thisPage } ];

		this.globalServerCommunicate.globalServerRequestCall('get', 'DG_API', 'diversityCalculationList', undefined, undefined, queryParam).subscribe({
			next: (res) => {

				if (res.status === 200) {
					this.diversitySaveList = res.body.result;
					this.selectlist = this.diversitySaveList?.[0] || undefined;
					this.getDiversityIndexdData(this.selectlist);
					this.diversitySpendsTableInformation(this.selectlist);
					this.newListId = res.body.result[0]
				}

			},
			error: (err) => {
				this.sharedLoaderService.hideLoader();
				console.error(err);
			}
		})

	}

	diversitySpendsTableInformation( selectList ) { 
		// this.sharedLoaderService.showLoader();
		this.diversityIndexDataValue = [];

		if ( selectList ) {
			this.globalFilterDataObject['listId'] = selectList['_id'];
			this.globalFilterDataObject['pageName'] = selectList['pageName'];
			this.globalFilterDataObject['filters'] = this.filterSearchArray ? this.filterSearchArray : [];
			this.globalFilterDataObject['listName'] = selectList['listName'];
			this.globalFilterDataObject['filterName'] = selectList['filterName'];
		}

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', this.keyPreparationObj[this.routerUrl].fetchTableData, this.globalFilterDataObject ).subscribe( {
			next: (res) => {
				this.allDiversityInclusionTableData = res.body.result?.data;

				this.allDiversityInclusionTableData.map( diversityinclusion => {
					if ( diversityinclusion.hasOwnProperty('colSupplierNumber') ) {
						diversityinclusion['colSupplierNumber'] = isNaN( +diversityinclusion['colSupplierNumber'] ) ? diversityinclusion['colSupplierNumber'] : +diversityinclusion['colSupplierNumber'];
					}
					return diversityinclusion;
				} );

				this.searchTotalCount = res.body.result.totalResults || 0;

				if (this.allDiversityInclusionTableData.length) {
					from(this.allDiversityInclusionTableData).pipe(take(25), toArray()).subscribe(data => this.diversityIndexDataValue = data);
				}

				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 100); 
			}, 
			error: (err) =>{
				console.log(err);
				// this.sharedLoaderService.hideLoader();
			}
		});
	}

	onSelectedFile( event ) {

		this.resetDisableOptions();
		const file = event.files[0];

		if (!(CustomUtils.isNullOrUndefined( file ))) {

			this.selectedListName = file?.name;
			this.selectedFile = file;

			const fileReader = new FileReader();

			fileReader.onload = (e) => {

				const holdCSV = fileReader.result as string;
				const lines = holdCSV.split('\n');
				const firstTenLines = lines.slice(0, 10).join('\n');

				this.preparedObjectForHeader( firstTenLines );
				this.showDialog = true;
				this.fileUpload.files = [];

			}

			fileReader.readAsText( file );

		}		

	}

	preparedObjectForHeader( inputString ) {

		let lines = []
		if ( inputString.includes( '\r' ) ) {
			lines = inputString.split("\r\n");
		} else {
			lines = inputString.split("\n");
		}
		this.headers = lines.shift().split(",");

		
		this.headerDropdownNgModel = [];
		this.columnData = [];

		this.headers.map( val => {
			this.headerDropdownNgModel.push( { header: val, ngModel: '' } )
		} )

		lines.slice(0,10).forEach(line => {
			const test = line.split(",").filter( val => !val.includes( '\"' ) );

			if ( test.length == this.headers.length ) {
				this.columnData.push( test )
			}

		});

	}

	updateInactivityForFinancialKeyDropdown( seletedOptionItem ) {

		if ( seletedOptionItem.ngModel == 'None' ) {
			setTimeout( () => {
				seletedOptionItem.ngModel = '';
			}, 10 )
		}
		const selctedHeaderArray = this.headerDropdownNgModel.map( val => val.ngModel ).filter( item => item != '' && item != 'None' );

		this.resetDisableOptions( selctedHeaderArray );

	}

	resetDisableOptions( headerArr: Array<any> = [] ) {

		this.dropdownOptionsArray.map( item => {
			if ( headerArr.includes( item.value ) ) {
				setTimeout(() => {
					item.inactive = true;
				}, 100);
			} else {
				item.inactive = false;
			}
		} )

	}

	setHeaders() {
		
		let obj = {};

		this.headerDropdownNgModel.forEach(item => {
			if ( item.ngModel ) {
				obj[item.header] = item.ngModel;
			}
		});
		const jsonString: string  = JSON.stringify(obj, null, 2) ;
		let userId: string = this.userAuthService?.getUserInfo('dbID') as string;

		let headerMappingFormData = new FormData();
		headerMappingFormData.append( 'mappings', jsonString );
		headerMappingFormData.append( 'userId', userId );
		headerMappingFormData.append( 'listName', this.selectedListName );
		headerMappingFormData.append( 'file', this.selectedFile );
		headerMappingFormData.append( 'pageName', this.keyPreparationObj[this.routerUrl].thisPage );

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'upload_diversity_mapping_file', headerMappingFormData ).subscribe({

			next: ( res ) => {
				this.showDialog = false;
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: res?.body?.message });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			},
			error: ( err ) => {		
				this.msgs = [];
				this.msgs.push({ severity: 'error', summary: err?.error?.message });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		})

	}

	// =======Report Section ========

	async downloadReport() {
		this.isProcessing = true;
		this.mapCount();
		await this.makePdfService.latestReport( this.updatedPageConfigs, this.routerUrl );
		setTimeout( () => this.isProcessing = false, 2000 )
	}

	formatValue(val: number, poundValue?: number): string {
		const wholeNumber = Math.floor(poundValue);
		const formatted = wholeNumber.toLocaleString('en-UK');
		const formattedVal = val.toLocaleString('en-UK');
		return val > 0 ? `${formattedVal} (£${formatted})` : '0';
	}

	mapCount() {
		this.updatedPageConfigs = this.pageConfigs.map((config) => {
			const countEntry = this.counts[config.key];
			
			if (countEntry && typeof countEntry.value === 'number') {
				return {
					...config,
					value: this.formatValue(countEntry.value, countEntry.totalSpent),
				};
			}
			
			return config;
		});
	}
	

}