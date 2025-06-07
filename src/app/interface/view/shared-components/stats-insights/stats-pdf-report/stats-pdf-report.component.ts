import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { ListPageName } from '../../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
	selector: 'dg-stats-pdf-report',
	templateUrl: './stats-pdf-report.component.html',
	styleUrls: ['./stats-pdf-report.component.scss'],
	providers: [TitleCasePipe, CurrencyPipe, DatePipe]
})

/**
 * @Rule - For parameter URL in Stats PDF, use only encodeURIComponent method.
 */

export class StatsPdfReportComponent implements OnInit {

	@Output() messageCommunicator = new EventEmitter<any>();
	@Output() displayMessage = new EventEmitter<any>();

	@Input() statsReportDataParam: any;
	@Input() statsCriteriaValues: any;
	@Input() keyForFinancial: object;

	innerTableBorderColor = ['#d8d8d8', '#d8d8d8', '#d8d8d8', '#d8d8d8'];

	subscribedPlanModal: any = subscribedPlan;
	codec = new HttpUrlEncodingCodec();
	constantMessages: any = UserInteractionMessages;
	currentPlan: unknown;
	// reportLoading: boolean = false;
	directorAgeCondition: boolean = false;
	enterpriseReportButton: boolean = false;
	showCheckBoxCard: boolean = false;
	reportGeneratedDate: Date = new Date();
	pdfLimit: number;
	monthsEnum: any = Month;
    checkDgBranding: string = 'DG Branding';
	customBrandingUrlStore: string = '';
	// pageNameListId = {};
	
	outputPageName: string = '';
	listId: string;
	inputPageName: string = '';
	queryParamChipData: FilterDataTypes[] = [];
	msgs: any[];
	selectedGlobalCurrency: string = 'GBP';
	selectedGlobalCountry: string = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
	pdfStatsData: object = {};

	tableContentSections: { sectionHeader: string, dataKey: string, payloadKey?: string, countryAccess?: Array<string>}[] = [
		{ sectionHeader: 'Region Wise Stats', dataKey: 'region', countryAccess: [ 'uk', 'ie' ] },
		// { sectionHeader: 'MSME Tags', dataKey: 'msmeStatus' },
		{ sectionHeader: 'Risk Analysis', dataKey: 'riskChartArray', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Other Stats', dataKey: 'otherMiscArray', countryAccess: [ 'uk', 'ie' ]  },

		// { sectionHeader: 'Turnover ( £ )', dataKey: 'financialTurnoversArray' },
		// { sectionHeader: 'Turnover (Include Estimated Turnover)', dataKey: 'financialTurnoversPlusEstimatedTurnoversArray' },
		// { sectionHeader: 'Turnover Growth 3 years', dataKey: 'turnoverGrowth3YearsInfo' },
		// { sectionHeader: 'Net Worth Growth 3 years', dataKey: 'netWorthGrowth3YearsInfo' },
		// { sectionHeader: 'Trade Debtors Growth 3 years', dataKey: 'tradeDebtorsGrowth3YearsInfo' 
		
		{ sectionHeader: 'Turnover ( £ )', dataKey: 'turnoverArray', payloadKey: 'turnover', countryAccess: [ 'uk' ]  },
		{ sectionHeader: 'Turnover ( € )', dataKey: 'turnoverArray', payloadKey: 'turnover', countryAccess: [ 'ie' ]  },
		{ sectionHeader: 'Turnover Growth 1 Year', dataKey: 'turnoverGrowth1YearInfo', payloadKey: 'turnover', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Turnover Growth 3 Years', dataKey: 'turnoverGrowth3YearsInfo', payloadKey: 'turnover', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Turnover Growth 5 Years', dataKey: 'turnoverGrowth5YearsInfo', payloadKey: 'turnover', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Turnover (Include Estimated Turnover)', dataKey: 'turnoverPlusEstimatedTurnoverArray', payloadKey: 'turnover', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Net Worth', dataKey: 'netWorthArray', payloadKey: 'netWorth', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Net Worth Growth 1 Year', dataKey: 'netWorthGrowth1YearInfo', payloadKey: 'net_worth', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Net Worth Growth 3 Years', dataKey: 'netWorthGrowth3YearsInfo', payloadKey: 'net_worth', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Net Worth Growth 5 Years', dataKey: 'netWorthGrowth5YearsInfo', payloadKey: 'net_worth', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Profit Before Tax', dataKey: 'profitBeforeTaxArray', payloadKey: 'profitBeforeTax' , countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Profit Before Tax Growth 1 Year', dataKey: 'profitBeforeTaxGrowth1YearInfo', payloadKey: 'profit_before_tax', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Profit Before Tax Growth 3 Years', dataKey: 'profitBeforeTaxGrowth3YearsInfo', payloadKey: 'profit_before_tax', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Profit Before Tax Growth 5 Years', dataKey: 'profitBeforeTaxGrowth5YearsInfo', payloadKey: 'profit_before_tax', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Total Assets', dataKey: 'totalAssetsArray', payloadKey: 'totalAssets', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Total Assets Growth 1 Year', dataKey: 'totalAssetsGrowth1YearInfo', payloadKey: 'total_assets', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Total Assets Growth 3 Years', dataKey: 'totalAssetsGrowth3YearsInfo', payloadKey: 'total_assets', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Total Assets Growth 5 Years', dataKey: 'totalAssetsGrowth5YearsInfo', payloadKey: 'total_assets', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Total Liabilities', dataKey: 'totalLiabilitiesArray', payloadKey: 'totalLiabilities', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Total Liabilities Growth 1 Year', dataKey: 'totalLiabilitiesGrowth1YearInfo', payloadKey: 'total_liabilities', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Total Liabilities Growth 3 Years', dataKey: 'totalLiabilitiesGrowth3YearsInfo', payloadKey: 'total_liabilities', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Total Liabilities Growth 5 Years', dataKey: 'totalLiabilitiesGrowth5YearsInfo', payloadKey: 'total_liabilities', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Trade Debtors', dataKey: 'tradeDebtorsArray', payloadKey: 'tradeDebtors', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Trade Debtors Growth 1 Year', dataKey: 'tradeDebtorsGrowth1YearInfo', payloadKey: 'trade_debtors', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Trade Debtors Growth 3 Years', dataKey: 'tradeDebtorsGrowth3YearsInfo', payloadKey: 'trade_debtors', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Trade Debtors Growth 5 Years', dataKey: 'tradeDebtorsGrowth5YearsInfo', payloadKey: 'trade_debtors', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Industry Tags', dataKey: 'standard_industry_tag', payloadKey: '', countryAccess: [ 'uk', 'ie' ]  },
		// { sectionHeader: 'Special Tags', dataKey: 'special_industry_tag', payloadKey: '', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'SIC Industry', dataKey: 'industry', payloadKey: '', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Number of Employees', dataKey: 'noOfEmployeesArray', payloadKey: '', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Number of Employees Growth 1 Year', dataKey: 'numberOfEmployeesGrowth1YearInfo', payloadKey: 'number_of_employees', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Number of Employees Growth 3 Years', dataKey: 'numberOfEmployeesGrowth3YearsInfo', payloadKey: 'number_of_employees', countryAccess: [ 'uk', 'ie' ]  },
		{ sectionHeader: 'Number of Employees Growth 5 Years', dataKey: 'numberOfEmployeesGrowth5YearsInfo', payloadKey: 'number_of_employees', countryAccess: [ 'uk', 'ie' ]  },

		{ sectionHeader: 'Companies by Age', dataKey: 'companyIncorporationInfo', payloadKey: '', countryAccess: [ 'uk', 'ie' ] }

	];

	financialTurnoversArrayData: Array<{ field: string, label: string, value: Object, count: number, count_percentage: number }> = [
		// { field: 'negativeTurnover', label: 'Zero Value', value: { greaterThan: undefined, lessThan: '0'}, count: 0, count_percentage: 0 },
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan1B', label: 'Greater Than 1B', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 },
		{ field: 'not specified', label: 'Not Specified', value: { greaterThan: undefined, lessThan: 'not specified' }, count: 0, count_percentage: 0 }
	];

	turnoverGrowth3Year: {field: string, label: string, value: Object, count: number, count_percentage: number }[] = [
		{ field: 'less_than_25', label: 'Less Than 25', value: { greaterThan: undefined, lessThan: '25' }, count: 0, count_percentage: 0 },
		{ field: '26-50', label: '26 to 50', value: { greaterThan: '26', lessThan: '50' }, count: 0, count_percentage: 0 },
		{ field: '51-75', label: '51 to 75', value: { greaterThan: '51', lessThan: '75' }, count: 0, count_percentage: 0 },
		{ field: '76-100', label: '75 to 100', value: { greaterThan: '76', lessThan: '100' }, count: 0, count_percentage: 0 },
		{ field: 'above_100', label: '100+', value: { greaterThan: '101', lessThan: '' }, count: 0, count_percentage: 0 },
		{ field: "not specified", label: 'Not Specified', value: { greaterThan: undefined, lessThan: 'not specified' }, count: 0, count_percentage: 0 }
	];

	encorporationDate:  Array<{ field: string, label: string, count: number, count_percentage: number, rangeFrom: string, rangeTo: string }> = [
		{ field: '0-2', label: '0 to 2', count: 0, count_percentage: 0, rangeFrom: '0', rangeTo: '2' },
		{ field: '2-5', label: '2 to 5', count: 0, count_percentage: 0, rangeFrom: '2', rangeTo: '5' },
		{ field: '5-10', label: '5 to 10', count: 0, count_percentage: 0 , rangeFrom: '5', rangeTo: '10'},
		{ field: '10+', label: '10+', count: 0, count_percentage: 0, rangeFrom: '10', rangeTo: '' },
		{ field: 'not specified', label: 'Not Specified', count: 0, count_percentage: 0, rangeFrom: 'not specified', rangeTo: '' }
	];

	exportAmount: {field: string, label: string, value: Object, count: number, count_percentage: number }[] = [
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: '1Bto10B', label: '1B to 10B', value: { greaterThan: '1000000000', lessThan: '10000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan10B', label: 'Greater Than 10B', value: { greaterThan: '10000000000', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	noOfEmployeesArrayData: Array<{ field: string, label: string, value: Object, count: number, count_percentage: number }> = [
		{ field: '1-2', label: '1 to 2', value: { greaterThan: '1', lessThan: '2' }, count: 0, count_percentage: 0 },
		{ field: '3-5', label: '3 to 5', value: { greaterThan: '3', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '6-10', label: '6 to 10', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '11-25', label: '11 to 25', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '26-50', label: '26 to 50', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '51-100', label: '51 to 100', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '101-250', label: '101 to 250', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: '251-500', label: '251 to 500', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 },
		{ field: '501-1000', label: '501 to 1000', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 },
		{ field: '1000+', label: '1000+', value: { greaterThan: '1000000000', lessThan: undefined }, count: 9, count_percentage: 90 },
		{ field: 'not specified', label: 'Not Specified', value: { greaterThan: 'not specified', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	tradeDebtorsGrowth3Years: {field: string, label: string, value?: Object, count?: number, count_percentage?: number }[] = [
		{ field: 'not specified', label: 'Not Specified', value: { greaterThan: '', lessThan: 'not specified' }, count: 0, count_percentage: 0 },
		{ field: 'less_than_25', label: 'Less Than 25', value: { greaterThan: '', lessThan: '25' }, count: 0, count_percentage: 0 },
		{ field: '26-50', label: '26 to 50', value: { greaterThan: '26', lessThan: '50' }, count: 0, count_percentage: 0 },
		{ field: '51-75', label: '51 to 75', value: { greaterThan: '51', lessThan: '75' }, count: 0, count_percentage: 0 },
		{ field: '76-100', label: '76 to 100', value: { greaterThan: '76', lessThan: '100' }, count: 0, count_percentage: 0 },
		{ field: 'above_100', label: '100+', value: { greaterThan: '101', lessThan: '' }, count: 0, count_percentage: 0 },
	];

	netWorthGrowth3Years: {field: string, label: string, value?: Object, count?: number, count_percentage?: number }[] = [
		{ field: 'not specified', label: 'Not Specified', value: { greaterThan: '', lessThan: 'not specified' }, count: 0, count_percentage: 0 },
		{ field: 'less_than_25', label: 'Less Than 25', value: { greaterThan: '', lessThan: '25' }, count: 0, count_percentage: 0 },
		{ field: '26-50', label: '26 to 50', value: { greaterThan: '26', lessThan: '50' }, count: 0, count_percentage: 0 },
		{ field: '51-75', label: '51 to 75', value: { greaterThan: '51', lessThan: '75' }, count: 0, count_percentage: 0 },
		{ field: '76-100', label: '76 to 100', value: { greaterThan: '76', lessThan: '100' }, count: 0, count_percentage: 0 },
		{ field: 'above_100', label: '100+', value: { greaterThan: '101', lessThan: '' }, count: 0, count_percentage: 0 },
	];

	otherMiscArrayData: { field: string, label: string, count: number, count_percentage: number }[] = [
		{ field: "newCCJ", label: "New CCJ's", count: 0, count_percentage: 0 },
		{ field: "ccj", label: "All CCJ's", count: 0, count_percentage: 0 },
		{ field: "patentData", label: "Companies With Patent", count: 0, count_percentage: 0 },
		{ field: "innovateData", label: "Companies with Grants", count: 0, count_percentage: 0 },
		{ field: "writeOff", label: "Write-offs", count: 0, count_percentage: 0 },
		{ field: "landCoporateDetails", label: "Companies Land Ownerships", count: 0, count_percentage: 0 },
		{ field: "shareholding", label: "Companies with Shareholdings", count: 0, count_percentage: 0 },
		{ field: "ecsData", label: "Environment Agency Registered", count: 0, count_percentage: 0 },
		{ field: "companWithCharges", label: "Company With Charges", count: 0, count_percentage: 0 },
		// { field: 'not specified', label: 'Not Specified', count: 0, count_percentage: 0 },
	];

	industryListData: Array<object> = [
		{ label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - mining and quarrying', value: 'mining and quarrying' },
		{ label: 'C - manufacturing', value: 'manufacturing' },
		{ label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - construction', value: 'construction' },
		{ label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - transportation and storage', value: 'transportation and storage' },
		{ label: 'I - accommodation and food service activities', value: 'accommodation and food service activities' },
		{ label: 'J - information and communication', value: 'information and communication' },
		{ label: 'K - financial and insurance activities', value: 'financial and insurance activities' },
		{ label: 'L - real estate activities', value: 'real estate activities' },
		{ label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - administrative and support service activities', value: 'administrative and support service activities' },
		{ label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - education', value: 'education' },
		{ label: 'Q - human health and social work activities', value: 'human health and social work activities' },
		{ label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - other service activities', value: 'other service activities' },
		{ label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies' },
		// { label: 'Not Specified', value: 'not specified' }
	];

	standardIndustryTags: { field: string, label: string, count: number, count_percentage: number }[] = [];
	specialIndustryTags: { field: string, label: string, count: number, count_percentage: number }[] = [];

	constructor(
		private userAuthService: UserAuthService,
		private toTitleCasePipe: TitleCasePipe,
		private toCurrencyPipe: CurrencyPipe,
		private toDatePipe: DatePipe,
		private activeRoute: ActivatedRoute,
		public toNumberSuffix: NumberSuffixPipe,
		private decimalPipe: DecimalPipe,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.tableContentSections = this.tableContentSections.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
		/*
		if( this.activeRoute.snapshot.queryParams['pageName'] || this.activeRoute.snapshot.queryParams['listId'] ) {
			this.pageNameListId = { pageName: this.activeRoute.snapshot.queryParams['pageName'] ? this.activeRoute.snapshot.queryParams['pageName'] : '', listId: this.activeRoute.snapshot.queryParams['cListId'] ? this.activeRoute.snapshot.queryParams['cListId'] : '' }
		}
		*/

		this.queryParamChipData = this.activeRoute.snapshot?.queryParams['chipData'] ? JSON.parse( this.activeRoute.snapshot?.queryParams['chipData'] ) : [];
		this.listId = this.activeRoute.snapshot.queryParams['cListId'] != undefined ? this.activeRoute.snapshot.queryParams['cListId'] : '';
		this.inputPageName = this.activeRoute.snapshot.queryParams['listPageName'] ? this.activeRoute.snapshot.queryParams['listPageName'] : '';

		switch ( this.inputPageName.toLowerCase() ) {
			case ListPageName.company.inputPage.toLowerCase():
				this.outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.inputPage.toLowerCase():
				this.outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.inputPage.toLowerCase():
				this.outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.inputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;

			case ListPageName.company.outputPage.toLowerCase():
				this.outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.outputPage.toLowerCase():
				this.outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.outputPage.toLowerCase():
				this.outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.outputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;
			case ListPageName.accountSearch.inputPage.toLowerCase():
				this.outputPageName = ListPageName.accountSearch.outputPage;
				break;
			case ListPageName.accountSearch.outputPage.toLowerCase():
				this.outputPageName = ListPageName.accountSearch.outputPage;
				break;
			case ListPageName.companyDescription.inputPage.toLowerCase():
			this.outputPageName = ListPageName.companyDescription.outputPage;
			break;
			case ListPageName.companyDescription.outputPage.toLowerCase():
				this.outputPageName = ListPageName.companyDescription.outputPage;
				break;
			case ListPageName.diversityCalculation.outputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityCalculation.outputPage;
				break;
					
			case ListPageName.businessCollaborators.outputPage.replace(/\s/g, '').toLowerCase():
				this.outputPageName = ListPageName.businessCollaborators.outputPage;
				break;

			case ListPageName.procurementPartners.outputPage.replace(/\s/g, '').toLowerCase():
				this.outputPageName = ListPageName.procurementPartners.outputPage;
				break;

			case ListPageName.fiscalHoldings.outputPage.replace(/\s/g, '').toLowerCase():
				this.outputPageName = ListPageName.fiscalHoldings.outputPage;
				break;

			case ListPageName.potentialLeads.outputPage.replace(/\s/g, '').toLowerCase():
				this.outputPageName = ListPageName.potentialLeads.outputPage;
				break;
		
			default:
				this.outputPageName = '';
				break;
		}
	}

	checkPdfReportLimit() {

		let msgs = this.constantMessages['successMessage']['directorReportSuccess'] + '.';
		let obj = {
			msgs: msgs,
			status: "success"
		}
		this.enterpriseReportButton = false;
		this.downloadPDF(obj);
	}

	async downloadPDF(obj) {

		delete this.statsReportDataParam['financialTurnoversArray'];
		delete this.statsReportDataParam['financialTurnoversPlusEstimatedTurnoversArray'];
		delete this.statsReportDataParam['turnoverGrowth1YearInfo'];
		delete this.statsReportDataParam['turnoverGrowth3YearsInfo'];
		delete this.statsReportDataParam['turnoverGrowth5YearsInfo'];
		delete this.statsReportDataParam['netWorthGrowth3YearsInfo'];
		delete this.statsReportDataParam['tradeDebtorsGrowth3YearsInfo'];

		this.pdfStatsData = { ...this.statsReportDataParam, ...this.keyForFinancial };

		let columnHeader = Array(this.statsReportDataParam?.companyCounts?.length).fill('auto');
		let colorObj = {'in liquidation': '#e4790f', 'live': '#009685'};
		let tableData = [];
		for(let i=0;i<this.statsReportDataParam?.companyCounts?.length;i++){
			let pipe = i+1 < this.statsReportDataParam.companyCounts.length ? '|' : '';
			let formattedObj = {text: `${this.commonService.camelCaseToTitleCaseStr(this.statsReportDataParam.companyCounts[i].key)}: ${this.decimalPipe.transform( ( this.statsReportDataParam.companyCounts[i].doc_count ), '1.0-0' )} ${pipe}`, alignment: 'center', color: colorObj.hasOwnProperty(this.statsReportDataParam.companyCounts[i].key) ? colorObj[this.statsReportDataParam.companyCounts[i].key] : '#b00020', fontSize: 8, fontFamily: 'Roboto Helvetica Neue sans-serif'};
			tableData.push(formattedObj);
		};
		const footerImg = this.commonService.convertImageToDataUrl('dg_logo_new.png')
		// const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...';
		const base64Image = 'data:image/png;base64,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';

		// this.reportLoading = true;
		// this.sharedLoaderService.showLoader();

		// Data Object For PDF
		let docDefinition = {
			pageSize: 'A4',
			pageMargins: [10, 10, 10, 26],
			pageBorder: [true, true, true, true],
			background: function (currentPage, pageSize) {
				return {
					canvas: [
						{
							type: 'rect',
							x: 0, y: 0,
							w: pageSize.width,
							h: pageSize.height,
							color: '#fff',
						}
					]
				};
			},
			content: [
				{
					layout: {
						defaultBorder: false
					},
					table: {
						headerRows: 0,
						widths: ['*'],
						heights: ['*'],
						body: [
							[
								{
									image: this.checkDgBranding == 'Custom Branding' ? this.customBrandingUrlStore : await this.commonService.convertImageToDataUrl( 'statsPdfCoverPage.jpg' ),
									width: 560,
									height: 795,
									alignment: 'center'
								}
							]
						]
					}
				},
				{
					layout: {
						defaultBorder: false
					},
					table: {
						headerRows: 0,
						widths: ['*'],
						body: [
							[
								{
									image: await this.commonService.convertImageToDataUrl( 'dgLogoPdfDark.png' ),
									width: 180,
									margin: [0, 15, 0, 10],
									alignment: 'center'
								}
							]
						]
					}
				},
				{
					text: `Report Generated Date: ${this.toDatePipe.transform(this.reportGeneratedDate, 'dd-MM-yyyy, HH:mm')}`,
					fontSize: 7,
					alignment: 'right',
					margin: [0, -20, 0, 10],
				},
				{
					text: `The Statistics are based on below companies.`,
					fontSize: 10,
					alignment: 'left',
					// margin: [0, -20, 0, 10],
				},
				{
					layout: {	
						defaultBorder: false,
						paddingTop: function (i, node) { return 8; },
						paddingLeft: function (i, node) { return 0; }
					},
					table: {
						headerRows: 0,
						widths: columnHeader,
						body: [
							tableData
						]
					}
				},
				{
					text: `Total Turnover & Average Turnover are based on ${ this.decimalPipe.transform( this.statsReportDataParam.turnoverCompanies, '1.0-0') } companies.`,
					fontSize: 8,
					alignment: 'left',
					margin: [0, 4, 0, 0]
				},
				{
					layout: 'noBorders',
					table: {
						headerRows: 0,
						widths: ['*', 2, '*'],
						body: this.contentTableBody()
					}
				}
			],
			styles: {
				headingStyle: {
					fontSize: 10,
					color: '#fff'
				},
				headingStyle2: {
					fontSize: 10,
					color: '#1f4599'
				},
				subHeadingStyle: {
					fontSize: 8,
					bold: true,
					color: '#1f4599'
				},
				subHeadStyle: {
					fontSize: 8,
					lineHeight: 1.3,
					color: '#505050'
				},
				innerTableHeaderStyle: {
					fillColor: '#D3D3D3',
					fontSize: 6,
					color: '#333',
					bold: true
				},
				paraTextStyle: {
					fontSize: 6,
					lineHeight: 1.3,
					color: '#505050'
				},
				disclaimerTextStyle: {
					fontSize: 7,
					lineHeight: 1.3,
					color: '#0000'
				},
				msmeStyle: {
					 margin: [5, 5, 5, 5],
					 alignment: 'center',
					 color: '#fff'
				}
			},
			pageBreakBefore: (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) => {
				let nodeHasTable = currentNode.table,
					tableRowsPositionOnPageEnd = currentNode.startPosition.top > currentNode.startPosition.pageInnerHeight - 40;

				return nodeHasTable && tableRowsPositionOnPageEnd;
			},
			footer: function(currentPage, pageCount) {
				if (currentPage > 1) { 
					return [
						{
							width: 600,
							// height: 32,
							image: base64Image,
							alignment: 'center',
						},
					];
				} else {
					return []
				}
			},
		};
		// End Data Object For PDF

		let fileName, pdfFile;
		fileName = "DataGardener_Business_Statistics_" + this.formatDate(this.reportGeneratedDate) +'_'  + '_Report.pdf';
		// fileName = "DG_Business_Statistics_" + this.formatDate(this.reportGeneratedDate) +'_' + new Date().getTime() + '_Report.pdf';

		// return pdfMake.createPdf(docDefinition).open();
		const pdfDocGenerator = pdfMake.createPdf(docDefinition);
		this.sharedLoaderService.showLoader();

		pdfDocGenerator.getBase64((data) => {

			pdfFile = data;

			let pdfReportObj = {
				userId: this.userAuthService?.getUserInfo('dbID'),
				fileName: fileName,
				reportType: 'Business Statistics Report',
				pdfFile: pdfFile
			}

			this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_API', 'uploadPdfToS3', pdfReportObj).subscribe( res => {
				const binaryString = window.atob(pdfFile);
				const len = binaryString.length;
				const binaryArray = new Uint8Array(len);

				for (let i = 0; i < len; i++) {
					binaryArray[i] = binaryString.charCodeAt(i);
				}
				const blob = new Blob([binaryArray], { type: 'application/pdf' });
				const downloadLink = document.createElement('a');
				const url = window.URL.createObjectURL(blob);
				downloadLink.href = url;
				downloadLink.download = fileName;
			
				document.body.appendChild(downloadLink);
				downloadLink.click();
			
				document.body.removeChild(downloadLink);
				window.URL.revokeObjectURL(url);
			
				this.msgs = [];
				this.sharedLoaderService.hideLoader();
				this.msgs.push({ severity: 'success', summary: "Report Downloaded Successfully" });
				this.displayMessage.emit(this.msgs);
				setTimeout(() => {
					this.msgs = [];
					this.displayMessage.emit(this.msgs);
				}, 2000);
			});

		});

		this.messageCommunicator.emit(obj);
	}

	formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [day, month, year].join('-');
	}

	contentTableBody() {

		let contentbody: Array<any> = [],
		blankSpaceRow: Array<any> = [{ text: '', colSpan: 3, margin: [0, 0, 0, 0] }];
		
		contentbody.push( this.totalNumberTableBody() );

		if ( this.pdfStatsData?.['msmeStatus'] && this.pdfStatsData['msmeStatus'].length ) {
			contentbody.push( this.msmeTable() );
		}

		for ( let tableSection of this.tableContentSections ) {

			if ( this.pdfStatsData[ tableSection?.dataKey ] && this.pdfStatsData[ tableSection?.dataKey ].length ) {
				contentbody.push( blankSpaceRow );
				contentbody.push( this.tableBody( tableSection ) );
			}

		}

		for (let i = 0; i < 2; i++) {
			contentbody.push( blankSpaceRow );
		}

		let link;

		let pageName = {
			businessCollaborators: 'clients',
			procurementPartners: 'Suppliers',
			fiscalHoldings: 'Accounts',
		}

		if ( [ 'businessCollaborators', 'procurementPartners', 'fiscalHoldings', 'potentialLeads' ].includes(  this.outputPageName ) ) {
			link = `${window.location.origin}/workflow/${ pageName[ this.outputPageName ] }/stats-insights?cListId=${ this.listId }&listPageName=${this.outputPageName}`;
		} else {
			link = ( this.outputPageName && this.listId ) ? `${window.location.origin}/company-search/stats-insights?cListId=${ this.listId }&listPageName=${this.outputPageName}&chipData=${encodeURIComponent(JSON.stringify(this.queryParamChipData))}` : this.outputPageName ? `${window.location.origin}/company-search/stats-insights?listPageName=${this.outputPageName}&chipData=${encodeURIComponent(JSON.stringify(this.queryParamChipData))}` : `${window.location.origin}/company-search/stats-insights?chipData=${ encodeURIComponent(JSON.stringify(this.queryParamChipData))}`
		}

		contentbody.push([
			{ 
				text: 'View Stats In DataGardener',
				link : link,
				colSpan: 3,
				fontSize: 10,
				color: '#03a9f4',
				bold: true,
				decoration: 'underline',
				alignment: 'right',
			}
		]);
		
		if ( this.statsCriteriaValues && this.statsCriteriaValues.length ) {
			contentbody.push(this.selectectedCreteriaChipsValue());
		}

		return contentbody;
	}

	totalNumberTableBody() {

		let tableBodyArray: Array<any> = [];
		let tableBodyObj = {
			colSpan: 3,
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 5; },
				paddingRight: function (i, node) { return 5; }
			},
			fillColor: '#fff',
			table: {
				headerRows: 0,
				widths: ['*'],
				body: [
					[
						{
							layout: {
								
								paddingTop: function (i, node) { return 8; },
								paddingBottom: function (i, node) { return 8; },
							
							},
							table: {
								headerRows: 1,
								widths: [130, 130, 130, 130],
								body: this.createTotalNumberTableBasic()
							},
						}
					]
				]
			}
		}

		tableBodyArray.push(tableBodyObj);
		return tableBodyArray;
	}

	msmeTable() {

		let tableBodyContent = [], clmnWidth = [], msmeBody = [];
		let msmeData = this.pdfStatsData?.['msmeStatus'] || [];

		let msmeKeyColorCode = {
			'Micro': '#59ba9b',
			'Small': '#ffcc00',
			'Medium': '#ee9512',
			'Large Enterprise': '#e1b12c',
			'Unknown': '#aabbcc'
		}

		if ( msmeData.length ) {
			clmnWidth = Array( msmeData.length ).fill( 'auto' );

			for ( let msmeObj of msmeData ) {
				
				let text = msmeObj['key'] + ': ' + this.toCurrencyPipe.transform( msmeObj['doc_count'], '', '', '1.0-0');
				msmeBody.push( { text: text, fillColor: msmeKeyColorCode[ msmeObj['key'] ], style: 'msmeStyle', borderColor: ['#fff', '#fff', '#fff', '#fff'], link: this.goToMsmeData( msmeObj['key'] ) } );

			}

		}

		let tableBodyobj = {
			layout: {
				defaultBorder: false,
			},
			colSpan: 3,
			table: {
				headerRows: 0,
				width: [ '*' ],
				body: [
					[ { text: 'MSME Tags ', fontSize: 10, alignment: 'left' } ],
					[ 
						{ 
							layout: {
								defaultBorder: true,
								paddingLeft: function (i, node) { return 5; },
								paddingRight: function (i, node) { return 5; },
								paddingTop: function (i, node) { return 2; },
								paddingBottom: function (i, node) { return 2; },
								
								hLineWidth: function(i, node) {
								return (i === 0 || i === node.table.body.length) ? 0.1 : 5;
								},
								vLineWidth: function(i, node) {
									return (i === 0 || i === node.table.widths.length) ? 0.1 : 5;
								}
							},
							table: {
								widths: clmnWidth,
								body: [
									msmeBody
								]
							}
						} 
					]
				]
			}
		}

		tableBodyContent.push( tableBodyobj );
		return tableBodyContent;
	}

	goToMsmeData( selectedItemValue: string ) {

		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		let urlStr: string;

		navigateUrlParamObject = navigateUrlParamObject.filter(val => val.chip_group !== 'MSME Classification');
		navigateUrlParamObject.push(
			{
				chip_group: 'MSME Classification',
				chip_values: [ selectedItemValue ]
			}
		);

		

		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }`;
		}

		return urlStr;

	}

	totalNumberTableBodyForCard() {

		let tableBodyArray: Array<any> = [];
		let tableBodyObj = {
			colSpan: 3,
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 5; },
				paddingRight: function (i, node) { return 5; },
				paddingTop: function (i, node) { return 2; },
				paddingBottom: function (i, node) { return 2; }
			},
			fillColor: '#fff',
			table: {
				headerRows: 0,
				widths: ['*'],
				body: [
					[
						{
							layout: {
								
								paddingTop: function (i, node) { return 8; },
								paddingBottom: function (i, node) { return 8; },
							
							},
							table: {
								headerRows: 1,
								widths: [130, 130, 130, 130],
								body: this.createTotalNumberTableBasicSecondRow()
							},
						}
					]
				]
			}
		}

		tableBodyArray.push(tableBodyObj);
		return tableBodyArray;
	}

	createTotalNumberTableBasic() {

		let tableData: Array<any> = [
			[
				{ text: 'Total Turnover', fontSize: 12, color: '#fff', bold: true, fillColor: '#1AB394', borderColor: ['#fff', '#fff', '#fff', '#1AB394'], alignment: 'center'},
				{ text: 'Average Turnover', fontSize: 12, color: '#fff', bold: true, fillColor: '#0086d6', borderColor: ['#fff', '#fff', '#fff', '#0086d6'], alignment: 'center'},
				{ text: 'Total Employees', fontSize: 12, color: '#fff', bold: true, fillColor: '#5f52df', borderColor: ['#fff', '#fff', '#fff', '#5f52df'], alignment: 'center' },
				{ text: 'Average Employees', fontSize: 12, color: '#fff', bold: true, fillColor: '#1a89b3', borderColor: ['#fff', '#fff', '#fff', '#1a89b3'], alignment: 'center' },
			]
		];

		if (this.statsReportDataParam) {
			let count = 0;

			let bodyContent = [

				{ text: this.toNumberSuffix.transform( this.statsReportDataParam['totalTurnover'], '0', this.selectedGlobalCurrency ), fontSize: 15, color: '#fff', bold: true, fillColor: '#1AB394', borderColor: ['#fff', '#1AB394', '#fff', '#fff'], alignment: 'center' },
				{ text: this.toNumberSuffix.transform( this.statsReportDataParam['avgTurnover'], '0', this.selectedGlobalCurrency ), fontSize: 15, color: '#fff', bold: true, fillColor: '#0086d6', borderColor: ['#fff', '#0086d6', '#fff', '#fff'], alignment: 'center' },
				{ text:  this.toCurrencyPipe.transform(this.statsReportDataParam['totalEmployees'], '', '', '1.0-2'), color: '#fff', bold: true, fillColor: '#5f52df', borderColor: ['#fff', '#5f52df', '#fff', '#fff'], alignment: 'center', fontSize: 15 },
				{ text: this.toCurrencyPipe.transform(this.statsReportDataParam['avgEmployees'], '', '', '1.0-0'), fontSize: 15, color: '#fff', bold: true, fillColor: '#1a89b3', borderColor: ['#fff', '#1a89b3', '#fff', '#fff'], alignment: 'center' },

			];

			tableData.push(bodyContent);

			count++;

		} else {
			tableData.push([
				{ text: 'No Data Available', style: 'paraTextStyle', color: '', borderColor: this.innerTableBorderColor }, {}, {}, {}, {}, {}, {}, {}, {}
			]);
		}

		return tableData;

	}

	createTotalNumberTableBasicSecondRow() {

		let tableData: Array<any> = [
			[
				{ text: 'Total Estimated Turnover', fontSize: 12, color: '#fff', bold: true, fillColor: '#1AB394', borderColor: ['#fff', '#fff', '#fff', '#1AB394'], alignment: 'center'},
				{ text: 'Average Estimated Turnover', fontSize: 12, color: '#fff', bold: true, fillColor: '#0086d6', borderColor: ['#fff', '#fff', '#fff', '#0086d6'], alignment: 'center'},
			]
		];

		if (this.statsReportDataParam) {
			let count = 0;

			let bodyContent = [

				{ text: this.toNumberSuffix.transform( this.statsReportDataParam['totalEstimatedTurnover'], '0', this.selectedGlobalCurrency ), fontSize: 15, color: '#fff', bold: true, fillColor: '#1AB394', borderColor: ['#fff', '#1AB394', '#fff', '#fff'], alignment: 'center' },
				{ text: this.toNumberSuffix.transform( this.statsReportDataParam['avgEstimatedTurnover'], '0', this.selectedGlobalCurrency ), fontSize: 15, color: '#fff', bold: true, fillColor: '#0086d6', borderColor: ['#fff', '#0086d6', '#fff', '#fff'], alignment: 'center' },

			];

			tableData.push(bodyContent);

			count++;

		} else {
			tableData.push([
				{ text: 'No Data Available', style: 'paraTextStyle', color: '', borderColor: this.innerTableBorderColor }, {}, {}, {}, {}, {}, {}, {}, {}
			]);
		}

		return tableData;

	}

	tableBody( inputTableContent: { sectionHeader: string, dataKey: string, payloadKey?: string } ) {

		let tableBodyArray: Array<any> = [];

		let tableBodyObj = {
			colSpan: 3,
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 5; },
				paddingRight: function (i, node) { return 5; }
			},
			fillColor: '#fff',
			table: {
				headerRows: 0,
				widths: ['*'],
				body: [
					[ { text: inputTableContent.sectionHeader, style: 'headingStyle', fillColor: '#008f9a' } ],
					[
						{
							layout: {
								paddingLeft: function (i, node) { return 5; },
								paddingRight: function (i, node) { return 5; }
							},
							table: {
								headerRows: 1,
								widths: ['*', 100, 100],
								body: this.tableDataBasic( inputTableContent.dataKey, inputTableContent.payloadKey )
							},
						}
					]
				]
			}
		}

		tableBodyArray.push( tableBodyObj );
		return tableBodyArray;
	}

	tableDataBasic( inputDataKey: string, payloadKey?: string ) {

		let tableData: Array<any> = [
			[
				{ text: '', style: 'innerTableHeaderStyle', borderColor: this.innerTableBorderColor },
				{ text: 'Count', style: 'innerTableHeaderStyle', borderColor: this.innerTableBorderColor, alignment: 'right' },
				{ text: 'Percentage', style: 'innerTableHeaderStyle', borderColor: this.innerTableBorderColor, alignment: 'right' }
			]
		];

		if ( this.pdfStatsData ) {
			let count = 0, fillColorVar = ['#F0F0F0', '#fff'];

			switch ( inputDataKey ) {
				case 'region':

					for ( let regionKey of this.pdfStatsData[ inputDataKey ] ) {
	
						let bodyContent = [
							{ text: this.toTitleCasePipe.transform(regionKey['month']), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, color: '#4593bd', bold: true, link: this.goToRegionData( regionKey['month'] ) },
							{ text: this.toCurrencyPipe.transform(regionKey['count'], '', '', '1.0-2'), fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, style: 'paraTextStyle', alignment: 'right' },
							{ text: this.toCurrencyPipe.transform(regionKey['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
						];
						tableData.push(bodyContent);
	
						count++;
					}
					
					break;
			
				case 'riskChartArray':

					for ( let riskKey of this.pdfStatsData[ inputDataKey ] ) {
	
						let bodyContent = [
							{ text: this.formatTextNameForTables(this.toTitleCasePipe.transform(riskKey['field'])), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToRiskAnalysisData( this.toTitleCasePipe.transform(riskKey['field']) ) },
							{ text: this.toCurrencyPipe.transform(riskKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' },
							{ text: this.toCurrencyPipe.transform(riskKey['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
						];
						tableData.push(bodyContent);
	
						count++;
					}
					
					break;
			
				case 'otherMiscArray':

					for ( let otherMiscData of this.otherMiscArrayData ) {
						for ( let otherMiscKey of this.pdfStatsData[ inputDataKey ] ) {
							if ( otherMiscData.field == otherMiscKey.field ) {

								let countField: any = { text: this.toCurrencyPipe.transform(otherMiscKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForMisc( otherMiscData['label'] ), alignment: 'right' };

								if( otherMiscKey['count'] == 0) {
									countField = { text: this.toCurrencyPipe.transform(otherMiscKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}

								let bodyContent = [
									{ text: this.formatTextNameForTables(otherMiscData['label']), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(otherMiscKey['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];

								if ( otherMiscData.label == 'Environment Agency Registered' && !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
									bodyContent.map( val => {
										delete val.color;
										delete val.link;
									});
								}

								tableData.push(bodyContent);
			
								count++;
							}
						}
					}
					
					break;

				case 'standard_industry_tag':
					this.standardIndustryTags = this.pdfStatsData['standard_industry_tag'].map( tag =>{
						tag['label'] = tag['field'];
						return tag;
					} );

					for ( let industryTag of this.standardIndustryTags ) {
						for ( let data of this.pdfStatsData[ inputDataKey ] ) {
							if ( industryTag.field == data.field ) {

								let countField: any = { text: this.toCurrencyPipe.transform(data['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForIndustryTag( industryTag.field ), alignment: 'right' };

								if( data['count'] == 0 ) {
									countField = { text: this.toCurrencyPipe.transform(data['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}

								let bodyContent = [
									{ text: this.formatTextNameForTables(this.toTitleCasePipe.transform(data['field'])), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(data['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];
								tableData.push(bodyContent);
			
								count++;

							}
						}
					}
					break;

				case 'special_industry_tag':
					this.specialIndustryTags = this.pdfStatsData['special_industry_tag'].map( tag =>{
						tag['label'] = tag['field'];
						return tag;
					} );

					for ( let industryTag of this.specialIndustryTags ) {
						for ( let data of this.pdfStatsData[ inputDataKey ] ) {
							if ( industryTag.field == data.field ) {

								let countField: any = { text: this.toCurrencyPipe.transform(data['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForIndustryTag( industryTag.field ), alignment: 'right' };

								if( data['count'] == 0 ) {
									countField = { text: this.toCurrencyPipe.transform(data['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}

								let bodyContent = [
									{ text: this.formatTextNameForTables(this.toTitleCasePipe.transform(data['field'])), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(data['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];
								tableData.push(bodyContent);
			
								count++;

							}
						}
					}
					break;
			
				case 'industry':

				if ( this.selectedGlobalCountry !== 'uk' ) {
					for ( let industryKey of this.pdfStatsData[ inputDataKey ] ) {
						let countField: any = { text: this.toCurrencyPipe.transform(industryKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForIndustry( industryKey['industry'], industryKey['industry'], industryKey['code'] ), alignment: 'right' }

								if( industryKey['count'] == 0 ) {
									countField = { text: this.toCurrencyPipe.transform(industryKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}
								let bodyContent = [
									{ text: industryKey['code'] + ' - '+ this.toTitleCasePipe.transform(industryKey['industry']), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(industryKey['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];
								tableData.push(bodyContent);
			
								count++;
					}
					
				} else {
					this.pdfStatsData[ inputDataKey ] = this.pdfStatsData[ inputDataKey ].filter( industryName => industryName.industry != 'not specified' );
					// for( let industryData of this.industryListData ) {

						for ( let industryKey of this.pdfStatsData[ inputDataKey ] ) {
							
							// if ( industryKey['value'] == industryKey.industry ) {

								let countField: any = { text: this.toCurrencyPipe.transform(industryKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForIndustry( industryKey['industry'], industryKey['industry'], undefined ), alignment: 'right' }

								if( industryKey['count'] == 0 ) {
									countField = { text: this.toCurrencyPipe.transform(industryKey['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}
								let bodyContent = [
									{ text: this.toTitleCasePipe.transform(industryKey['industry']), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(industryKey['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];
								tableData.push(bodyContent);
								
								count++;

							// }
						}
					// }
				}
					
				break;
			
				case 'noOfEmployeesArray':

					for ( let empData of this.noOfEmployeesArrayData ) {
						for ( let numOfEmployee of this.pdfStatsData[ inputDataKey ] ) {
							if ( empData.field == numOfEmployee.field ) {

								let countField: any = { text: this.toCurrencyPipe.transform(numOfEmployee['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.gotToNumberOfEmployeesFieldName( numOfEmployee['field'] ), alignment: 'right' };

								if( numOfEmployee['count'] == 0 ) {
									countField = { text: this.toCurrencyPipe.transform(numOfEmployee['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}

								let bodyContent = [
									{ text: this.formatTextNameForTables(this.toTitleCasePipe.transform(numOfEmployee['field'])), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(numOfEmployee['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];
								tableData.push(bodyContent);
			
								count++;

							}
						}
					}
					
					break;
			
				case 'companyIncorporationInfo':

					for ( let companyAge of this.encorporationDate ) {
						for ( let data of this.pdfStatsData[ inputDataKey ] ) {
							if ( companyAge.field == data.field ) {

								let countField: any = { text: this.toCurrencyPipe.transform(data['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForCmpByAge( companyAge.rangeFrom, companyAge.rangeTo ), alignment: 'right' };

								if( data['count'] == 0 ) {
									countField = { text: this.toCurrencyPipe.transform(data['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
								}

								let bodyContent = [
									{ text: this.formatTextNameForTables(this.toTitleCasePipe.transform(data['field'])), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
									countField,
									{ text: this.toCurrencyPipe.transform(data['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }
								];
								tableData.push(bodyContent);
			
								count++;

							}
						}
					}
					
					break;
			
				default:
					for ( let financialTurnover of this.pdfStatsData?.[ inputDataKey ] ) {

						let countField: any = { text: this.toCurrencyPipe.transform(financialTurnover['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, color: '#4593bd', link: this.goToSearchForTurnover( financialTurnover['value'],inputDataKey, payloadKey ), alignment: 'right' };

						if( financialTurnover['count'] == 0 ) {
							countField = { text: this.toCurrencyPipe.transform(financialTurnover['count'], '', '', '1.0-2'), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, bold: true, alignment: 'right' };
						}

						let bodyContent = [
							{ text: this.formatTextNameForTables(financialTurnover['label']), style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor },
							countField,
							{ text: this.toCurrencyPipe.transform(financialTurnover['count_percentage'], '', '', '1.2-2') + " %", style: 'paraTextStyle', fillColor: fillColorVar[count % 2], borderColor: this.innerTableBorderColor, alignment: 'right' }

						];
						tableData.push(bodyContent);
	
						count++;

						// }
					}
					
					break;
			}

		} else {
			tableData.push([
				{ text: 'No Data Available', style: 'paraTextStyle', color: '', borderColor: this.innerTableBorderColor }
			]);
		}

		return tableData;
	}

	selectectedCreteriaChipsValue() {

		let tableBodyArray: Array<any> = [];
		let tableBodyObj = {
			colSpan: 3,
			layout: {
				defaultBorder: false,
				paddingLeft: function (i, node) { return 5; },
				paddingRight: function (i, node) { return 5; }
			},
			fillColor: '#fff',
			table: {
				headerRows: 0,
				widths: ['*'],
				body: [
					[{ text: 'Selected Criteria For Stats', style: 'headingStyle', fillColor: '#008f9a' }],
					[
						{
							layout: {
								
								paddingTop: function (i, node) { return 8; },
								paddingBottom: function (i, node) { return 8; },
							
							},
							table: {
								headerRows: 1,
								widths: [150, '*'],
								body: this.getSelectedChipsValue()
							},
						}
					]
				]
			}
		}

		tableBodyArray.push(tableBodyObj);
		return tableBodyArray;
	}

	getSelectedChipsValue() {
		let tableData: Array<any> = [], chipValArray: Array<any> = [];

		if ( this.statsCriteriaValues && this.statsCriteriaValues.length ) {
			
			let statsCreteriaValuesTemp = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );

			statsCreteriaValuesTemp = statsCreteriaValuesTemp.map(obj => {
				if ( obj.chip_values && obj.chip_values.length > 0 && typeof obj.chip_values[0] === 'string' ) {
					let tempArray = [];
					let chip_values_temp = this.toTitleCasePipe.transform( obj.chip_values.join(', ') );
					tempArray.push(chip_values_temp);
					obj.chip_values = tempArray;
				}
				return obj;
			});
			
			for (let chipData of statsCreteriaValuesTemp) {
				
				if (['Post Town', 'Accounts Made Up Date', 'Price', 'Date', 'PostCode', 'tradingPostTown', 'tradingPostCode', 'tradingCounty', 'tradingRegion', 'landCoporateDetailsCounty', 'landCoporateDetailsRegion', 'landCoporateDetailsPostCode', 'landCoporateDetailsPostTown', 'Is Lead Participant', 'Bands', 'Furlough Amount Band (In Pounds)', 'Person Positions', 'Total Directorships', 'chargesDataMonth', 'tradingConstituency', 'Cagr', 'Company Name/Number', 'Charges Registered Date', 'Charges Create Date','Company Age Filter'].includes(chipData.chip_group)) {
					if (chipData.chip_group == 'Post Town') {
						chipData.chip_group = 'Town / City';
					} else if(chipData.chip_group == 'Accounts Made Up Date') {
						chipData.chip_group = 'Last Made Up Date';
					} else if(chipData.chip_group == 'Charges Registered Date') {
						chipData.chip_group = 'Charges Registered On';
					} else if(chipData.chip_group == 'Charges Create Date') {
						chipData.chip_group = 'Charges Created On';
					} else if(chipData.chip_group == 'Price') {
						chipData.chip_group = 'Transaction Price';
					} else if(chipData.chip_group == 'Date') {
						chipData.chip_group = 'Date of Sale or Transaction';
					} else if(chipData.chip_group == 'PostCode') {
						chipData.chip_group = 'Post Code';
					} else if(chipData.chip_group == 'tradingPostTown') {
						chipData.chip_group = 'Town / City ( Trading Address )';
					} else if(chipData.chip_group == 'tradingPostCode') {
						chipData.chip_group = 'Post Code ( Trading Address )';
					} else if(chipData.chip_group == 'tradingCounty' || chipData.chip_group == 'tradingRegion' || chipData.chip_group == 'tradingConstituency') {
						chipData.chip_group = chipData.chip_group.replace("trading", "") + '( Trading Address )';
					} else if(chipData.chip_group == 'landCoporateDetailsPostTown') {
						chipData.chip_group = 'Town / City ( Property Register )';
					} else if(chipData.chip_group == 'landCoporateDetailsPostCode') {
						chipData.chip_group = 'Post Code ( Property Register )';
					} else if(chipData.chip_group == 'landCoporateDetailsCounty' || chipData.chip_group == 'landCoporateDetailsRegion') {
						chipData.chip_group = chipData.chip_group.replace("landCoporateDetails", "") + '( Property Register )';
					} else if(chipData.chip_group == 'Is Lead Participant') {
						chipData.chip_group = 'IsLead Participant';
					} else if(chipData.chip_group == 'Bands') {
						chipData.chip_group = 'Bands';
					} else if(chipData.chip_group == 'Furlough Amount Band (In Pounds)') {
						chipData.chip_group = 'Furlough Amount Band (GBP)';
					} else if(chipData.chip_group == 'Person Positions') {
						chipData.chip_group = 'Contact Information';
					} else if(chipData.chip_group == 'chargesDataMonth') {
						chipData.chip_group = 'Charges Month';
					} else if(chipData.chip_group == 'Cagr') {
						chipData.chip_group = 'CAGR';
					} else if(chipData.chip_group == 'Company Age Filter') {
						chipData.chip_group = 'Company Age';
					} 
				} else {
					chipData.chip_group = this.toTitleCasePipe.transform(chipData.chip_group);
				}
	
				for ( let chipVal of chipData.chip_values ) {
					
					if( chipData.chip_group == 'Ecs Site' ) {
						chipData.chip_group = 'ECS Site';
					} else if( chipData.chip_group == 'Compliance Band Score' ) {
						chipData.chip_group = 'Compliance Band Score';
					} else if( chipData.chip_group == 'Ccj Status' ) {
						chipData.chip_group = 'CCJ Status';
					} else if( chipData.chip_group == 'Ccj Date' ) {
						chipData.chip_group = 'CCJ Date';
					} else if( chipData.chip_group == 'Ccj Amount' ) {
						chipData.chip_group = 'CCJ Amount';
					}

					if ( chipData.chip_group == 'Key Financials' ) {

						let financialStrValue = '', indx = chipData.chip_values.indexOf( chipVal );

						financialStrValue = chipVal.key == 'EBITDA' ? 'EBITDA' : this.commonService.camelCaseToSentence( chipVal.key ) + ' | ';
						financialStrValue += !chipVal.less_than ? '> ' : '';
						financialStrValue += chipVal.greater_than ? this.toCurrencyPipe.transform( chipVal.greater_than, this.selectedGlobalCurrency, 'symbol', '1.0-0' ) : '';
						
						financialStrValue += chipVal.greater_than && chipVal.less_than ? ' - ' : '';
						financialStrValue += !chipVal.greater_than ? '< ' : '';
						financialStrValue += chipVal.less_than ? this.toCurrencyPipe.transform( chipVal.less_than, this.selectedGlobalCurrency, 'symbol', '1.0-0' ) : '';
						
						if ( chipData?.chip_values.length > 1 && chipVal.key == 'turnover' && chipData?.chip_values[ indx + 1 ]['key'] == 'estimated_turnover' ) {
							financialStrValue += ' (Including Estimated Turnover)';
						}

						chipVal = financialStrValue;

					}

					if ( [ 'Advanced Key Financials', 'Financial Ratio', '1 Year Growth', '3 Years Growth', '5 Years Growth' ].includes( chipData.chip_group ) ) {

						let financialStrValue = '';

						financialStrValue = chipVal.condition ? chipVal.condition : '';
						financialStrValue += this.commonService.camelCaseToSentence( chipVal.key.split('_').join(' ') ) + ' | ';
						if(chipVal.less_than != 0){
							financialStrValue += !chipVal.less_than ? '> ' : '';
						}
						
						financialStrValue += chipVal.greater_than ? this.toCurrencyPipe.transform(
													chipVal.greater_than,
													( chipVal.mode == 'currency' ? this.selectedGlobalCurrency : '' ),
													( chipVal.mode == 'currency' ? 'symbol' : '' ),
													( chipVal.fractionDigits ? '1.2-2' : '1.0-0' )
												) : '';
						
						financialStrValue += chipVal.greater_than == 0 ? this.toCurrencyPipe.transform(
							chipVal.greater_than,
							( chipVal.mode == 'currency' ? this.selectedGlobalCurrency : '' ),
							( chipVal.mode == 'currency' ? 'symbol' : '' ),
							( chipVal.fractionDigits ? '1.2-2' : '1.0-0' )
						)  : chipVal.greater_than && chipVal.suffix ? chipVal.suffix : '';

						financialStrValue += chipVal.greater_than && chipVal.less_than ? ' - ' : chipVal.greater_than == 0 && chipVal.less_than ? ' - ' : chipVal.greater_than && chipVal.less_than == 0 ? ' - ' : ''  ;
						
						if(chipVal.greater_than != 0){
							financialStrValue += !chipVal.greater_than ? '< ' : '';
						}
						
						financialStrValue += chipVal.less_than ? this.toCurrencyPipe.transform(
													chipVal.less_than,
													( chipVal.mode == 'currency' ? this.selectedGlobalCurrency : '' ),
													( chipVal.mode == 'currency' ? 'symbol' : '' ),
													( chipVal.fractionDigits ? '1.2-2' : '1.0-0' )
												) : '';
						
						financialStrValue += chipVal.less_than == 0 ? this.toCurrencyPipe.transform(
							chipVal.less_than,
							( chipVal.mode == 'currency' ? this.selectedGlobalCurrency : '' ),
							( chipVal.mode == 'currency' ? 'symbol' : '' ),
							( chipVal.fractionDigits ? '1.2-2' : '1.0-0' )
						) : chipVal.less_than && chipVal.suffix ? chipVal.suffix : '';

						chipVal = financialStrValue;

					}

					if(chipData.chip_group == "Bands") {
						// chipVal = JSON.parse(JSON.stringify(chipVal));
						let indx = chipVal.indexOf('Not Scored')
						
						if(indx != -1){
							chipVal = chipVal.replace('Not Scored','Not Scored /Very High Risk')
						}
						
						
					}

					if ( [ 'Price', 'Write-off Amount', 'CCJ Amount', 'Grant Offered', 'Transaction Price', 'Return On Equity', 'Business Valuation', 'Charge Year', 'Charges Month', 'chargesDataMonth', 'Charge Month' ].includes( chipData.chip_group ) ) {		
						chipVal = typeof chipVal === 'string' ? chipVal = chipVal.split(',') : chipVal;
					}
					
					if( ['District Code','Post Code ( Trading Address )','Post Code','Account Type'].includes( chipData.chip_group) ) {
						chipVal = chipVal.toString().toUpperCase();
					} else if( ['Status', 'tradingPostTown', 'Case Status'].includes(chipData.chip_group)) {
						chipVal = this.toTitleCasePipe.transform(chipVal);
					} else if( chipData.chip_group == 'Furlough Amount Band (GBP)' ) {
						chipVal = this.furloughDataFormat(chipVal);
					} else if([ 'Business Valuation', 'Grant Offered', 'Price', 'Write-off Amount', 'CCJ Amount', 'Transaction Price' ].includes( chipData.chip_group ) && chipVal[0] && chipVal[1]) {
						chipVal = this.toCurrencyPipe.transform(chipVal[0], this.selectedGlobalCurrency, 'symbol', '1.0-0') + ' - ' + this.toCurrencyPipe.transform(chipVal[1], this.selectedGlobalCurrency, 'symbol', '1.0-0');
					} else if([ 'Business Valuation', 'Grant Offered', 'Price', 'Write-off Amount', 'CCJ Amount', 'Transaction Price' ].includes( chipData.chip_group ) && chipVal[0] && !chipVal[1]) {
						chipVal = 'Minimum: ' + this.toCurrencyPipe.transform(chipVal[0], this.selectedGlobalCurrency, 'symbol', '1.0-0');
					} else if([ 'Business Valuation', 'Grant Offered', 'Price', 'Write-off Amount', 'CCJ Amount', 'Transaction Price' ].includes( chipData.chip_group ) && !chipVal[0] && chipVal[1]) {
						chipVal = 'Maximum: ' + this.toCurrencyPipe.transform(chipVal[1], this.selectedGlobalCurrency, 'symbol', '1.0-0');
					} else if ( chipData.chip_group == 'Return On Equity' && chipVal[0] && chipVal[1] ) {
						chipVal = (this.decimalPipe.transform(chipVal[0], '1.0-0') + '%') + ' - ' + (this.decimalPipe.transform(chipVal[1], '1.0-0') + '%');
					} else if( chipData.chip_group == 'Return On Equity' && chipVal[0] && !chipVal[1] ) {
						chipVal = 'Minimum: ' + this.decimalPipe.transform(chipVal[0], '1.0-0') + '%';
					} else if( chipData.chip_group == 'Return On Equity' && !chipVal[0] && chipVal[1] ) {
						chipVal = 'Maximum: ' + this.decimalPipe.transform(chipVal[1], '1.0-0') + '%';
					} else if([ 'Number Of Employees', 'Number Of Shareholders', 'Number Of Shareholdings', 'Number of Shareholdings Desc','Number of Shareholders','Number of Shareholders Desc', 'Number of Employees Desc', 'Compliance Band Score', 'ECS Site', 'Trade Debtors', 'Debtor Days', 'Company Age' ].includes( chipData.chip_group )) {
						
						if( ['Number Of Employees', 'Company Age', 'Number Of Shareholders', 'Number Of Shareholdings', 'Compliance Band Score', 'ECS Site', 'Trade Debtors', 'Debtor Days'].includes( chipData.chip_group ) ) {

							chipVal = typeof chipVal == 'string' ? chipVal.split(',') : chipVal;

							if( chipVal[0] && chipVal[1] ) {

								chipVal = chipVal[0] + ' - ' + chipVal[1];
								
							} else if( !['Trade Debtors', 'Debtor Days', 'Compliance Band Score'].includes(chipData.chip_group) ) {
								if(chipVal[0] && !chipVal[1]) {
									if([ 'Number of Employees', 'Number of Shareholders', 'Number of Shareholdings'].includes( chipData.chip_group )) {
										chipVal = "1000+";
									} else {
										if(chipVal[0] != 0 && "") {
											chipVal = '> ' + this.decimalPipe.transform(chipVal[0], '1.0-0');
										} else {
											chipVal = chipVal[0];
										}
									}
									
								}
								if(!chipVal[0] && chipVal[1]) {
									if([ 'Number of Employees', 'Number of Shareholders', 'Number of Shareholdings'].includes( chipData.chip_group )) {
										chipVal = "";
									} else {
										if(chipVal[1] != 0 && "") {
											chipVal = '< ' + this.decimalPipe.transform(chipVal[1], '1.0-0');
										} else {
											chipVal = chipVal[1];
										}
									}
									
								}
								if(chipVal[0] && !chipVal[1]) {
									if(['Company Age'].includes( chipData.chip_group )) {
										chipVal = "20+";
									} else {
										if(chipVal[0] != 0) {
											chipVal = '> ' + this.decimalPipe.transform(chipVal[0], '1.0-0');
										} else {
											chipVal = this.decimalPipe.transform(chipVal[0], '1.0-0');
										}
									}
								}	
								if(!chipVal[0] && chipVal[1]) {
									if(['Company Age'].includes( chipData.chip_group )) {
										chipVal = "";
									} else {
										if(chipVal[1] != 0) {
											chipVal = '> ' + this.decimalPipe.transform(chipVal[1], '1.0-0');
										} else {
											chipVal = this.decimalPipe.transform(chipVal[1], '1.0-0');
										}
									}
								}
							} else if( ['Trade Debtors', 'Debtor Days'].includes(chipData.chip_group) ) {
								if(chipVal[0] && !chipVal[1]) {
									chipVal = '> ' + this.decimalPipe.transform(chipVal[0], '1.0-0');
								} else if(!chipVal[0] && chipVal[1]) {
									chipVal = '< ' + this.decimalPipe.transform(chipVal[1], '1.0-0');
								}
							} else if ( chipVal[0] && !chipVal[1] ) {

								if( [ 'Compliance Band Score', 'ECS Site' ].includes( chipData.chip_group ) ) {

									if( ![0].includes(chipVal[0]) ) {
										if ( chipData.chip_group == 'Compliance Band Score' ) {
											chipVal = chipVal[0]
										} else {
											chipVal = '> ' + this.decimalPipe.transform( chipVal[0], '1.0-0' );
										}
							
									} else {
										chipVal = this.decimalPipe.transform( chipVal[0], '1.0-0' );
									}

								} else {
									chipVal = '> ' + this.decimalPipe.transform( chipVal[0], '1.0-0' );
								}

							} else if ( !chipVal[0] && chipVal[1] ) {
								chipVal = '< ' + this.decimalPipe.transform( chipVal[1], '1.0-0' );
							}

						} else {

							if ( chipVal[0] && chipVal[1] ) {
								chipVal = this.decimalPipe.transform( chipVal[0], '1.0-0' ) + ' - ' + chipVal[1]; 
							} else if ( chipVal[0] && !chipVal[1] ) {
								chipVal = '1000+';
							}

						}
						
					} else if([ 'Investor Number Of Shareholdings', 'Export Amount (In £)', 'Exchange Rate Effect' ].includes( chipData.chip_group )) {
						if ( chipVal && typeof chipVal == 'string' ){
							chipVal = chipVal.split(',');
						}
						if( [ 'Export Amount (In £)', 'Exchange Rate Effect' ].includes( chipData.chip_group ) ) {
							if(chipVal[0] && chipVal[1]) {
								chipVal = this.toCurrencyPipe.transform( chipVal[0], this.selectedGlobalCurrency, 'symbol', '1.0-0' ) + ' - ' + this.toCurrencyPipe.transform( chipVal[1], this.selectedGlobalCurrency, 'symbol', '1.0-0' );
							} else if(chipVal[0] && !chipVal[1]) {
								chipVal = '> ' + this.toCurrencyPipe.transform( chipVal[0], this.selectedGlobalCurrency, 'symbol', '1.0-0' );
							} else if(!chipVal[0] && chipVal[1]) {
								chipVal = '< ' + this.toCurrencyPipe.transform( chipVal[1], this.selectedGlobalCurrency, 'symbol', '1.0-0' );
							}
						} else {
							if(chipVal[0] && chipVal[1]) {
								chipVal = chipVal[0] + ' - ' + chipVal[1];
							} else if (chipVal[0] && !chipVal[1]) {
								chipVal = '>' + chipVal[0];
							} else if(!chipVal[0] && chipVal[1]) {
								chipVal = '<' + chipVal[1];
							}
						}
					} else if (chipData.chip_group == 'Director Age' && !this.directorAgeCondition) {
						if(typeof chipVal == 'string') {
							chipVal = this.toTitleCasePipe.transform(chipVal);
						} else if( typeof chipVal != 'string') {
							if(chipVal[0] && chipVal[1]) {
								chipVal = chipVal[0] + '-' + chipVal[1];
							} else if(chipVal[0] && !chipVal[1]) {
								chipVal = '>' + chipVal[0];
							} else if (!chipVal[0] && chipVal[1]) {
								chipVal = '<' + chipVal[1];
							}
						}
					} else if(chipData.chip_group == 'Director Age' && this.directorAgeCondition) {
						chipVal = chipVal;
					} else if ( [ 'Active Directors', 'Property Count', 'Properties Count', 'Directorship Count', 'Total Directorships', 'Outstanding Charges Count', 'Active Directorships' ].includes( chipData.chip_group ) ) {

						if ( typeof chipVal == 'string' ) {
							chipVal = chipVal.split(',');
						}
						
						if(chipVal[0] && chipVal[1]) {
							chipVal = this.decimalPipe.transform(chipVal[0], '1.0-0') + ' - ' + this.decimalPipe.transform(chipVal[1], '1.0-0');
						} else if(chipVal[0] && !chipVal[1]) {
							chipVal = 'Minimum: ' + this.decimalPipe.transform(chipVal[0], '1.0-0');
						} else if(!chipVal[0] && chipVal[1]) {
							chipVal = 'Maximum: ' + this.decimalPipe.transform(chipVal[1], '1.0-0');
						}
					} else if ( [ 'Charge Year' ].includes( chipData.chip_group ) ) {

						if( chipVal[0] && chipVal[1] ) {

							chipVal = chipVal[0] + ' - ' + chipVal[1];

						} else if( chipVal[0] && !chipVal[1] ) {

							chipVal = chipVal[0];

						} else if( !chipVal[0] && chipVal[1] ) {

							chipVal = chipVal[1];

						}

					} else if ( [ 'Charges Month', 'chargesDataMonth', 'Charge Month' ].includes( chipData.chip_group ) ) {

						if( chipVal[0] && chipVal[1] ) {

							chipVal = this.monthsEnum[ +chipVal[0] ] + ' - ' + this.monthsEnum[ +chipVal[1] ];

						} else if( chipVal[0] && !chipVal[1] ) {

							chipVal = this.monthsEnum[ +chipVal[0] ];

						} else if( !chipVal[0] && chipVal[1] ) {

							chipVal = this.monthsEnum[ +chipVal[1] ];

						}

					}

					if ( ['Incorporation Date', 'Project Start Date', 'Project End Date', 'Accounts Due Date', 'Charges Registered On', 'Charges Created On', 'Filed Date', 'Accounts Made Up Date', 'Confirmation Statement' , 'Last Filing Date', 'Date', 'CCJ Date', 'Proprietor Added Date', 'Sold Date', 'Score Date', 'Company Events', 'Company Commentary', 'Import Date', 'Export Date', 'Import/Export Period', 'Write-off Date', 'Last Made Up Date', 'Import/export Period'].includes( chipData.chip_group ) )  {
						chipVal = chipVal.toString().split(',')[2];
					} else {

						if ( [ 'Preferences' ].includes( chipData.chip_group )){
							chipVal = chipVal.split(',')
							for ( let val of chipVal ){
								chipVal = val.trim();

								if( ['Company Must Have Ccj', 'Company Must Not Have CCJ', 'Company Must Have Finances', 'Company Must Not Have Finances', 'Company Must Have Charges Details', 'Company Must Not Have Charges Details', 'Company Must Have Email', 'Company Must Have Companymail', 'Company Must Not Have Email', 'Company Must Not Have Companymail', 'Company Must Have Phone Number', 'Company Must Not Have Phone Number', 'Company Must Have Mobile Number', 'Company Must Not Have Mobile Number', 'Company Must Have Website', 'Company Must Not Have Website', 'Include  Liquidation Companies', 'Exclude  Liquidation Companies', 'Only  Liquidation Companies', 'Company Must Have Acquiring', 'Company Must Not Have Acquiring', 'Company Must Have Hnw1', 'Company Must Not Have Hnw1', 'Company Must Have Linkedin', 'Company Must Have Director\'s Linkedin', 'Company Must Not Have Linkedin', 'Company Must Not Have Director\'s Linkedin', 'Person Must Be Preferences_1', 'Person Must Be Preferences_2', 'Person Must Be Preferences_3', 'Person Must Be Preferences_4', 'Include  Ctps', 'Company Must Not Have  Ctps' ].includes( chipVal ) ) {
		
									if(chipVal == 'Company Must Have Acquiring') {
										chipVal = 'Company Must Have Acquiring Company';
									} else if(chipVal == 'Company Must Not Have Acquiring') {
										chipVal = 'Company Must Not Have Acquiring Company';
									} else if(chipVal == 'Company Must Have Ccj') {
										chipVal = 'Companies With CCJs';
									} else if(chipVal == 'Company Must Not Have CCJ') {
										chipVal = 'Companies Without CCJs';
									} else if(chipVal == 'Company Must Have Finances') {
										chipVal = 'Company Must Have Key Financials Filed';
									} else if(chipVal == 'Company Must Not Have Finances') {
										chipVal = 'Company Must Not Have Key Financials Filed';
									} else if(chipVal == 'Company Must Have Charges Details') {
										chipVal = 'Company Must Have Charge Registered';
									} else if(chipVal == 'Company Must Not Have Charges Details') {
										chipVal = 'Company Must Not Have Charge Registered';
									} else if( [ 'Company Must Have Companymail', 'Company Must Have Companymail' ].includes( chipVal ) ) {
										chipVal = 'Company Must Have A Generic Email Address';
									} else if( [ 'Company Must Not Have Email', 'Company Must Not Have Companymail' ].includes( chipVal )) {
										chipVal = 'Company Must Not Have A Generic Email Address';
									} else if(chipVal == 'Company Must Have Phone Number') {
										chipVal = 'Company Must Have A Phone Number';
									} else if(chipVal == 'Company Must Not Have Mobile Number') {
										chipVal = 'Company Must Not Have A Mobile Number';
									} else if(chipVal == 'Company Must Have Website') {
										chipVal = 'Company Must Have A Website';
									} else if(chipVal == 'Company Must Not Have Website') {
										chipVal = 'Company Must Not Have A Website';
									} else if(chipVal == 'Include  Liquidation Companies') {
										chipVal = 'Include companies In Liquidation';
									} else if(chipVal == 'Exclude Liquidation Companies') {
										chipVal = 'Exclude companies In Liquidation';
									} else if(chipVal == 'Only Liquidation Companies') {
										chipVal = 'Only companies In Liquidation';
									} else if(chipVal == 'Company Must Have Hnw1') {
										chipVal = 'Company Must Have HNWI';
									 } else if(chipVal == 'Company Must Not Have Hnw1') {
										chipVal = 'Company Must Not Have HNWI';
									} else if(chipVal == 'Company Must Have Linkedin') {
										chipVal = 'Company Must Have LinkedIn';
									} else if(chipVal == 'Company Must Have Director\'s Linkedin') {
										chipVal = "Company Must Have Director's LinkedIn";
									} else if(chipVal == 'Company Must Not Have Linkedin') {
										chipVal = 'Company Must Not Have LinkedIn';
									} else if(chipVal == "Company Must Not Have Director\'s Linkedin") {
										chipVal = "Company Must Not Have Director's LinkedIn";
									} else if(chipVal == "Person Must Be Preferences_1") {
										chipVal = "Person Must Be Shareholders";
									} else if(chipVal == "Person Must Be Preferences_2") {
										chipVal = "Person Must Be Highest Shareholders";
									} else if(chipVal == "Person Must Be Preferences_3") {
										chipVal = "Person Must Be Second Highest Shareholders";
									} else if(chipVal == "Person Must Be Preferences_4") {
										chipVal = "Person Must Be Possible Director";
									} else if(chipVal == "Include  Ctps") {
										chipVal = "Include  CTPS";
									} else if(chipVal == "Company Must Not Have  Ctps") {
										chipVal = "Company Must Not Have CTPS";
									}
								}
								chipValArray.push(chipVal)
								chipVal = chipValArray.join(', ')
								
							}


						} else {
							if( ![ 'Business Valuation', 'Return On Equity', 'Active Directors', 'Number of Employees Desc','Director Age', 'Grant Offered', 'Number of Shareholders Desc', 'Export Amount (In £)', 'Properties Count', 'Property Count', 'Outstanding Charges Count' , 'Number of Employees', 'Number of Shareholdings', 'Number of Shareholders','Number of Shareholdings Desc', 'CAGR', 'Investor Number of Shareholdings', 'Furlough Amount Band (In Pounds)', 'Total Directorships', 'District Code', 'Compliance Band Score', 'ECS Site', 'Price', 'Write-off Amount', 'CCJ Amount', 'Buyer Postcode', 'Supplier Postcode', 'Trade Debtors', 'Debtor Days', 'Charge Month', 'Charge Year', 'chargesDataMonth' ].includes( chipData?.chip_group ) ) {
								chipVal = chipVal;
							}

							if( ['CAGR'].includes(chipData.chip_group) ) {
								if( ['under_observation', 'under_lens', 'joining_league', 'gearing_up', 'under_radar'].includes( chipVal ) ) {
									if(chipVal == 'under_observation') {
										chipVal = 'Under Observation';
									} else if(chipVal == 'under_lens') {
										chipVal = 'Under Lens';
									} else if(chipVal == 'joining_league') {
										chipVal = 'Joining League';
									} else if(chipVal == 'gearing_up') {
										chipVal = 'Gearing Up';
									} else if(chipVal == 'under_radar') {
										chipVal = 'Under Radar';
									}
								}
							}

						}

						// if( ['Company Must Have Ccj', 'Company must not have CCJ', 'Company must have finances', 'Company must not have finances', 'Company must have charges details', 'Company must not have charges details', 'Company must have email', 'Company must not have email', 'Company must have phone number', 'Company must not have phone number', 'Company must have mobile number', 'Company must not have mobile number', 'Company must have website', 'Company must not have website', 'Include  liquidation companies', 'Exclude  liquidation companies', 'Only  liquidation companies', 'Company must have acquiring', 'Company must not have acquiring', 'Company must have HNW1', 'Company must not have HNW1', 'Company must have Linkedin', 'Company must have Director\'s Linkedin', 'Company must not have Linkedin', 'Company must not have Director\'s Linkedin', 'Person Must Be Preferences_1', 'Person Must Be Preferences_2', 'Person Must Be Preferences_3', 'Person Must Be Preferences_4', 'estimated turnover included' ].includes( chipVal ) ) {

						// 	if(chipVal == 'Company must have acquiring') {
						// 		chipVal = 'Company must have acquiring company number';
						// 	} else if(chipVal == 'Company must not have acquiring') {
						// 		chipVal = 'Company must not have acquiring company number';
						// 	} else if(chipVal == 'Company Must Have Ccj') {
						// 		console.log('1071>>',chipVal)
						// 		chipVal = 'Companies with CCJs';
						// 	} else if(chipVal == 'Company must not have CCJ') {
						// 		chipVal = 'Companies without CCJs';
						// 	} else if(chipVal == 'Company must have finances') {
						// 		chipVal = 'Company must have financials filed';
						// 	} else if(chipVal == 'Company must not have finances') {
						// 		chipVal = 'Company must not have financials filed';
						// 	} else if(chipVal == 'Company must have charges details') {
						// 		chipVal = 'Company must have charge registered';
						// 	} else if(chipVal == 'Company must not have charges details') {
						// 		chipVal = 'Company must not have charge registered';
						// 	} else if(chipVal == 'Company must have email') {
						// 		chipVal = 'Company must have a generic email address';
						// 	} else if(chipVal == 'Company must not have email') {
						// 		chipVal = 'Company must not have a generic email address';
						// 	} else if(chipVal == 'Company must have phone number') {
						// 		chipVal = 'Company must have a phone number';
						// 	} else if(chipVal == 'Company must not have mobile number') {
						// 		chipVal = 'Company must not have a mobile number';
						// 	} else if(chipVal == 'Company must have website') {
						// 		chipVal = 'Company must have a website';
						// 	} else if(chipVal == 'Company must not have website') {
						// 		chipVal = 'Company must not have a website';
						// 	} else if(chipVal == 'Include  liquidation companies') {
						// 		chipVal = 'Include companies in Liquidation';
						// 	} else if(chipVal == 'Exclude liquidation companies') {
						// 		chipVal = 'Exclude companies in Liquidation';
						// 	} else if(chipVal == 'Only liquidation companies') {
						// 		chipVal = 'Only companies in liquidation';
						// 	} else if(chipVal == 'Company must have HNW1') {
						// 		chipVal = 'Company must have HNWI';
						//  	} else if(chipVal == 'Company must not have HNW1') {
						// 		chipVal = 'Company must not have HNWI';
						// 	} else if(chipVal == 'Company must have Linkedin') {
						// 		chipVal = 'Company Must Have LinkedIn';
						// 	} else if(chipVal == 'Company must have Director\'s Linkedin') {
						// 		chipVal = "Company Must Have Director's LinkedIn";
						// 	} else if(chipVal == 'Company must not have Linkedin') {
						// 		chipVal = 'Company Must Not Have LinkedIn';
						// 	} else if(chipVal == "Company must not have Director\'s Linkedin") {
						// 		chipVal = "Company Must Not Have Director's LinkedIn";
						// 	} else if(chipVal == "Person Must Be Preferences_1") {
						// 		chipVal = "Person Must Be Shareholders";
						// 	} else if(chipVal == "Person Must Be Preferences_2") {
						// 		chipVal = "Person Must Be Highest Shareholders";
						// 	} else if(chipVal == "Person Must Be Preferences_3") {
						// 		chipVal = "Person Must Be Second Highest Shareholders";
						// 	} else if(chipVal == "Person Must Be Preferences_4") {
						// 		chipVal = "Person Must Be Possible Director";
						// 	} else if(chipVal == "estimated turnover included") {
						// 		chipVal = "Estimated Turnover Included";
						// 	}
							
						// } else {
						// 	if( ![ 'Business Valuation', 'Return On Equity', 'Active Directors', 'Number of Employees Desc','Director Age', 'Grant Offered', 'Number of Shareholders Desc', 'Export Amount (In £)', 'Properties Count', 'Property Count', 'Outstanding Charges Count' , 'Number of Employees', 'Number of Shareholdings', 'Number of Shareholders','Number of Shareholdings Desc', 'CAGR', 'Investor Number of Shareholdings', 'Furlough Amount Band (In Pounds)', 'Total Directorships', 'District Code', 'Compliance Band Score', 'ECS Site', 'Price', 'Write-off Amount', 'CCJ Amount', 'Buyer Postcode', 'Supplier Postcode', 'Trade Debtors', 'Debtor Days', 'Charge Month', 'Charge Year', 'chargesDataMonth' ].includes( chipData?.chip_group ) ) {
						// 		chipVal = chipVal;
						// 	}

						// 	if( ['CAGR'].includes(chipData.chip_group) ) {
						// 		if( ['under_observation', 'under_lens', 'joining_league', 'gearing_up', 'under_radar'].includes( chipVal ) ) {
						// 			if(chipVal == 'under_observation') {
						// 				chipVal = 'Under Observation';
						// 			} else if(chipVal == 'under_lens') {
						// 				chipVal = 'Under Lens';
						// 			} else if(chipVal == 'joining_league') {
						// 				chipVal = 'Joining League';
						// 			} else if(chipVal == 'gearing_up') {
						// 				chipVal = 'Gearing Up';
						// 			} else if(chipVal == 'under_radar') {
						// 				chipVal = 'Under Radar';
						// 			}
						// 		}
						// 	}

						// }
					}
					
					let bodyContent = [
						{ text: chipData.chip_group + ':', fontSize: 10, color: '#0000', alignment: 'left', borderColor: this.innerTableBorderColor },
						{ text: chipVal, alignment: 'left', color: '#1AB394', fontSize: 10, bold: true, borderColor: this.innerTableBorderColor }
					];

					if ( chipVal != 'Estimated_turnover' ||  !chipVal.includes('Estimated_turnover') ) {
						tableData.push( bodyContent );
					}
					
				}
			}

		} else {
			tableData.push([
				{ text: 'No Data Available', style: 'paraTextStyle', color: '', borderColor: this.innerTableBorderColor }
			]);
		}

		return tableData;
	}

	formatTextNameForTables(finalName) {
		if (finalName == 'Moderaterisk') {
			finalName = 'Moderate Risk'
		} else if (finalName == 'Lowrisk') {
			finalName = 'Low Risk'
		} else if (finalName == 'Verylowrisk') {
			finalName = 'Very Low Risk'
		} else if (finalName == 'Notscored') {
			finalName = 'Not Scored /Very High Risk'
		} else if (finalName == 'Highrisk') {
			finalName = 'High Risk'
		} else if (finalName == 'Ccj') {
			finalName = 'County Court Judgments'
		} else if (finalName == 'Patentdata') {
			finalName = 'Companies With Patent'
		} else if (finalName == 'Innovatedata') {
			finalName = 'Companies with Grants'
		} else if (finalName == 'Writeoff') {
			finalName = 'Write-offs'
		} else if (finalName == 'Landcoporatedetails') {
			finalName = 'Companies Land Ownerships'
		} else if (finalName == 'Shareholding') {
			finalName = 'Companies with Shareholdings'
		} else if (finalName == 'Ecsdata') {
			finalName = 'Environment Agency Registered'
		} else if (finalName == 'Negativeturnover') {
			finalName = 'Zero Value'
		} else if (finalName == 'Lessthan1m') {
			finalName = 'Less Than 1M'
		} else if (finalName == '1Mto5m') {
			finalName = '1M to 5M'
		} else if (finalName == '5Mto10m') {
			finalName = '5M to 10M'
		} else if (finalName == '10Mto100m') {
			finalName = '10M to 100M'
		} else if (finalName == '100Mto500m') {
			finalName = '100M to 500M'
		} else if (finalName == '500Mto1b') {
			finalName = '500M to 1B'
		} else if (finalName == 'Greaterthan1b') {
			finalName = 'Greater Than 1B'
		} else if (finalName == '0-2') {
			finalName = '0 to 2'
		} else if (finalName == '3-5') {
			finalName = '3 to 5'
		} else if (finalName == '6-10') {
			finalName = '6 to 10'
		} else if (finalName == '11-25') {
			finalName = '11 to 25'
		} else if (finalName == '26-50') {
			finalName = '26 to 50'
		} else if (finalName == '51-100') {
			finalName = '51 to 100'
		} else if (finalName == '101-250') {
			finalName = '101 to 250'
		} else if (finalName == '251-500') {
			finalName = '251 to 500'
		} else if (finalName == '501-1000') {
			finalName = '501 to 1000'
		} else if (finalName == '1To1m') {
			finalName = '1 to 1M'
		}	
		return finalName;
	}

	goToSearchForGrowthYear( chipDataValueTo?, chipDataValueFrom?, from?){
		let statsTempForTurnover = JSON.parse( JSON.stringify( this.statsCriteriaValues ) ),
			hasAlreadyTurnover;
			let urlStr: string;
		hasAlreadyTurnover = statsTempForTurnover.filter(val => val.chip_group == from);
		hasAlreadyTurnover = hasAlreadyTurnover.length ? hasAlreadyTurnover[0].chip_values.filter(val => val.key == 'turnover') : undefined;

		if ( !hasAlreadyTurnover ) {
			statsTempForTurnover = statsTempForTurnover.filter(val => val.chip_group !== from);
			if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
				statsTempForTurnover.push(
					{ chip_group: 'Status', chip_values: ['live'] },
					{
						chip_group: from,
						chip_values: [
							{
								key: "turnover", 
								greater_than: chipDataValueTo ? chipDataValueTo : undefined,
								less_than: chipDataValueFrom ? chipDataValueFrom : undefined, 
								financialBoolean: true, 
								selected_year: "true" 
							}
						]
					}
				);
			}else{
				statsTempForTurnover.push(
					{
						chip_group: from,
						chip_values: [
							{
								key: "turnover", 
								greater_than: chipDataValueTo ? chipDataValueTo : undefined,
								less_than: chipDataValueFrom ? chipDataValueFrom : undefined, 
								financialBoolean: true, 
								selected_year: "true" 
							}
						]
					}
				);

			}
		}
		if( this.listId || this.inputPageName ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }`;
		}

		return urlStr;
		
	}

	goToSearchForCmpByAge( chipDataValueTo?, chipDataValueFrom? ) {

		let statsTempForTurnover = JSON.parse( JSON.stringify( this.statsCriteriaValues ) ),
			urlStr: string,
			obj = {
				0: [0, 2],
				2: [2, 5 ],
				5: [5 , 10],
				10: [10],
				'not specified': ['not specified']
			}

		if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
			statsTempForTurnover.push(
				{ chip_group: 'Status', chip_values: ['live'] },
				{
					chip_group: "Company Age Filter",
					chip_values: [
					  [
						obj[chipDataValueTo][0], obj[chipDataValueTo][1]
					  ]
					]
				  }
			);
		}else{
			statsTempForTurnover.push(
				{
					chip_group: "Company Age Filter",
					chip_values: [
					  [
						obj[chipDataValueTo][0], obj[chipDataValueTo][1]
					  ]
					]
				  }
			);
		}

		if( this.listId || this.inputPageName ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }`;
		}

		return urlStr;
		
	}

	goToSearchForTurnover( selectedItem, inputDataKey, payloadKey ) {
		
		let statsTempForTurnover = JSON.parse( JSON.stringify( this.statsCriteriaValues ) ),
			hasAlreadyTurnover, chipGrp;
		let urlStr: string;

		if ( !inputDataKey.includes( 'Array' ) ) {
			if( inputDataKey.includes( 'Growth3YearsInfo' ) ){
				chipGrp = '3 Years Growth';
			} else if ( inputDataKey.includes( 'Growth1YearInfo' ) ){
				chipGrp = '1 Year Growth';
			} else if ( inputDataKey.includes('Growth5YearsInfo' ) ){
				chipGrp = '5 Years Growth';
			}
		} else {
			chipGrp = 'Key Financials';
		}

		hasAlreadyTurnover = statsTempForTurnover.filter(val => val.chip_group == chipGrp);
		hasAlreadyTurnover = hasAlreadyTurnover.length ? hasAlreadyTurnover[0].chip_values.filter(val => val.key == payloadKey ) : undefined;

		if (!hasAlreadyTurnover) {

			statsTempForTurnover = statsTempForTurnover.filter(val => val.chip_group !== chipGrp );

			if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
				statsTempForTurnover.push(
					{ chip_group: 'Status', chip_values: ['live'] }
				);
			}

			if ( payloadKey == 'number_of_employees' ) {
				payloadKey = 'no_of_employees';
			}

			let selectedObj = {
				key: payloadKey,
				greater_than: selectedItem.greaterThan ? selectedItem.greaterThan : undefined,
				less_than: selectedItem.lessThan ? selectedItem.lessThan : undefined,
				financialBoolean: true,
				selected_year: "true"
			};

			if ( ['1 Year Growth', '3 Years Growth', '5 Years Growth'].includes(chipGrp) ) {
				selectedObj['suffix'] = "%";
			}

			let chipArray = [ selectedObj ];

			if ( inputDataKey == 'turnoverPlusEstimatedTurnoverArray' ) {
				chipArray.push( {
					...selectedObj, key: 'estimated_turnover'
				} );
			}

			statsTempForTurnover.push(
				{
					chip_group: chipGrp,
					chip_values: chipArray
				}
			)

		}

		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }`;
		}

		return urlStr;

	}

	goToSearchForEstimatedTurnovers(greaterThanValue, lessThanValue) {
		
		let statsTempForTurnover = JSON.parse( JSON.stringify( this.statsCriteriaValues ) ),
			hasAlreadyTurnover;
		let urlStr: string;

		hasAlreadyTurnover = statsTempForTurnover.filter(val => val.chip_group == 'Key Financials');
		hasAlreadyTurnover = hasAlreadyTurnover.length ? hasAlreadyTurnover[0].chip_values.filter(val => val.key == 'turnover') : undefined;

		if (!hasAlreadyTurnover) {

			statsTempForTurnover = statsTempForTurnover.filter(val => val.chip_group !== 'Key Financials');

			if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
				statsTempForTurnover.push(
					{ chip_group: 'Status', chip_values: ['live'] },
					{
						chip_group: "Key Financials",
						chip_values: [
							{
								key: "turnover",
								greater_than: greaterThanValue ? greaterThanValue : undefined,
								less_than: lessThanValue ? lessThanValue : undefined,
								financialBoolean: true,
								selected_year: "true"
							},
							{
								key: "estimated_turnover",
								greater_than: greaterThanValue ? greaterThanValue : undefined,
								less_than: lessThanValue ? lessThanValue : undefined,
								financialBoolean: true,
								selected_year: "true"
							}
						]
					},
					
				);
			}else{
				statsTempForTurnover.push(
					{
						chip_group: "Key Financials",
						chip_values: [
							{
								key: "turnover",
								greater_than: greaterThanValue ? greaterThanValue : undefined,
								less_than: lessThanValue ? lessThanValue : undefined,
								financialBoolean: true,
								selected_year: "true"
							},
						]
					}
				);
			}

		}


		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempForTurnover) ) }`;
		}

		return urlStr;

	}

	goToSearchForMisc( miscName ) {
		
		let chipGroupName, preferenceObj;
		let urlStr: string;

		let statsTempValues = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		
		if (miscName == 'Companies With Patent') { 
			chipGroupName = "company must have companies with patent";
			preferenceObj = { "hasPatentData": "true" };
		}
		if (miscName == 'Companies with Grants') { 
			chipGroupName = "company must have companies with grants";
			preferenceObj = { "hasInnovateData": "true" };
		}
		if (miscName == 'Environment Agency Registered') { 
			chipGroupName = "Company must have ecs data";
			preferenceObj = { "hasEcsData": "true" };
		}
		if (miscName == 'Company With Charges') { 
			chipGroupName = "Company must have charges details";
			preferenceObj = { "hasCharges": "true" };
		}
		if (miscName == 'Companies with Shareholdings') { 
			chipGroupName = "Company must have shareholdings";
			preferenceObj = { "hasShareholdings": "true" };
		}
		if (miscName == 'Write-offs') { 
			chipGroupName = "Company must have write-offs";
			preferenceObj = { "isDebtor": "true" };
		}
		if (miscName == 'Companies Land Ownerships') { 
			chipGroupName = "Company must have corporate land";
			preferenceObj = { "hasLandCorporate": "true" };
		}
		if (miscName == "All CCJ's") {
			chipGroupName = "Company must have CCJ";
			preferenceObj = { "hasCCJInfo": "true" };
		}
		if ( miscName == "New CCJ's" ) {

			let findCcjChipGroup = this.queryParamChipData.filter(obj=> obj.chip_group == 'CCJ Status');
			if(!findCcjChipGroup.length){
				statsTempValues.push({ chip_group: 'CCJ Status', chip_values: ['new judgment'] });
			} else {
				statsTempValues.filter(obj=> {
					if (obj.chip_group == 'CCJ Status') {
						obj.chip_values.includes('new judgment') ? obj.chip_values : obj.chip_values.push('new judgment');
					}
				} )

			}
		}
		if (miscName == 'Not Specified') {
			chipGroupName = 'not specified';
			preferenceObj = { "otherMis": 'not specified' };
		}

		if ( chipGroupName && preferenceObj ) {

			if ( JSON.stringify(statsTempValues).includes('Preferences') ) {
				
				for (let data of statsTempValues) {
					if (data.chip_group == 'Preferences') {
						let tempChipArray = chipGroupName.split(" ")
						let tempChipVal = tempChipArray[tempChipArray.length - 2] + " " + tempChipArray[tempChipArray.length - 1]
					
						data.chip_values.forEach((chipData, chipDataIndex) => {
							if (chipData.includes(tempChipVal)) {
								data.chip_values.splice(chipDataIndex, 1);
							}
						});
	
						data.preferenceOperator.forEach((chipData, chipDataIndex) => {
							let preferenceObjKey = Object.keys(preferenceObj)[0]
							if (chipData.hasOwnProperty(preferenceObjKey)) {
								data.preferenceOperator.splice(chipDataIndex, 1);
							}
						});
						
						data.chip_values.push(chipGroupName);
						data.preferenceOperator.push(preferenceObj);
					}	
				}

			} else {
				if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
					statsTempValues.push(
						{ chip_group: 'Status', chip_values: ['live'] },
						{ chip_group: "Preferences", chip_values: [chipGroupName], preferenceOperator: [preferenceObj] }
					)
				}else{
					let filterData = 
					{ chip_group: "Preferences", chip_values: [chipGroupName], preferenceOperator: [preferenceObj] };
					statsTempValues.push(filterData);
				}
				
				
			}

		}
		
		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempValues) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempValues) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(statsTempValues) ) }`;
		}
		return urlStr;

	}

	goToSearchForIndustry( industryName, industryValue, industryCode? ) {
		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		let urlStr: string;

		navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'SIC Codes' );

		if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
			navigateUrlParamObject.push(
				{ chip_group: 'Status', chip_values: ['live'] },
				{
					chip_group: "SIC Codes",
					chip_values: [ industryName ],
					chip_industry_sic_codes: [ industryValue ],
				}
			);
		}else{
			navigateUrlParamObject.push(
				{
					chip_group: "SIC Codes",
					chip_values: this.selectedGlobalCountry == 'uk' ? [ industryName ] : [ `${ industryCode } - ${ industryValue }` ],
					chip_industry_sic_codes: this.selectedGlobalCountry == 'uk' ? [ industryName ] : [],
				}
			);
		}
		
		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }`;
		}

		return urlStr;

	}

	goToRegionData(regionName) {

		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		let urlStr: string;

		navigateUrlParamObject = navigateUrlParamObject.filter(val => val.chip_group !== 'Region');
		if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
			navigateUrlParamObject.push(
				{ chip_group: 'Status', chip_values: ['live'] },
				{
					chip_group: 'Region',
					chip_values: [regionName]
				}
			);
		}else {
			navigateUrlParamObject.push(
				{
					chip_group: 'Region',
					chip_values: [regionName]
				}
			);
		}

		

		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }`;
		}

		return urlStr;

	}

	goToRiskAnalysisData( bandName ) {
		
		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		let urlStr: string;

		navigateUrlParamObject = navigateUrlParamObject.filter(val => val.chip_group !== 'Bands');

		let bandName_chipVal = this.formatTextNameForTables( bandName )

		navigateUrlParamObject.push(
			{
				chip_group: 'Bands',
				chip_values: [ bandName_chipVal.toLowerCase()]
			}
		);

		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }`;
		}

		return urlStr;
	}

	gotToNumberOfEmployeesFieldName( fieldName ) {
		
		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		let	urlStr: string;

		navigateUrlParamObject = navigateUrlParamObject.filter(val => val.chip_group !== 'Number of Employees');

		let numberOfEmployeesChipVal = this.formatNumOfEmployeesChips( fieldName );
		if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
			navigateUrlParamObject.push(
				{ chip_group: 'Status', chip_values: ['live'] },
				{ chip_group: 'Number of Employees', chip_values: [ numberOfEmployeesChipVal ] }
			);
		}else{
			navigateUrlParamObject.push(
				{ chip_group: 'Number of Employees', chip_values: [ numberOfEmployeesChipVal ] }
			);
		}
		
		if( this.listId ||this.inputPageName ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }`;
		}

		return urlStr;
		
	}

	goToSearchForIndustryTag( industryName ) {
		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.statsCriteriaValues ) );
		let urlStr: string;

		navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Industry' );

		if ( ['businessMonitor', 'businessMonitorPlus', 'businessWatch'].includes( this.inputPageName ) ){
			navigateUrlParamObject.push(
				{ chip_group: 'Status', chip_values: ['live'] },
				{
					chip_group: "Industry",
					chip_values: [ industryName ]
				}
			);
		}else{
			navigateUrlParamObject.push(
				{
					chip_group: "Industry",
					chip_values: [ industryName ]
				}
			);
		}
		
		if( this.listId || this.inputPageName  ) {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }&cListId=${ this.listId }`;
		// } else if ( this.inputPageName ) {
		// 	urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }&listPageName=${ this.inputPageName }`;
		} else {
			urlStr = `${window.location.origin}/company-search?chipData=${ encodeURIComponent( JSON.stringify(navigateUrlParamObject) ) }`;
		}

		return urlStr;
	}

	formatNumOfEmployeesChips(fieldName) {

		let fieldNameTemp = fieldName;

		if(fieldNameTemp == '1000+') {
			fieldNameTemp = [ 1001 , '' ];
		} else if( fieldNameTemp == 'not specified' ) {
			fieldNameTemp = ['not specified'];
		}  else {
			fieldNameTemp = fieldNameTemp.split('-');
			fieldNameTemp = fieldNameTemp.map(Number)
		}
		return fieldNameTemp;
	}

	furloughDataFormat(str){
        if (str) {
            let strArray = str.split(" ")
            strArray[0] = this.decimalPipe.transform( parseFloat(strArray[0]) )
            strArray[1] = this.toTitleCasePipe.transform( strArray[1] )
            strArray[2] = this.decimalPipe.transform( parseFloat(strArray[2]) )
            str = strArray.join("  ")
            return str
        } else {
            return str
        }
    }

	getBrandingName(event: any) {
        if( event.value == 'Custom Branding') {
            this.checkBrandingImage();
        }
    }

	checkBrandingImage() {
        // let queryParam = [
		// 	{ key: 'userId', value: this.userDetails?.dbID }
		// ];

        this.sharedLoaderService.showLoader();
        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getImageDetailByUserId' ).subscribe({

            next: ( res ) => {
                if( res.body.status == 200 ) {

                    if( res.body.result == null ) {
                        this.showCheckBoxCard = false;

                    } else if( res.body.result != null ) { 
                        
                        if( res.body.result.coverImageDataUri ) {
							this.customBrandingUrlStore = res.body.result.coverImageDataUri;
                            this.showCheckBoxCard = true;
                        }
                    }
                } 
                this.sharedLoaderService.hideLoader();
            },

            error: ( err ) => {
                console.log( err );
            }

        });
    }


}
