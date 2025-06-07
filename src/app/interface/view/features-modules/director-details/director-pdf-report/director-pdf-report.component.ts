import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { take } from 'rxjs';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-director-pdf-report',
	templateUrl: './director-pdf-report.component.html',
	styleUrls: ['./director-pdf-report.component.scss'],
	providers: [TitleCasePipe, CurrencyPipe, DatePipe]
})
export class DirectorPdfReportComponent implements OnInit, OnChanges, AfterViewInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	@Input() directorReportDataParams: any;

	@Output() messageCommunicator = new EventEmitter<any>();
	
	pdfLimit: number;

	isLoggedIn: boolean = false;
	userDetails: Partial< UserInfoType > = {};
	subscribedPlanModal: any = subscribedPlan;
	showUpgradePlanDialog: boolean = false;
	showUpgradePlanDialogForClientuser: boolean = false;
	showLoginDialog: boolean = false;
	isFeatureDirectorReport: boolean;

	display: boolean = false;
	reportGeneratedDate: Date = new Date();

	directorName: string = '';
	directorDetailData: Array<any> = [];
	directorStatusCounts: any = {};
	directorsAllOccupations: Array<any> = [];
	directorDetailsCompanySummaryData: Array<any> = [];
	companyNumber: number;

	selectedReportTypeValue: string = 'selectedAll';

	constantMessages: any = UserInteractionMessages;
	showDirectorReportButton: boolean;

	constructor(
		public userAuthService: UserAuthService,
		private toTitleCasePipe: TitleCasePipe,
		private changeDetectionService: ChangeDetectorRef,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private activateRouter: ActivatedRoute,

	) { }

	ngOnInit() {
		this.isFeatureDirectorReport= this.userAuthService.hasFeaturePermission('Director Report')
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.userDetails = this.userAuthService?.getUserInfo();
			}
		});
	}

	ngOnChanges( changes: SimpleChanges ) {
		const { directorReportDataParams: { currentValue: { directorDetailsCompanySummaryData } } } = changes;
		this.showDirectorReportButton = !!directorDetailsCompanySummaryData.length;	
		this.directorStatusCounts = this.directorReportDataParams['directorStatusCounts'];
		this.companyNumber = this.directorReportDataParams.companyNumber;
	}

	ngAfterViewInit() {

		if(this.directorReportDataParams && this.directorReportDataParams.length ){
			this.directorName = this.directorReportDataParams['directorName'];
			// this.directorDetailData = this.directorReportDataParams['directorDetailData'];
			// this.directorsAllOccupations = this.directorReportDataParams['directorsAllOccupations'];
			this.directorDetailsCompanySummaryData = this.directorReportDataParams['directorDetailsCompanySummaryData'];
			this.companyNumber = this.directorReportDataParams.companyNumber;

			// this.changeDetectionService.detectChanges();
		}
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

	showDialog() {

		if ( this.isLoggedIn ) {

			if ( this.userAuthService.hasFeaturePermission('Director Report') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				this.display = true;

			} else {
				if ( this.userAuthService.hasRolePermission( ['Client User'] ) ) {
					this.showUpgradePlanDialogForClientuser = true;
				} else {
					this.showUpgradePlanDialog = true;
				}
			}
		} else {
			this.showLoginDialog = true;
		}

	}

	async checkPdfReportLimit() {

		if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

			let userLimits = await this.globalServiceCommnunicate.getUserExportLimit();
			
			if ( userLimits.directorReportLimit >= 1 ) {

				this.pdfLimit = userLimits.directorReportLimit;

				let msgs = this.constantMessages['successMessage']['directorReportSuccess'] + ' ' + (this.pdfLimit - 1).toString() +'.';

				let obj = {
					msgs: msgs,
					status: "success"
				}

				this.downlaodDirectorPDF(obj);

			} else {
				let msgs = this.userAuthService.hasRolePermission( [ 'Client Admin Master', 'Client Admin', 'Client User' ] ) ? "Pdf Export Limit Is Zero. To upgrade limit please contact your Administrator" : "Pdf Export Limit Is Zero. Please Upgrade Your Plan";

				let obj = {
					msgs: msgs,
					status: 'warn'
				};

				this.display = false;
				this.messageCommunicator.emit(obj);
			}

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showUpgradePlanDialog = true;
		}

	}

	downlaodDirectorPDF(obj) {

		this.sharedLoaderService.showLoader();

		let reportParam =[
			{
				key: 'companyNumber',
				value: this.companyNumber
			},
			{
				key: 'pnr',
				value: this.activateRouter.snapshot?.params?.directorLink
			},
			{
				key: '_id',
				value: this.userDetails?.dbID
			},
			{
				key: 'isPlatform',
				value: true
			},
			{
				key: 'baseEncoded',
				value: true
			}
		];

		let payload = {
			selectedReportTypeValue: this.selectedReportTypeValue
		};

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'REPORT', 'getDirectorReport', payload, undefined, reportParam ).subscribe(
			{
				next: ( res ) => {
					if ( res.body.code == 200 ) {
						let { data } = res.body;
						const linkSource = 'data:application/pdf;base64,' + data;
						const downloadLink = document.createElement("a");
						const fileName =  "DataGardener_" + this.toTitleCasePipe.transform(this.directorName) + "_" + this.formatDate(this.reportGeneratedDate) + '_Report.pdf';

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();

						this.sharedLoaderService.hideLoader();
						
						this.display = false;
						this.messageCommunicator.emit(obj);

					}else{
						this.display = false;
						this.sharedLoaderService.hideLoader();
						let obj = {
							msgs: 'Data Not Found',
							status: "error"
						}
						this.messageCommunicator.emit(obj);
					}
				},
				error: ( err ) => {
					this.display = false;
					console.log(err);
				}
			}
		);

	}

	resetOnHideDialog() {

		this.selectedReportTypeValue = 'selectedAll';

	}

}
