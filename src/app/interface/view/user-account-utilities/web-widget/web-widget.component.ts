import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { RadioButtonClickEvent } from 'primeng/radiobutton';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { Router } from '@angular/router';
@Component({
	selector: 'dg-web-widget',
	templateUrl: './web-widget.component.html',
	styleUrls: ['./web-widget.component.scss']
})

export class WebWidgetComponent implements OnInit {

	constructor(
		private commonService: CommonServiceService,
		private datePipe: DatePipe,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private userAuthService: UserAuthService,
		private router: Router
	) { }
	selectedPeriodValue: { fromDate: Date, toDate: Date } = {
		fromDate: undefined,
		toDate: undefined
	};

	todayDate = new Date();
	maxYear = this.todayDate.getFullYear();
	maxSelectableDate = new Date(new Date().setMonth(new Date().getMonth()));
	tableData: Array<any> = [];
	tableCols: any;
	companiesTableCols: any;
	visitorsTableCols: any;
	ipAddressData: any;
	showLoginDialog: boolean = false;
	showLoginDialog1: boolean = false;
	viewCompaniesVisitors: string = "Companies";
	totalRecords: number;
	// first: number = 0;
	rows: number = 25;
	selectDays: string;
	selectDaysRadinButton: boolean = false;
	showUpgradePlanDialogForClientuser: boolean = false;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined, tabNameToBeActive: '' };
	overviewName: string;
	showCompanySideDetails: boolean = false;
	corporateSideOverviewData: object;
	date: Date[] | undefined;
	selectedDay: any;
	checked: boolean = true;
	first: number = 0

	ngOnInit(): void {
		this.selectedDay = [
            { label: 'Today', value: 'Today' },
            { label: 'Last 7 days', value: 'Last 7 days' },
            { label: 'Last 30 days', value: 'Last 30 days' },
        ];
		this.initBreadcrumbAndSeoMetaTags();
		this.showLoginDialog1 = true

		this.visitorsTableCols = [
			{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
			{ field: 'Organisation', header: 'Organisation', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'companyType', header: 'Company Type', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'company_contact_info_latest', header: 'Features', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'CountryCode', header: 'Country Code', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'Country', header: 'Country', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'City', header: 'City', minWidth: '140px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'numberOfEmployees', header: 'Number Of Employees', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'turnover', header: 'Turnover', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'StartTime', header: 'Start Time', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'Referrer', header: 'Referrer', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'OrgWebsite', header: 'Org Website', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'OrgPhone', header: 'Org Phone', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'Keywords', header: 'Keywords', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'PagesVisited', header: 'Pages Visited', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'FirstPage', header: 'First Page', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'ValidOrganisation', header: 'Valid Organisation', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'EndTime', header: 'End Time', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'IPAddress', header: 'IP Address', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'HostName', header: 'Host Name', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'VisitSource', header: 'Visit Source', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'UserAgent', header: 'User Agent', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'ColourDepth', header: 'Colour Depth', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
			{ field: 'ISP', header: 'ISP', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'Cookies', header: 'Cookies', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'VisitID', header: 'Visit ID', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'LastPage', header: 'Last Page', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'DaysLastVisit', header: 'DaysLast Visit', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'Events', header: 'Events', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'Language', header: 'Language', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'LastOrgEdit', header: 'Last Org Edit', minWidth: '160px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'Latitude', header: 'Latitude', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'Longitude', header: 'Longitude', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'Monitor', header: 'Monitor', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'SearchEngine', header: 'Search Engine', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'UTMcampaign', header: 'UTMcampaign', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'UTMcontent', header: 'UTMcontent', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'UTMflat', header: 'UTMflat', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
			{ field: 'UTMmedium', header: 'UTMmedium', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'UTMsource', header: 'UTMsource', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
		];
		this.companiesTableCols = [
			{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
			{ field: 'businessName', header: 'Company Name', minWidth: '260px', maxWidth: '280px', textAlign: 'left' },
			{ field: 'name', header: 'Name', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'created_at', header: 'Visit Date', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'country_flat', header: 'Country', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
			{ field: 'companyType', header: 'Company Type', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'company_contact_info_latest', header: 'Features', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
			{ field: 'numberOfEmployees', header: 'Employees', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
			{ field: 'netWorth', header: 'NetWorth', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
			{ field: 'turnover', header: 'Turnover', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
			{ field: 'number_of_visits_in_date_range', header: 'Visits', minWidth: '100px', maxWidth: '100px', textAlign: 'right' },
			{ field: 'number_of_page_visits', header: 'Pages', minWidth: '100px', maxWidth: '100px', textAlign: 'right' },
			{ field: 'complete_session_duration', header: 'Duration', minWidth: '120px', maxWidth: '120px', textAlign: 'Left' },
			{ field: 'last_visit_by_organisation', header: 'Pre Visit', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },

		];

		this.tableCols = this.viewCompaniesVisitors == 'Visitors' ? this.visitorsTableCols : this.companiesTableCols;
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadCrumbService.setItems([
		// 	{ label: 'Web-Widget' }
		// ]);

	}
	submit() {
		this.sharedLoaderService.showLoader();
		let endpoint = this.viewCompaniesVisitors == 'Visitors' ? 'fetchVisitors' : 'fetchCompanies';
		let queryParam = [
			{ key: 'dateFrom', value: this.datePipe.transform(this.selectedPeriodValue.fromDate, 'yyyy-MM-dd') },
			{ key: 'dateTo', value: this.datePipe.transform(this.selectedPeriodValue.toDate, 'yyyy-MM-dd') }
		];

		this.globalServerCommunication.globalServerRequestCall('get', 'webstats', endpoint, undefined, undefined, queryParam).subscribe(res => {
			if (res.body.status == 200) {
				this.tableData = res.body.results;
				this.totalRecords = res.body.count;
			}
			this.sharedLoaderService.hideLoader();
		})

	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	checkSubscriptionAuth(conditionCheck, route) {

			if (route) {
				if (!conditionCheck) {
					event.preventDefault();
					event.stopPropagation();
					if ( this.userAuthService.hasRolePermission( [ 'Client User' ] ) ) {
						this.showUpgradePlanDialogForClientuser = true;
					}
				} else {
					let routeUrl: any;

					if (typeof route == 'string') {
						routeUrl = route;
					} else {
						routeUrl = this.router.serializeUrl(this.router.createUrlTree(route));
					}

					window.open(routeUrl, '_blank');
				}
			}

	}

	sidebarPanel( event ) {
		const { compNumber, compName } = event;
		// { requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute }
		// { requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute }
		if ( compNumber && compName ) {
			this.showCompanySideDetailsPanel( event.compNumber, event.compName, event?.rowData );
		}
	}

	showCompanySideDetailsPanel( compNumber, compName, rowData?, tabRoute? ) {

		this.showCompanySideDetails = true;

		if ( rowData == undefined ) {
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.overviewName = "companyOverview";
            
            
		} else if ( rowData != undefined ) {
            this.corporateSideOverviewData = rowData;
			this.overviewName = "corporateOverview";
		}
        
        if ( tabRoute ) {
            this.companySideDetailsParams.tabNameToBeActive = tabRoute;
        }

	}

	clear() {
		this.selectDaysRadinButton = false;
		this.selectDays = '';
		this.selectedPeriodValue.fromDate = undefined;
		this.selectedPeriodValue.toDate = undefined;
		this.tableData = [];
		this.viewCompaniesVisitors == 'Companies';
		this.rows = 25;
	}

	onToggleChange(name) {
		this.viewCompaniesVisitors = name
		this.tableData = []
		if (this.viewCompaniesVisitors == 'Visitors') {
			this.tableCols = this.visitorsTableCols
		} else {
			this.tableCols = this.companiesTableCols
		}
	}
	ipAddress(data) {
		this.sharedLoaderService.showLoader();
		this.showLoginDialog = true
		let queryParam = [
			{ key: 'ip', value: data }
		];
		this.globalServerCommunication.globalServerRequestCall('get', 'webstats', 'searchCompanyIpAddress', undefined, undefined, queryParam).subscribe(res => {

			if (res.body.code == 200) {
				this.ipAddressData = res.body.response.data
			} else {
				this.showLoginDialog = false
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 2000);


		})

	}

	selectedDays(event: RadioButtonClickEvent){
		this.selectDaysRadinButton = true
		if ( event.value == 'Today' ) {
			this.selectedPeriodValue.fromDate = this.todayDate,
			this.selectedPeriodValue.toDate = this.todayDate
		} else if ( event.value == 'Last 7 days' ){
			this.selectedPeriodValue.fromDate = new Date( new Date().setDate( new Date().getDate() - 7 ) )
			this.selectedPeriodValue.toDate = this.todayDate
		}else if ( event.value == 'Last 30 days' ) {
			this.selectedPeriodValue.fromDate = new Date( new Date().setDate( new Date().getDate() - 30 ) )
			this.selectedPeriodValue.toDate = this.todayDate
		}
	}

	pageChange(event) {
		this.rows = event.rows;
	}

	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
	}

	requestUpdateTableData(event) {
			this.pageChange = event;
			this.first = event.first;
			this.rows = event.rows

	}

}
