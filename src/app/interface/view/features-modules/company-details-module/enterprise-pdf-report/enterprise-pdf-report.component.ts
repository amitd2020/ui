import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { environment, subscribedPlan } from 'src/environments/environment';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
  selector: 'dg-enterprise-pdf-report',
  templateUrl: './enterprise-pdf-report.component.html',
  styleUrls: ['./enterprise-pdf-report.component.scss']
})
export class EnterprisePdfReportComponent implements OnInit, AfterViewInit {

  title: string = ''
    description: string = '';
    keywords: string = '';
    robots: string = ''; // 'index, follow, noindex, nofollow'

    @Input() companyReportParams: any;

    @Output() messageCommunicator = new EventEmitter<any>();

    @Input() relatedDirectorAPICount: number = 0;

    @Input() showButtonFor: string ;

    @Input() enterpriseReportButton: boolean = false;

    @Output() enterpriseReportButtonChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);


    pdfLimit: number;

    userDetails: Partial< UserInfoType > = {};
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
    aboutTheCompanyChecked: boolean = false;
    documentsChecked: boolean = false;
    contactInformationChecked: boolean = false;
    ultimateHoldingCompanyChecked: boolean = false;
    riskAssessmentDataChecked: boolean = false;
    accountChecked: boolean = false;
    auditorAndAccountantChecked: boolean = false;
    personWithSignificantControlChecked: boolean = false;
    managementChecked: boolean = false;
    activeCompanySecretaryChecked: boolean = false;
    activeCompanyDirectorChecked: boolean = false;
    previousCompanyDirectorAndSecretaryChecked: boolean = false;
    chargesPersonEntitledChecked: boolean = false;
    groupStructureChecked: boolean = false;
    aquasitionsAndMergersChecked: boolean = false;
    tradingAddressesChecked: boolean = false;
    ccjDataTrendsChecked: boolean = false;
    accumulativeInvoiceTrendsChecked: boolean = false;
    dbtTrendsChecked: boolean = false;
    extendedGroupStructureChecked: boolean = false;
    commentaryChecked: boolean = false;
    financialChecked: boolean = false;
    pscChecked: boolean = false;
    corporate_landChecked: boolean = false;
    chargesChecked: boolean = false;
    ccjChecked: boolean = false;
    scoreAndIndicatorsChecked: boolean = false;
    safe_alertsChecked: boolean = false;
    governmentProcurementChecked: boolean = false;
    historyChecked: boolean = false;
    eventHistoryChecked: boolean = false;

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
    creditReportPdfLimit: any = 0;
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
    checkDgBranding: string = 'DG Branding';

    creditReportDownloadingUsername: string;
    loginConfirmationDialog: boolean = false;
    creditReportLimit: any;

    currentDate: Date = new Date();
    lastAccountFiledDate: Date;
	constantMessages: any = UserInteractionMessages;
    totalCheckBoxArr: Array<any> = [];
    subCheckedCheckBoxArr: Array<any> = [];
	mailFromEnterPriseButtonBool: boolean = false;
	customEmailId: string = undefined;
	customEmail: boolean = false;
	emailValidateBool: boolean = false;
    payloadForEnterPrisePDF: object = {};
    showCheckBoxCard: boolean = false;

	constructor(
        private httpClient: HttpClient,
        private commonService: CommonServiceService,
        public userAuthService: UserAuthService,
        private sharedLoaderService: SharedLoaderService,
        private globalServiceCommnunicate: ServerCommunicationService,
        private toTitleCasePipe: TitleCasePipe,

    ) { }

	ngOnInit() { 
        
        this.userDetails = this.userAuthService?.getUserInfo();

        this.lastAccountFiledDate = this.commonService.changeToDate( this.companyReportParams?.accountsFilingDate );

        // let userId = this.userDetails?.dbID;

        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
            let userData = res.body.results[0];
            this.creditReportPdfLimit = userData.creditReportLimit;
        });
      
    }
    
    ngAfterViewInit() { }

    async checkPdfReportLimit( reportType? ) {
        if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

            this.sharedLoaderService.showLoader();

            let userLimits = await this.globalServiceCommnunicate.getUserExportLimit();

            this.pdfLimit = reportType == 'fullCreditReport' ?  userLimits.creditReportLimit : reportType == 'enterpriseReport' ? userLimits['enterpriseReportLimit'] : userLimits.companyReport;
           
            if ( this.pdfLimit >= 1 ) {

                this.downloadCompanyPDFReport(reportType);
                
            } else {

                this.sharedLoaderService.hideLoader();

                // this.display = false;
                this.enterpriseReportButton = false;
                this.enterpriseReportButtonChange.emit( this.enterpriseReportButton );

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

    downloadCompanyPDFReport(reportType?, userIdWithoutLogin?) {
        let msgs = '';

        if ( reportType == 'fullCreditReport' ) {
            msgs = 'Credit Report successfully downloaded, your new limit is ' + (this.creditReportPdfLimit - 1).toString() + '.' + " Report can be found in the 'PDF Reports' tab.";
        } else {
            msgs = this.constantMessages['successMessage']['companyReportDownloadSuccess'] + (this.pdfLimit - 1).toString() + '.';
        }
        
        let obj = {
            msgs: msgs,
            status: "success"
        }

        let reportObj =[
            {
              key: 'userId',
              value: userIdWithoutLogin != undefined ? userIdWithoutLogin : this.userDetails?.dbID
            },
            {
                key: 'baseEncoded',
                value: true
            },
            {
              key: 'company',
              value: this.companyReportParams.companyRegistrationNumber
            }
        ] 
    
        this.payloadForEnterPrisePDF = {
            financialDetails: this.financialChecked,
            ccjInformation: this.ccjChecked,
            scoreAndIndicators: this.scoreAndIndicatorsChecked,
            writeOff: this.badDebtorsChecked,
            charges: this.chargesChecked,
            corporateLand: this.corporate_landChecked,
            patentAndTrade: this.patentDataChecked,
            innovateGrant: this.innovateGrantDataChecked,
            importData: this.importDataChecked,
            exportData: this.exportDataChecked,
            shareHolder: this.shareholdersChecked,
            commentary: this.commentaryChecked,
            tradingAddress: this.tradingAddressesChecked,
            documents: this.documentsChecked,
            aboutTheCompany: true,
            contactInformation: true,
            ultimateHoldingCompany: this.ultimateHoldingCompanyChecked,
            riskAssessmentData: this.riskAssessmentDataChecked,
            account: this.accountChecked,
            auditorAndAccountant: this.auditorAndAccountantChecked,
            management: this.managementChecked,
            personWithSignificantControl: this.personWithSignificantControlChecked,
            activeCompanySecretary: this.activeCompanySecretaryChecked,
            chargesPersonEntitled: this.chargesPersonEntitledChecked,
            activeCompanyDirector: this.activeCompanyDirectorChecked,
            previousCompanyDirectorAndSecretary: this.previousCompanyDirectorAndSecretaryChecked,
            governmentProcurement: this.governmentProcurementChecked,
            history: this.historyChecked,
            eventHistory: this.eventHistoryChecked,
            // ccjDataTrends: this.ccjDataTrendsChecked,
            accumulativeInvoiceTrends: this.accumulativeInvoiceTrendsChecked,
            dbtTrends: this.dbtTrendsChecked,
            groupStructure: this.groupStructureChecked,
            // extendedGroupStructure: this.extendedGroupStructureChecked,
        }

        this.payloadForEnterPrisePDF['type'] = 'full';
        this.payloadForEnterPrisePDF['email'] = this.customEmailId;
        this.payloadForEnterPrisePDF['defaultBranding'] = this.checkDgBranding == 'DG Branding' ? true : false;

        
        if ( userIdWithoutLogin != undefined ) {

            this.httpClient.post<any>(`${environment.server}/report/getCompanyReport?userId=${userIdWithoutLogin} &json=true &baseEncoded=true &company=${this.companyReportParams.companyRegistrationNumber}`, this.payloadForEnterPrisePDF ).subscribe((res: any) => {
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
                    this.enterpriseReportButton = false;
                    this.showCreditReportPlanDialog = false;
                    this.loginConfirmationDialog = true;
                    this.messageCommunicator.emit(obj);
                    this.enterpriseReportButtonChange.emit( this.enterpriseReportButton );
                    
                }
            } );

        } else {
            this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'REPORT','getEnterpriseReports', this.payloadForEnterPrisePDF, undefined, reportObj ).subscribe(res => {
                    if ( res.status == 200 ){
                        let { result } = res.body;
                        // const linkSource = 'data:application/pdf;base64,' + result;
                        // const downloadLink = document.createElement("a");
                        // // const fileName = this.companyReportParams.companyRegistrationNumber;
                        // const fileName = "DG_" + (this.companyReportParams.companyRegistrationNumber).toUpperCase() + "_" + this.toTitleCasePipe.transform(this.companyReportParams.businessName.split(' ').join('_')) + "_" + this.formatDate(this.reportGeneratedDate) +'_' + new Date().getTime() + '_Report.pdf';
    
                        // downloadLink.href = linkSource;
                        // downloadLink.download = fileName;
                        // downloadLink.click();
                        let obj = {
                            msgs: result.message,
                            status: "success"
                        }
                        this.sharedLoaderService.hideLoader();
                        // this.display = false;
                        this.enterpriseReportButton = false;
                        this.enterpriseReportButtonChange.emit( this.enterpriseReportButton );
                        
                        this.showCreditReportPlanDialog = false;
                        this.messageCommunicator.emit(obj);
                    }
                }
            );
        }
    }

    sendMailFromEnterPriseButton () {
        this.customEmailId = this.userDetails?.email;
        this.downloadCompanyPDFReport()
    }

    validateEmail(emailField) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (reg.test(emailField) == false) {
			this.emailValidateBool = false;
		} else {
			this.emailValidateBool = true;
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
        }


        let nameInfo = {};
        this.subCheckedCheckBoxArr.forEach(item => {
        let name = item.from;
            if (nameInfo[name]) {
                nameInfo[name].count++;
            } else {
                nameInfo[name] = { count: 1, value: item.value };
            }
            });
        let uniqueNames = Object.keys(nameInfo).filter(name => nameInfo[name].count === 1);
        let result = this.subCheckedCheckBoxArr.filter(item => uniqueNames.includes(item.from));
                  
                

        if ( !checkedCheckBoxBool ) {

            for ( let checkedCheckBox of this.subCheckedCheckBoxArr ) {

                if ( checkedCheckBox.checked && checkedCheckBox.from == from ) {
                    checkedCheckBox.checked = false;
                }

            }

        }
        let totalCheckedBoxs = this.subCheckedCheckBoxArr.filter( val => val.checked === true );
        // totalCheckedBox = this.subCheckedCheckBoxArr.filter( val => val.checked ).length;
        
        if ( 30 == totalCheckedBoxs.length) {
            this.selectAllChecked = true;
        } else {
            this.selectAllChecked = false;
        }

        // if(totalCheckedBox - 1) {
        //     this.selectAllChecked = false;
        // } else {
        //     totalCheckedBox == this.subCheckedCheckBoxArr.filter( val => val.checked ).length;
        //     this.selectAllChecked = true;
        // }

    }

    resetOnHideDialog() {
        this.selectAllChecked = false;
        this.shareholdersChecked = false;
        this.directorsChecked = false;
        this.documentsChecked = false;
        // this.aboutTheCompanyChecked = false;
        this.accountChecked = false;
        this.auditorAndAccountantChecked = false;
        this.personWithSignificantControlChecked = false;
        this.managementChecked = false;
        // this.aboutTheCompanyChecked = false;
        // this.aboutTheCompanyChecked = false;
        // this.aboutTheCompanyChecked = false;
        this.ultimateHoldingCompanyChecked = false;
        this.riskAssessmentDataChecked = false;
        // this.contactInformationChecked = false;
        this.activeCompanySecretaryChecked = false;
        this.activeCompanyDirectorChecked = false;
        this.previousCompanyDirectorAndSecretaryChecked = false;
        this.governmentProcurementChecked = false;
        this.historyChecked = false;
        this.eventHistoryChecked = false;
        this.chargesPersonEntitledChecked = false;
        this.groupStructureChecked = false;
        this.aquasitionsAndMergersChecked = false;
        this.tradingAddressesChecked = false;
        // this.ccjDataTrendsChecked = false;
        this.accumulativeInvoiceTrendsChecked = false;
        this.dbtTrendsChecked = false;
        this.groupStructureChecked = false;
        // this.extendedGroupStructureChecked = false;
        this.commentaryChecked = false;
        this.financialChecked = false;
        this.pscChecked = false;
        this.corporate_landChecked = false;
        this.chargesChecked = false;
        this.ccjChecked = false;
        this.scoreAndIndicatorsChecked = false;
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
        this.onModalClose();
    }

    selectAll() {
        if (this.selectAllChecked) {
            
            this.documentsChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'documentsChecked', checked: this.documentsChecked });

            // this.contactInformationChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'contactInformationChecked', checked: this.contactInformationChecked });

            this.ultimateHoldingCompanyChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'ultimateHoldingCompanyChecked', checked: this.ultimateHoldingCompanyChecked });

            this.riskAssessmentDataChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'riskAssessmentDataChecked', checked: this.riskAssessmentDataChecked });

            this.accountChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'accountChecked', checked: this.accountChecked });

            this.auditorAndAccountantChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'auditorAndAccountantChecked', checked: this.auditorAndAccountantChecked });

            // this.aboutTheCompanyChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'aboutTheCompanyChecked', checked: this.aboutTheCompanyChecked });

            this.personWithSignificantControlChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'personWithSignificantControlChecked', checked: this.personWithSignificantControlChecked });

            this.managementChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'managementChecked', checked: this.managementChecked });

            this.activeCompanySecretaryChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'activeCompanySecretaryChecked', checked: this.activeCompanySecretaryChecked });

            this.activeCompanyDirectorChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'activeCompanyDirectorChecked', checked: this.activeCompanyDirectorChecked });

            this.previousCompanyDirectorAndSecretaryChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'previousCompanyDirectorAndSecretaryChecked', checked: this.previousCompanyDirectorAndSecretaryChecked });

            this.chargesPersonEntitledChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'chargesPersonEntitledChecked', checked: this.chargesPersonEntitledChecked });

            this.shareholdersChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'shareholdersChecked', checked: this.shareholdersChecked });
                
            // this.directorsChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'directorsChecked', checked: this.directorsChecked });
        
            this.groupStructureChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'groupStructureChecked', checked: this.groupStructureChecked });
        
            this.tradingAddressesChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'tradingAddressesChecked', checked: this.tradingAddressesChecked });

            // this.ccjDataTrendsChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'ccjDataTrendsChecked', checked: this.ccjDataTrendsChecked });

            this.accumulativeInvoiceTrendsChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'accumulativeInvoiceTrendsChecked', checked: this.accumulativeInvoiceTrendsChecked });

            this.dbtTrendsChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'dbtTrendsChecked', checked: this.dbtTrendsChecked });

            // this.extendedGroupStructureChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'extendedGroupStructureChecked', checked: this.extendedGroupStructureChecked });
        
            this.commentaryChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'commentaryChecked', checked: this.commentaryChecked });
            
            this.financialChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'financialChecked', checked: this.financialChecked });
           
            // this.pscChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'pscChecked', checked: this.pscChecked });
        
            this.corporate_landChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'corporate_landChecked', checked: this.corporate_landChecked });
        
            this.chargesChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'chargesChecked', checked: this.chargesChecked });
        
            this.ccjChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'ccjChecked', checked: this.ccjChecked });

            this.scoreAndIndicatorsChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'scoreAndIndicatorsChecked', checked: this.scoreAndIndicatorsChecked });
        
            // this.safe_alertsChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'safe_alertsChecked', checked: this.safe_alertsChecked });
            
            // this.aquasitionsAndMergersChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'aquasitionsAndMergersChecked', checked: this.aquasitionsAndMergersChecked });
        
            // this.creditorsChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'creditorsChecked', checked: this.creditorsChecked });
           
            this.badDebtorsChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'badDebtorsChecked', checked: this.badDebtorsChecked });
        
    
            this.patentDataChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'patentDataChecked', checked: this.patentDataChecked });
            
            // this.furloughChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'furloughChecked', checked: this.furloughChecked });
        
            this.innovateGrantDataChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'innovateGrantDataChecked', checked: this.innovateGrantDataChecked });
        
            this.importDataChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'importDataChecked', checked: this.importDataChecked });
            
            this.exportDataChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'exportDataChecked', checked: this.exportDataChecked });
        
            // this.zScoreChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'zScoreChecked', checked: this.zScoreChecked });
        
            // this.CAGRChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'CAGRChecked', checked: this.CAGRChecked });
            
            // this.IscoreChecked = true;
            // this.subCheckedCheckBoxArr.push({ from: 'IscoreChecked', checked: this.IscoreChecked });

            this.governmentProcurementChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'governmentProcurementChecked', checked: this.governmentProcurementChecked });
            
            this.historyChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'historyChecked', checked: this.historyChecked });
            
            this.eventHistoryChecked = true;
            this.subCheckedCheckBoxArr.push({ from: 'eventHistoryChecked', checked: this.eventHistoryChecked });

        } else {
            this.shareholdersChecked = false;
            // this.directorsChecked = false;
            this.documentsChecked = false;
            this.activeCompanySecretaryChecked = false;
            this.ultimateHoldingCompanyChecked = false;
            this.riskAssessmentDataChecked = false;
            this.accountChecked = false;
            // this.aboutTheCompanyChecked = false;
            this.auditorAndAccountantChecked = false;
            // this.contactInformationChecked = false;
            this.personWithSignificantControlChecked = false;
            this.managementChecked = false;
            this.previousCompanyDirectorAndSecretaryChecked = false;
            this.governmentProcurementChecked = false;
            this.historyChecked = false;
            this.eventHistoryChecked = false;
            this.activeCompanyDirectorChecked = false;
            this.chargesPersonEntitledChecked = false;
            // this.aquasitionsAndMergersChecked = false;
            this.tradingAddressesChecked = false;
            // this.ccjDataTrendsChecked = false;
            this.accumulativeInvoiceTrendsChecked = false;
            this.dbtTrendsChecked = false;
            this.groupStructureChecked = false;
            // this.extendedGroupStructureChecked = false;
            this.commentaryChecked = false;
            this.financialChecked = false;
            // this.pscChecked = false;
            this.corporate_landChecked = false;
            this.chargesChecked = false;
            this.ccjChecked = false;
            this.scoreAndIndicatorsChecked = false;
            // this.safe_alertsChecked = false;
            // this.aquasitionsAndMergersChecked = false;
            this.badDebtorsChecked = false;
            // this.creditorsChecked = false;
            // this.furloughChecked = false;
            this.patentDataChecked = false;
            this.innovateGrantDataChecked = false;
            // this.CAGRChecked = false;
            // this.zScoreChecked = false;
            this.exportDataChecked = false;
            this.importDataChecked = false;
            // this.IscoreChecked = false;
            this.subCheckedCheckBoxArr = [];
        }
    }

    onModalClose() {
        // this.display = false;
        this.totalCheckBoxArr = [];
        this.subCheckedCheckBoxArr = [];
        this.enterpriseReportButton = false;
        this.enterpriseReportButtonChange.emit( this.enterpriseReportButton );
    }

    // showDialog() {

    //     if (this.authGuardService.isLoggedin()) {

    //         if (this.userRoleAndFeatureAuthService.checkUserHasFeatureAccess('Company Report') || this.userRoleAndFeatureAuthService.isAdmin()) {

    //             // this.enterpriseReportButton = true;

    //             // this.display = true;
    //             // this.enterpriseReportButton =true;
    //             // this.hasdata();
    //             // this.checkAllCheckox();

    //         } else {

    //             this.showUpgradePlanDialog = true;

    //         }
    //     } else {
    //         // this.showLoginDialog = true;                                     // this will shows Login Popup
    //         // window.location.href = 'https://datagardener.com/pricing/' ;   // this will open pricing page on same tab.
    //         window.open('https://datagardener.com/contact/', '_blank');      // this will open pricing page in New tab.
    //     }

    // }
    // showDialogEnterpriseReport(){
    //     this.display = true;
    // }

    // hasdata() {

    //     if (this.companyReportParams.companyCommentary !== undefined && this.companyReportParams.companyCommentary.length > 0) {
    //         this.hasCommentary = true;
    //     }
    //     if (this.companyReportParams.directorsData !== undefined && this.companyReportParams.directorsData.length > 0) {
    //         this.hasDirectors = true;
    //     }
    //     if (this.companyReportParams.pscDetails !== undefined && this.companyReportParams.pscDetails.length > 0) {
    //         this.hasPSC = true;
    //     }
    //     if (this.companyReportParams.mortgagesObj !== undefined && this.companyReportParams.mortgagesObj.length > 0) {
    //         this.hasCharges = true;
    //     }
    //     if (this.companyReportParams.patentData !== undefined && this.companyReportParams.patentData.length > 0) {
    //         this.patentData = true;
    //     }
    //     if (this.companyReportParams.innovate_uk_funded_updated !== undefined && this.companyReportParams.innovate_uk_funded_updated.length > 0) {
    //         this.innovateGrantData = true;
    //     }
    // }

    // checkAllCheckox() {

    //     // For Document Tab
    //     this.totalCheckBoxArr.push( true );


    //     if (this.selectAllChecked) {

    //         this.documentsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'documentsChecked', checked: this.documentsChecked });

    //         // this.contactInformationChecked = true;
    //         // this.subCheckedCheckBoxArr.push({ from: 'contactInformationChecked', checked: this.contactInformationChecked });

    //         this.ultimateHoldingCompanyChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'ultimateHoldingCompanyChecked', checked: this.ultimateHoldingCompanyChecked });

    //         this.riskAssessmentDataChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'riskAssessmentDataChecked', checked: this.riskAssessmentDataChecked });

    //         this.accountChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'accountChecked', checked: this.accountChecked });

    //         this.auditorAndAccountantChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'auditorAndAccountantChecked', checked: this.auditorAndAccountantChecked });

    //         // this.aboutTheCompanyChecked = true;
    //         // this.subCheckedCheckBoxArr.push({ from: 'aboutTheCompanyChecked', checked: this.aboutTheCompanyChecked });

    //         this.personWithSignificantControlChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'personWithSignificantControlChecked', checked: this.personWithSignificantControlChecked });

    //         this.managementChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'managementChecked', checked: this.managementChecked });

    //         this.activeCompanySecretaryChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'activeCompanySecretaryChecked', checked: this.activeCompanySecretaryChecked });

    //         this.activeCompanyDirectorChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'activeCompanyDirectorChecked', checked: this.activeCompanyDirectorChecked });

    //         this.previousCompanyDirectorAndSecretaryChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'previousCompanyDirectorAndSecretaryChecked', checked: this.previousCompanyDirectorAndSecretaryChecked });

    //         this.chargesPersonEntitledChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'chargesPersonEntitledChecked', checked: this.chargesPersonEntitledChecked });

    //         this.shareholdersChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'shareholdersChecked', checked: this.shareholdersChecked });
                
    //         this.directorsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'directorsChecked', checked: this.directorsChecked });
        
    //         this.groupStructureChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'groupStructureChecked', checked: this.groupStructureChecked });
        
    //         this.tradingAddressesChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'tradingAddressesChecked', checked: this.tradingAddressesChecked });

    //         // this.ccjDataTrendsChecked = true;
    //         // this.subCheckedCheckBoxArr.push({ from: 'ccjDataTrendsChecked', checked: this.ccjDataTrendsChecked });

    //         this.accumulativeInvoiceTrendsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'accumulativeInvoiceTrendsChecked', checked: this.accumulativeInvoiceTrendsChecked });

    //         this.dbtTrendsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'dbtTrendsChecked', checked: this.dbtTrendsChecked });

    //         // this.groupStructureChecked = true;
    //         // this.subCheckedCheckBoxArr.push({ from: 'groupStructureChecked', checked: this.groupStructureChecked });

    //         // this.extendedGroupStructureChecked = true;
    //         // this.subCheckedCheckBoxArr.push({ from: 'extendedGroupStructureChecked', checked: this.extendedGroupStructureChecked });
        
    //         this.commentaryChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'commentaryChecked', checked: this.commentaryChecked });
            
    //         this.financialChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'financialChecked', checked: this.financialChecked });
           
    //         this.pscChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'pscChecked', checked: this.pscChecked });
        
    //         this.corporate_landChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'corporate_landChecked', checked: this.corporate_landChecked });
        
    //         this.chargesChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'chargesChecked', checked: this.chargesChecked });
        
    //         this.ccjChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'ccjChecked', checked: this.ccjChecked });

    //         this.scoreAndIndicatorsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'scoreAndIndicatorsChecked', checked: this.scoreAndIndicatorsChecked });
        
    //         this.safe_alertsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'safe_alertsChecked', checked: this.safe_alertsChecked });
            
    //         this.aquasitionsAndMergersChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'aquasitionsAndMergersChecked', checked: this.aquasitionsAndMergersChecked });
        
    //         this.creditorsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'creditorsChecked', checked: this.creditorsChecked });
           
    //         this.badDebtorsChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'badDebtorsChecked', checked: this.badDebtorsChecked });
        
    
    //         this.patentDataChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'patentDataChecked', checked: this.patentDataChecked });
            
    //         this.furloughChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'furloughChecked', checked: this.furloughChecked });
        
    //         this.innovateGrantDataChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'innovateGrantDataChecked', checked: this.innovateGrantDataChecked });
        
    //         this.importDataChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'importDataChecked', checked: this.importDataChecked });
            
    //         this.exportDataChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'exportDataChecked', checked: this.exportDataChecked });
        
    //         this.zScoreChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'zScoreChecked', checked: this.zScoreChecked });
        
    //         this.CAGRChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'CAGRChecked', checked: this.CAGRChecked });
            
    //         this.IscoreChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'IscoreChecked', checked: this.IscoreChecked });

    //         this.governmentProcurementChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'governmentProcurementChecked', checked: this.governmentProcurementChecked });
            
    //         this.historyChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'historyChecked', checked: this.historyChecked });
            
    //         this.eventHistoryChecked = true;
    //         this.subCheckedCheckBoxArr.push({ from: 'eventHistoryChecked', checked: this.eventHistoryChecked });

    //     }



    //     // For Risk Profile
    // //     if ( this.companyReportParams.hasSafeAlerts ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasSafeAlerts );
    // //     }

    // //     if ( this.companyReportParams.hasFinances ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasFinances );
    // //     }

    // //     if ( this.companyReportParams.hasCCJInfo ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasCCJInfo );
    // //     }

    // //     if ( this.companyReportParams.hasCharges ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasCharges );
    // //     }

    // //     if ( this.companyReportParams.hasGroupStructure ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasGroupStructure );
    // //     }

    // //     if ( this.companyReportParams.hasAcquiredCompany || this.companyReportParams.hasAcquiringCompany ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasAcquiredCompany ? this.companyReportParams.hasAcquiredCompany : this.companyReportParams.hasAcquiringCompany );
    // //     }

    // //     if ( this.companyReportParams.hasCreditor ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasCreditor );
    // //     }

    // //     if ( this.companyReportParams.hasDebtor ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasDebtor );
    // //     }

    // //     if ( this.companyReportParams.hasFurloughData && this.companyReportParams?.furloughData[0]?.amountBandsInPounds != '' ) {
    // //         this.totalCheckBoxArr.push( true );
    // //     }

    // //     if ( this.patentData ) {
    // //         this.totalCheckBoxArr.push( this.patentData );
    // //     }

    // //     if ( this.innovateGrantData ) {
    // //         this.totalCheckBoxArr.push( this.innovateGrantData );
    // //     }

    // //     if ( this.companyReportParams.hasImportData ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasImportData );
    // //     }

    // //     if ( this.companyReportParams.hasExportData ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasExportData );
    // //     }
        
    // //     // For Related Entities
    // //     if ( this.companyReportParams.hasShareHolders ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasShareHolders );
    // //     }
        
    // //     if ( this.hasCommentary ) {
    // //         this.totalCheckBoxArr.push( this.hasCommentary );
    // //     }

    // //     if ( this.hasDirectors ) {
    // //         this.totalCheckBoxArr.push( this.hasDirectors );
    // //     }

    // //     if ( this.hasPSC ) {
    // //         this.totalCheckBoxArr.push( this.hasPSC );
    // //     }

    // //     if ( this.companyReportParams.hasTradingAddress ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasTradingAddress );
    // //     }

    // //     if ( this.companyReportParams.hasLandCorporate ) {
    // //         this.totalCheckBoxArr.push( this.companyReportParams.hasLandCorporate );
    // //     }

    // //     if ( this.companyReportParams.hasZScore && ( ( this.currentDate.getMonth() + 1 ) <= 4 && ( ( this.currentDate.getFullYear() - 1 ) == this.lastAccountFiledDate.getFullYear() || this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() )  || ( this.currentDate.getMonth() + 1 ) > 4 && this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() ) ) {
    // //         this.totalCheckBoxArr.push( true );
    // //     }

    // //     if ( this.companyReportParams.hasCAGR && ( ( this.currentDate.getMonth() + 1 ) <= 4 && ( ( this.currentDate.getFullYear() - 1 ) == this.lastAccountFiledDate.getFullYear() || this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() )  || ( this.currentDate.getMonth() + 1 ) > 4 && this.currentDate.getFullYear() == this.lastAccountFiledDate.getFullYear() ) ) {
    // //         this.totalCheckBoxArr.push( true );
    // //     }

    // }

    exportCSVToMailDialog() {		
		this.mailFromEnterPriseButtonBool = true;		
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

    getBrandingName(event: any) {
        if( event.value == 'Custom Branding') {
            this.checkBrandingImage();
        }
    }

}
