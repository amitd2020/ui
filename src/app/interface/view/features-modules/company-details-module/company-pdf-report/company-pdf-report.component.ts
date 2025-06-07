import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { environment, subscribedPlan } from 'src/environments/environment';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-company-pdf-report',
	templateUrl: './company-pdf-report.component.html',
	styleUrls: ['./company-pdf-report.component.scss'],
    providers: [TitleCasePipe, CurrencyPipe, DatePipe]
})
export class CompanyPdfReportComponent implements OnInit, AfterViewInit, OnChanges {

    title: string = ''
    description: string = '';
    keywords: string = '';
    robots: string = ''; // 'index, follow, noindex, nofollow'

    @Input() companyReportParams: any;

    @Output() messageCommunicator = new EventEmitter<any>();

    @Input() relatedDirectorAPICount: number = 0;

    @Input() showButtonFor: string ;

    @Input() companyReportButtonBool : boolean = false;

    @Input() fullCreditReportButtonBool : boolean = false;

    @Output() companyReportButtonBoolChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    @Output() fullCreditReportButtonBoolChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    isLoggedIn: boolean = false;
    userDetails: Partial< UserInfoType > = {};

    // reportLoading: boolean = false;
    pdfLimit: number;

    subscribedPlanModal: any = subscribedPlan;
    showUpgradePlanDialog: boolean = false;
    showLoginDialog: boolean = false;
    addcreditDialogForClientuser: boolean = false;

    // display: boolean = false;
    checked: boolean = false;
    hasDirectors: boolean;
    hasCommentary: boolean = false;
    hasPSC: boolean = false;
    hasCharges: boolean = false;
    hasRelatedCompanies: boolean = false;
    hasFinancial: boolean = false;
    shareholdersChecked: boolean = false;
    disableDownloadCreditLimitBtn: boolean = false;
    directorsChecked: boolean = false;
    documentsChecked: boolean = false;
    groupStructureChecked: boolean = false;
    aquasitionsAndMergersChecked: boolean = false;
    tradingAddressesChecked: boolean = false;
    commentaryChecked: boolean = false;
    financialChecked: boolean = false;
    pscChecked: boolean = false;
    corporate_landChecked: boolean = false;
    chargesChecked: boolean = false;
    ccjChecked: boolean = false;
    safe_alertsChecked: boolean = false;
    hasCreditScore: boolean = false;
    hideBuyFullCreditReportButn: boolean;

    reportFieldChecked: Array<any> = [];
    hasDocuments: boolean = false;
    selectAllChecked: boolean = false;
    financialReportTableGroups: Array<any> = [];
    reportGeneratedDate: Date = new Date();
    showCreditReportPlanDialog: Boolean = false;
    showBuyCreditReportDialog: Boolean = false;
    hasAvailableCredit: Boolean = false;
    creditReportPdfLimit: any;
    creditDataReport: Array<any> = [];
    creditReportPlans: Array<any> = [];
    selectedReportPlanDetails;
    creditorsChecked: boolean = false;
    badDebtorsChecked: boolean = false;
    furloughChecked: boolean = false;
    patentData: boolean = false;
    patentDataChecked: boolean = false;
    innovateGrantData: boolean = false;
    innovateGrantDataChecked: boolean = false;
    summaryPageContentForCrReport: object = {};
    importDataChecked: boolean = false;
    exportDataChecked: boolean = false;
    zScoreChecked: boolean = false;
    CAGRChecked: boolean = false;
    IscoreChecked: boolean = false;

    creditReportDownloadingUsername: string;
    loginConfirmationDialog: boolean = false;
    creditReportLimit: any;

    currentDate: Date = new Date();
    lastAccountFiledDate: Date;
	constantMessages: any = UserInteractionMessages;
    totalCheckBoxArr: Array<any> = [];
    subCheckedCheckBoxArr: Array<any> = [];

	constructor(
        private httpClient: HttpClient,
        private commonService: CommonServiceService,
        public userAuthService: UserAuthService,
        private sharedLoaderService: SharedLoaderService,
        private globalServiceCommnunicate: ServerCommunicationService,
        private toTitleCasePipe: TitleCasePipe

    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if( this.fullCreditReportButtonBool == true ) {
            this.showCreditReportDialog()
        }
    }

	ngOnInit() {

        this.lastAccountFiledDate = this.commonService.changeToDate( this.companyReportParams.accountsFilingDate );

        this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( loggedIn => {

            this.isLoggedIn = loggedIn;

            if ( this.isLoggedIn ) {
                this.userDetails = this.userAuthService?.getUserInfo();

                // let userId = this.userDetails?.dbID;
    
                this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
                    let userData = res.body.results;
                    this.creditReportPdfLimit = userData.creditReportLimit;
                });

            } else {
                this.creditReportPdfLimit = 0;
            }

        });

        if( this.fullCreditReportButtonBool == true ) {
            this.showCreditReportDialog()
        }

        if( this.companyReportButtonBool === true ) {
            this.showDialog()
        }

    }
    
    ngAfterViewInit() {}

    async checkPdfReportLimit( reportType?) {
        if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

            this.sharedLoaderService.showLoader();

            let userLimits = await this.globalServiceCommnunicate.getUserExportLimit();

            this.pdfLimit = reportType == 'fullCreditReport' ?  userLimits.creditReportLimit : userLimits.companyReport;
           
            if ( this.pdfLimit >= 1 ) {

                this.downloadCompanyPDFReport(reportType);
                this.closeFullcreditDialouge();
                
            } else {

                this.sharedLoaderService.hideLoader();

                // this.display = false;
                this.companyReportButtonBool = false;
                this.companyReportButtonBoolChange.emit( this.companyReportButtonBool );

                let obj = {
                    msgs: 'Pdf Export Limit Is Zero. Please Upgrade Your Plan',
                    status: "warn"
                }

                this.messageCommunicator.emit(obj);

            }

        } else {
            event.preventDefault();
            event.stopPropagation();
            this.showUpgradePlanDialog = true;
        }

    }

    closeDialouge() {
        this.closeFullcreditDialouge();
        this.fullCreditReportButtonBool = false;
        this.fullCreditReportButtonBoolChange.emit( this.fullCreditReportButtonBool );
    }

    closeFullcreditDialouge ( closeFullcreditDialouge? ) {
        this.showCreditReportPlanDialog = false;
    }

    downloadCompanyPDFReport(reportType, userIdWithoutLogin?) {
        let msgs = '';

        if ( this.isLoggedIn ) {

            if ( reportType == 'fullCreditReport' ) {
                msgs = 'Credit Report successfully downloaded, your new limit is ' + (this.creditReportPdfLimit - 1).toString() + '.' + " Report can be found in the 'PDF Reports' tab.";
            } else {
                msgs = this.constantMessages['successMessage']['companyReportDownloadSuccess'] + (this.pdfLimit - 1).toString() + '.';
            }

        } else {
            msgs = "Credit Report successfully downloaded, Report can be found in the 'PDF Reports List' tab.";
        }
        
        let obj = {
            msgs: msgs,
            status: "success"
        }

        let reportObj =[
            {
                key: 'companyNumber',
                value: this.companyReportParams.companyRegistrationNumber
            }, 
            {
                key: '_id',
                value: userIdWithoutLogin != undefined ? userIdWithoutLogin : this.userDetails?.dbID
            },
            {
                key: 'isPlatform',
                value: true
            },
            {
                key: 'baseEncoded',
                value: true
            }
        ] 
        // let reportParam = `?companyNumber=${ reportObj.companyNumber }&_id=${ reportObj._id }&isPlatform=true&baseEncoded=true`
    
        let payload = {
            // Risk Profile Checked started -->
            // safeAlerts: this.safe_alertsChecked,
            financial: this.financialChecked,
            ccj: this.ccjChecked,
            charges: this.chargesChecked,
            corporateLand: this.corporate_landChecked,
            groupStructure: this.groupStructureChecked,
            aquasitionsAndMergers: this.aquasitionsAndMergersChecked,
            creditors: this.creditorsChecked,
            badDebtors: this.badDebtorsChecked,
            furlough: this.furloughChecked,
            patentData: this.patentDataChecked,
            innovateGrantData: this.innovateGrantDataChecked,
            importData: this.importDataChecked,
            exportData: this.exportDataChecked,

            //Related Entities Checked Started -->
            shareholders: this.shareholdersChecked,
            commentary: this.commentaryChecked,
            directors: this.directorsChecked,
            psc: this.pscChecked,
            tradingAddresses: this.tradingAddressesChecked,
            zScore: this.zScoreChecked,
            cagr: this.CAGRChecked,

            //Document Checked Start -->
            documents: this.documentsChecked,
        }

        reportType == 'fullCreditReport' ? Object.keys( payload ).filter( val => payload[val] = true ) : payload;

        payload['reportType'] = reportType == 'fullCreditReport' ? 'creditReportLimit' : 'companyReport';

        if ( userIdWithoutLogin != undefined ) {

            this.httpClient.post<any>(`${environment.server}/report/company?companyNumber=${this.companyReportParams.companyRegistrationNumber}&isPlatform=true&_id=${userIdWithoutLogin}&baseEncoded=true`, payload ).subscribe((res: any) => {    
                if ( res.code == 200 ){
                    
                    let { data } = res;
                    const linkSource = 'data:application/pdf;base64,' + data;
                    const downloadLink = document.createElement("a");
                    const fileName = "DataGardener_" + (this.companyReportParams.companyRegistrationNumber).toUpperCase() + "_" + this.toTitleCasePipe.transform(this.companyReportParams.businessName.split(' ').join('_')) + "_" + this.formatDate(this.reportGeneratedDate) + '_' + '_Report.pdf';
    
                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                    this.sharedLoaderService.hideLoader();
                    // this.display = false;
                    this.companyReportButtonBool = false;
                    this.companyReportButtonBoolChange.emit( this.companyReportButtonBool )

                    this.showCreditReportPlanDialog = false;
                    this.loginConfirmationDialog = true;
                    this.messageCommunicator.emit(obj);
                }
            } );

        } else {

            this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'REPORT','getCompanyReports', payload, undefined, reportObj ).subscribe({

                next: ( res ) => {
            
                    if ( res.status == 200 ){
                        let { data } = res.body;
                        const linkSource = 'data:application/pdf;base64,' + data;
                        const downloadLink = document.createElement("a");
                        // const fileName = this.companyReportParams.companyRegistrationNumber;
                        const fileName = "DataGardener_" + (this.companyReportParams.companyRegistrationNumber).toUpperCase() + "_" + this.toTitleCasePipe.transform(this.companyReportParams.businessName.split(' ').join('_')) + "_" + this.formatDate(this.reportGeneratedDate) +'_' + '_Report.pdf';
    
                        downloadLink.href = linkSource;
                        downloadLink.download = fileName;
                        downloadLink.click();
                        
                        this.sharedLoaderService.hideLoader();
                        // this.display = false;
                        this.companyReportButtonBool = false;
                        this.companyReportButtonBoolChange.emit( this.companyReportButtonBool )

                        this.showCreditReportPlanDialog = false;
                        this.messageCommunicator.emit(obj);
                    }
                },
                error: (err) => {
                    this.showCreditReportPlanDialog = false;
                    this.companyReportButtonBool = false;
                    this.companyReportButtonBoolChange.emit( this.companyReportButtonBool )
                    this.sharedLoaderService.hideLoader();
                    let msgs = err.error.message;
                    let obj = {
                        msgs: msgs,
                        status: 'error',
                    };
                    this.messageCommunicator.emit(obj);
                    
                }
            });
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

    selectCheckBox( event, from ) {

        let checkedCheckBoxBool, totalCheckedBox;

        checkedCheckBoxBool = event.checked;

        if ( checkedCheckBoxBool ) {
            this.subCheckedCheckBoxArr.push({ from: from, checked: checkedCheckBoxBool });
        } else {
            this.subCheckedCheckBoxArr = this.subCheckedCheckBoxArr.filter( val => val['from'] != from );
        }
        
        if ( this.totalCheckBoxArr.length ==  this.subCheckedCheckBoxArr.length ) {
            this.selectAllChecked = true;
        } else {
            this.selectAllChecked = false;
        }

    }

    resetOnHideDialog() {
        this.selectAllChecked = false;
        this.shareholdersChecked = false;
        this.directorsChecked = false;
        this.documentsChecked = false;
        this.groupStructureChecked = false;
        this.aquasitionsAndMergersChecked = false;
        this.tradingAddressesChecked = false;
        this.commentaryChecked = false;
        this.financialChecked = false;
        this.pscChecked = false;
        this.corporate_landChecked = false;
        this.chargesChecked = false;
        this.ccjChecked = false;
        this.safe_alertsChecked = false;
        this.aquasitionsAndMergersChecked = false;
        this.badDebtorsChecked = false;
        this.creditorsChecked = false;
        this.furloughChecked = false;
        this.patentDataChecked = false;
        this.innovateGrantDataChecked = false;
        this.CAGRChecked = false;
        this.zScoreChecked = false;
        this.exportDataChecked = false;
        this.importDataChecked = false;
        this.IscoreChecked = false;
        this.totalCheckBoxArr = [];
        this.subCheckedCheckBoxArr = [];
    }

    selectAll() {
        if ( this.selectAllChecked ) {

            this.documentsChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'documentsChecked', checked: this.documentsChecked });

            if (this.companyReportParams.hasShareHolders) {
                if ( this.userAuthService.hasFeaturePermission('Shareholders') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.shareholdersChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'shareholdersChecked', checked: this.shareholdersChecked });
                }
            } else {
                this.shareholdersChecked = false;
            }

            if ( this.companyReportParams.directorsData ) {
                this.directorsChecked = true;
                this.subCheckedCheckBoxArr.push({ from: 'directorsChecked', checked: this.directorsChecked });
            } else {
                this.directorsChecked = false;
            }
            if (this.companyReportParams.hasGroupStructure) {
                if ( this.userAuthService.hasFeaturePermission('Group Structure') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.groupStructureChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'groupStructureChecked', checked: this.groupStructureChecked });
                }
            } else {
                this.groupStructureChecked = false;
            }
            if ( this.companyReportParams.hasTradingAddress ) {
                if ( this.userAuthService.hasFeaturePermission('Trading Address') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.tradingAddressesChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'tradingAddressesChecked', checked: this.tradingAddressesChecked });
                }
            } else {
                this.tradingAddressesChecked = false;
            }
            if ( this.companyReportParams.hasCompanyCommentary ) {
                if ( this.userAuthService.hasFeaturePermission('Commentary') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.commentaryChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'commentaryChecked', checked: this.commentaryChecked });
                }
            } else {
                this.commentaryChecked = false;
            }
            if (this.companyReportParams.hasFinances) {
                this.financialChecked = true;
                this.subCheckedCheckBoxArr.push({ from: 'financialChecked', checked: this.financialChecked });
            } else {
                this.financialChecked = false;
            }
            if (this.companyReportParams.hasPscDetails) {
                this.pscChecked = true;
                this.subCheckedCheckBoxArr.push({ from: 'pscChecked', checked: this.pscChecked });
            } else {
                this.pscChecked = false;
            }
            if ( this.companyReportParams.hasLandCorporate ) {
                if ( this.userAuthService.hasFeaturePermission('Corporate Land') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.corporate_landChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'corporate_landChecked', checked: this.corporate_landChecked });
                }
            } else {
                this.corporate_landChecked = false;
            }
            if ( this.companyReportParams.hasCharges ) {
                if ( this.userAuthService.hasFeaturePermission('Charges') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.chargesChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'chargesChecked', checked: this.chargesChecked });
                }
            } else {
                this.chargesChecked = false;
            }
            if (this.companyReportParams.hasCCJInfo) {
                if ( this.userAuthService.hasFeaturePermission('CCJs') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.ccjChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'ccjChecked', checked: this.ccjChecked });
                }
            } else {
                this.ccjChecked = false;
            }
            if (this.companyReportParams.hasAcquiredCompany || this.companyReportParams.hasAcquiringCompany) {
                this.aquasitionsAndMergersChecked = true;
                this.subCheckedCheckBoxArr.push({ from: 'aquasitionsAndMergersChecked', checked: this.aquasitionsAndMergersChecked });
            } else {
                this.aquasitionsAndMergersChecked = false;
            }
            if (this.companyReportParams.hasCreditor) {
                this.creditorsChecked = true;
                this.subCheckedCheckBoxArr.push({ from: 'creditorsChecked', checked: this.creditorsChecked });
            } else {
                this.creditorsChecked = false;
            }
            if (this.companyReportParams.hasDebtor) {
                if ( this.userAuthService.hasFeaturePermission('Write Off') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.badDebtorsChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'badDebtorsChecked', checked: this.badDebtorsChecked });
                }
            } else {
                this.badDebtorsChecked = false;
            }
            if ( this.companyReportParams.patentData ) {
                if ( this.userAuthService.hasAddOnPermission('specialFilter') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.patentDataChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'patentDataChecked', checked: this.patentDataChecked });
                }
            } else {
                this.patentDataChecked = false;
            }
            if (this.companyReportParams.hasFurloughData && this.companyReportParams.furloughData[0].amountBandsInPounds != '') {
                this.furloughChecked = true;
                this.subCheckedCheckBoxArr.push({ from: 'furloughChecked', checked: this.furloughChecked });
            } else {
                this.furloughChecked = false;
            }
            if (this.companyReportParams.innovate_uk_funded_updated) {
                if ( this.userAuthService.hasAddOnPermission('specialFilter') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.innovateGrantDataChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'innovateGrantDataChecked', checked: this.innovateGrantDataChecked });
                }
            } else {
                this.innovateGrantDataChecked = false;
            }
            if (this.companyReportParams.hasImportData) {
                if ( this.userAuthService.hasAddOnPermission('internationalTradeFilter') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.importDataChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'importDataChecked', checked: this.importDataChecked });
                }
            } else {
                this.importDataChecked = false;
            }
            if (this.companyReportParams.hasExportData) {
                if ( this.userAuthService.hasAddOnPermission('internationalTradeFilter') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.exportDataChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'exportDataChecked', checked: this.exportDataChecked });
                }
            } else {
                this.exportDataChecked = false;
            }

            if (this.companyReportParams.hasZScore) {
                if ( this.userAuthService.hasAddOnPermission('industryAnalysis') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.zScoreChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'zScoreChecked', checked: this.zScoreChecked });
                }
            } else {
                this.zScoreChecked = false;
            }
            if (this.companyReportParams.hasCAGR) {
                if ( this.userAuthService.hasAddOnPermission('industryAnalysis') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                    this.CAGRChecked = true;
                    this.subCheckedCheckBoxArr.push({ from: 'CAGRChecked', checked: this.CAGRChecked });
                }
            } else {
                this.CAGRChecked = false;
            }
            if (this.companyReportParams.hasIScore) {
                this.IscoreChecked = true;
            } else {
                this.IscoreChecked = false;
            }
            this.IscoreChecked

        } else {
            this.shareholdersChecked = false;
            this.directorsChecked = false;
            this.documentsChecked = false;
            this.groupStructureChecked = false;
            this.aquasitionsAndMergersChecked = false;
            this.tradingAddressesChecked = false;
            this.commentaryChecked = false;
            this.financialChecked = false;
            this.pscChecked = false;
            this.corporate_landChecked = false;
            this.chargesChecked = false;
            this.ccjChecked = false;
            this.safe_alertsChecked = false;
            this.aquasitionsAndMergersChecked = false;
            this.badDebtorsChecked = false;
            this.creditorsChecked = false;
            this.furloughChecked = false;
            this.patentDataChecked = false;
            this.innovateGrantDataChecked = false;
            this.CAGRChecked = false;
            this.zScoreChecked = false;
            this.exportDataChecked = false;
            this.importDataChecked = false;
            this.IscoreChecked = false;
            this.subCheckedCheckBoxArr = [];
        }
    }

    onModalClose() {
        this.companyReportButtonBool = false;
        this.companyReportButtonBoolChange.emit( this.companyReportButtonBool );
        this.totalCheckBoxArr = [];
        this.subCheckedCheckBoxArr = [];
    }

    showDialog() {

        if ( this.isLoggedIn ) {

            if (this.userAuthService.hasFeaturePermission('Company Report') || this.userAuthService.hasRolePermission( ['Super Admin'] )) {

                // this.display = true;
                this.companyReportButtonBool = true;
                this.companyReportButtonBoolChange.emit( this.companyReportButtonBool );
                this.hasdata();
                this.checkAllCheckox();

            } else {

                this.showUpgradePlanDialog = true;

            }
        } else {
            // this.showLoginDialog = true;                                     // this will shows Login Popup
            // window.location.href = 'https://datagardener.com/pricing/' ;   // this will open pricing page on same tab.
            window.open('https://datagardener.com/contact/', '_blank');      // this will open pricing page in New tab.
        }

    }

    hasdata() {

        if (this.companyReportParams.companyCommentary !== undefined && this.companyReportParams.companyCommentary.length > 0) {
            this.hasCommentary = true;
        }
        if (this.companyReportParams.directorsData !== undefined && this.companyReportParams.directorsData.length > 0) {
            this.hasDirectors = true;
        }
        if (this.companyReportParams.pscDetails !== undefined && this.companyReportParams.pscDetails.length > 0) {
            this.hasPSC = true;
        }
        if (this.companyReportParams.mortgagesObj !== undefined && this.companyReportParams.mortgagesObj.length > 0) {
            this.hasCharges = true;
        }
        if (this.companyReportParams.patentData !== undefined && this.companyReportParams.patentData.length > 0) {
            this.patentData = true;
        }
        if (this.companyReportParams.innovate_uk_funded_updated !== undefined && this.companyReportParams.innovate_uk_funded_updated.length > 0) {
            this.innovateGrantData = true;
        }
    }

    checkAllCheckox() {

        // For Document Tab
        this.totalCheckBoxArr.push( true );

        // For Risk Profile
        // if ( this.companyReportParams.hasSafeAlerts ) {
        //     this.totalCheckBoxArr.push( this.companyReportParams.hasSafeAlerts );
        // }

        if ( this.companyReportParams.hasFinances ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasFinances );
        }

        if ( this.companyReportParams.hasCCJInfo ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasCCJInfo );
        }

        if ( this.companyReportParams.hasCharges ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasCharges );
        }

        if ( this.companyReportParams.hasGroupStructure ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasGroupStructure );
        }

        if ( this.companyReportParams.hasAcquiredCompany || this.companyReportParams.hasAcquiringCompany ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasAcquiredCompany ? this.companyReportParams.hasAcquiredCompany : this.companyReportParams.hasAcquiringCompany );
        }

        if ( this.companyReportParams.hasCreditor ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasCreditor );
        }

        if ( this.companyReportParams.hasDebtor ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasDebtor );
        }

        if ( this.companyReportParams.hasFurloughData && this.companyReportParams?.furloughData[0]?.amountBandsInPounds != '' ) {
            this.totalCheckBoxArr.push( true );
        }

        if ( this.patentData ) {
            this.totalCheckBoxArr.push( this.patentData );
        }

        if ( this.innovateGrantData ) {
            this.totalCheckBoxArr.push( this.innovateGrantData );
        }

        if ( this.companyReportParams.hasImportData ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasImportData );
        }

        if ( this.companyReportParams.hasExportData ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasExportData );
        }

        if ( this.companyReportParams.hasLandCorporate ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasLandCorporate );
        }
        
        // For Related Entities
        if ( this.companyReportParams.hasShareHolders ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasShareHolders );
        }
        
        if ( this.hasCommentary ) {
            this.totalCheckBoxArr.push( this.hasCommentary );
        }

        if ( this.hasDirectors ) {
            this.totalCheckBoxArr.push( this.hasDirectors );
        }

        if ( this.hasPSC ) {
            this.totalCheckBoxArr.push( this.hasPSC );
        }

        if ( this.companyReportParams.hasTradingAddress ) {
            this.totalCheckBoxArr.push( this.companyReportParams.hasTradingAddress );
        }

        if ( this.companyReportParams.hasZScore && ( ( this.currentDate.getMonth() + 1 ) <= 4 && ( ( this.currentDate.getFullYear() - 1 ) == this.lastAccountFiledDate.getFullYear() || this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() )  || ( this.currentDate.getMonth() + 1 ) > 4 && this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() ) ) {
            this.totalCheckBoxArr.push( true );
        }

        if ( this.companyReportParams.hasCAGR && ( ( this.currentDate.getMonth() + 1 ) <= 4 && ( ( this.currentDate.getFullYear() - 1 ) == this.lastAccountFiledDate.getFullYear() || this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() )  || ( this.currentDate.getMonth() + 1 ) > 4 && this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() ) ) {
            this.totalCheckBoxArr.push( true );
        }

    }

    async showCreditReportDialog() {

        
        if ( this.isLoggedIn ) {

            this.hasdata();

            let userLimits = await this.globalServiceCommnunicate.getUserExportLimit();

            if (userLimits.creditReportLimit >= 0) {

                this.creditReportPdfLimit = userLimits.creditReportLimit;
                this.hasAvailableCredit = true;
                localStorage.setItem("userDetails", JSON.stringify(userLimits));
                this.disableDownloadCreditLimitBtn = userLimits.creditReportLimit == 0 ? true : false;
            }
            
            this.showCreditReportPlanDialog = true;

        } else {
            // this.showLoginDialog = true;
            this.increaseCredit();
        }

    }

    increaseCredit() {
        this.hasAvailableCredit = false;
        if ( !this.userAuthService.hasRolePermission( [ 'Client Admin', 'Client User' ] ) ) {

            this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'reportsPlan').subscribe(res => {
                if (res.body.status == 200) {
                    this.creditReportPlans = res.body.results;
                    setTimeout(() => {
                        this.showCreditReportPlanDialog = true;
                    }, 500);
                }
            });

        } else {
            this.addcreditDialogForClientuser = true;
        }
    }

    buyCreditReport(reportPlan) {
        this.selectedReportPlanDetails = reportPlan;
        // this.showCreditReportPlanDialog = false;

        setTimeout(() => {

            if ( this.isLoggedIn ) {
                this.closeFullcreditDialouge( 'hideDialogueBox' );
                this.showBuyCreditReportDialog = true;
            } else {
                this.loginConfirmationDialog = false;
                this.showBuyCreditReportDialog = true;
            }

        }, 100);

    }

    hideDialogBox(event) {
        if (event.status == 'success') {
            this.showBuyCreditReportDialog = false;

            this.creditReportPdfLimit = event.creditLimit;

            let msgs = "Payment Successfull";

            let obj = {
                msgs: msgs,
                status: 'success',
                creditReportPdfLimit: event.creditLimit
            };

            this.messageCommunicator.emit(obj);

            if (event.loggedIn == 'No') {

                this.creditReportDownloadingUsername = event.username;
                this.sharedLoaderService.showLoader();
                this.downloadCompanyPDFReport('fullCreditReport', sessionStorage.getItem('userID'));

            } else {
                this.loginConfirmationDialog = false;
            }
        }
        else if (event.status == 'close') {
            this.showBuyCreditReportDialog = false;
        }
    }

}


