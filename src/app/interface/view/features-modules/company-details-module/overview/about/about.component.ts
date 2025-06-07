import { TitleCasePipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeIcons } from 'primeng/api';
import {} from 'googlemaps';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import {
    CompaniesEligibleForDataWithoutLogin,
    subscribedPlan,
} from 'src/environments/environment';
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';
import { safeAlertColumns, safeAlertObj } from './safeAlerts.const';

export enum Month {
    undefined,
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
}

declare var google: any;

@Component({
    selector: 'dg-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, AfterViewInit {
    @ViewChild('companyQuickInfoPopover', { static: false })
    private companyQuickInfoPopover: ElementRef;
    @ViewChild('mapContainer') mapElement: any;
    map: google.maps.Map;

    isLoggedIn: boolean = false;
    userDetails: Partial<UserInfoType> = {};

    companyData: unknown;

    companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

    companyName: string;

    domain: any;
    options: any;
    commentry: any;
    infoWindow: any;
    emailAddress: any;
    email_address: string | Array<any>;
    userDetailData: any;
    subscription_id: any;
    contact_number: any;
    director_email: any;
    companyNumber: any;
    linkedin_profile: any;
    company_tradingAs: any;
    finRatioChartData: any;
    emailSpotterLimit: any;
    totalCountForEmails: any;
    subscription_endDate: any;
    finstatutoryChartData: any;
    creditLimitForEmailSpotter: any;
    companiesValuationsNetAssetsChartData: any;
    companiesValuationsTurnoverChartData: any;
    diversityData: any;
    data: any;
    errMessage: any;
    closeModal: boolean = false;
    ctpsChecked: boolean = false;
    emailsListModal: boolean = false;
    showLoginDialog: boolean = false;
    hasFinancailRatios: boolean = false;
    importantEmailsModal: boolean = false;
    importantFetchEmailsModal: boolean = false;
    importantOtherEmailsModal: boolean = false;
    showUpgradePlanDialog: boolean = false;
    showUpgradePlanDialogForClientuser: boolean = false;
    conirmEmailModalDialog: boolean = false;
    showOrHideIndustryModal: Boolean = false;
    showOrHideContactInfoModal: boolean = false;
    showFinancialcard: boolean = true;
    hasFinances: boolean = false;
    safeAlerts: Array<any> = undefined;
    financialDataObject: Object = undefined;
    companyCommentryData: Array<any> = undefined;
    directorOverviewArray: Array<any> = undefined;
    loaderForDiversityBlock: boolean = false;
    enableService: boolean = false;
    diversityButonBoolean: boolean = false;
    noLimit: boolean = false;
    addOnContactInformation: boolean;
    userCreditDeductedForDiBool: boolean = false;

    pscFullName: string;
    colorForRiskBand: string = '';
    selectedCompany: Array<any> = [];

    overlays: any[];
    directorDetails: any = [];
    exactCCJDataColumn: any[];
    possibleCCJDataColumn: any[];
    finstatutoryDataValues: any[];
    possibleCCJData: Array<any>;
    personalContactInfoData: Array<any>;
    safeAlertsColumn: Array<any>;
    finRatioDataValues: Array<any>;
    exactCCJData: Array<any>;
    companyCommentaryColumn: Array<any>;
    personWithSignificantControls: any = [];
    industryTagList: Array<any> = [];
    modifiedRiskBandArr: Array<any> = [];
    selectedIndustryTag: Array<any> = [];
    disqualifiedDeletedExceptionDirectors: Array<any> = [];
    directorFailuresData: Array<any> = [];
    importantEmailsList: Array<any> = [];
    importantEmailsColumns: Array<any>;
    importantEmailsDataValue: Array<any>;
    subscribedPlanModal: any = subscribedPlan;
    diversityNewData: any;

    lengthOfAgeDiversityObject: number = 0;
    totalCCJValue: number = 0;
    overviewNoOfEmployeesData: number;
    disqualifiedDirectorsCount: number = 0;
    nextAnnualReturnDate: any;

    msgs = [];
    message = [];
    diversityAndInclusionMsgs = [];
    overviewEBITDA = [];
    equityRatioChartData = [];
    overviewTurnoverData = [];
    overviewNetWorthData = [];
    currentRatioChartData = [];
    creditorDaysChartData = [];
    overviewTotalAssetsData = [];
    overviewProfitBeforeTax = [];
    totalDebtRatioChartData = [];
    overviewTotalLiabilitiesData = [];
    financialBool: any = {};
    events1: Array<any> = [];
    events2: Array<any> = [];

    finRatioTabChartData: any = {
        chartData1: {},
        chartData2: {},
    };
    companydirectorStatusCounts: any = {
        total: 0,
        active: 0,
        resigned: 0,
        inactive: 0,
        activeSecretary: 0,
    };
    financialCardDatasets: any = {
        statutoryAccounts: {
            estimated_turnover: {},
            estimated_turnover_powered_by_AI: {},
            turnover: {},
            totalAssets: {},
            totalLiabilities: {},
            netWorth: {},
            profitBeforeTax: {},
            EBITDA: {},
        },
    };
    selectedGlobalCountry: string = 'uk';
    selectedGlobalCurrency: string = 'GBP';

    diversityInclusionObject: any = {
        ageDiversityData: {
            below30: undefined,
            '31-50': undefined,
            '51-65': undefined,
            above65: undefined,
        },
    };

    newSafeAlert = safeAlertObj;
    newSafeAlertColumn = safeAlertColumns;

    countryCodemap = new Map();
    countryNameMap = new Map();
    lat: number = 51.5074;
    lng: number = 0.1278;

    monthsEnum: any = Month;
    quickInfoData: any;
    totalEmailFetchedCount: any;

    constantMessages: any = UserInteractionMessages;
    isCtpsChecked: any;
    companyAboutUsFirstLetterCapital: string = '';
    contactInfoNumberOfEmployees: number = 0;
    msgs1 = [];
    rawCompanyAddressFromRegAddressModifiedKey: string = '';
    companyAddressFromRegAddressModifiedKey: string = '';
    finalRegAddress: string = '';
    formationWord: any;

    emailColumn = [
        { field: 'name', header: 'Name', width: '100px', textAlign: 'left' },
        { field: 'email', header: 'Email', width: '200px', textAlign: 'left' },
        // { field: 'emailStatus', header: 'Email Status', width: '80px', textAlign: 'center' },
    ];
    emailFetchColumn = [
        { field: 'name', header: 'Name', width: '200px', textAlign: 'left' },
        { field: 'email', header: 'Email', width: '250px', textAlign: 'left' },
        { field: 'position', header: 'Position', width: 'none', textAlign: 'left' },
        // { field: 'updatedDate', header: 'Last Update Date', width: '140px', textAlign: 'center' },
        // { field: 'emailStatus', header: 'Email Status', width: '80px', textAlign: 'center' },
    ];
    otherEmailColumn = [
        { field: 'full_name', header: 'Person Name', width: '200px', textAlign: 'left' },
        { field: 'position', header: 'Position', width: 'none', textAlign: 'left' },
        // { field: 'linkedeni_url', header: 'Linkedin Url', width: '250px', textAlign: 'left' },
        // { field: 'website', header: 'Website', width: '200px', textAlign: 'left' },
        // { field: 'updatedDate', header: 'Last Update Date', width: '140px', textAlign: 'center' },
        // { field: 'emailStatus', header: 'Email Status', width: '80px', textAlign: 'center' },
    ];
    emailData: any[];
    otherEmailData: any[];

    constructor(
        private commonService: CommonServiceService,
        public userAuthService: UserAuthService,
        private titlecasePipe: TitleCasePipe,
        private router: Router,
        private dataCommunicatorService: DataCommunicatorService,
        private searchFilterService: SearchFiltersService,
        private messageService: MessageService,
        private activateRouter: ActivatedRoute,
        private sharedLoaderService: SharedLoaderService,
        private globalServerCommunication: ServerCommunicationService
    ) {}

    ngOnInit() {
        this.sharedLoaderService.showLoader();
        this.addOnContactInformation =
            this.userAuthService.hasAddOnPermission('contactInformation') ||
            this.userAuthService.hasRolePermission(['Super Admin']);
        this.userAuthService.isLoggedInSubject$
            .pipe(take(1))
            .subscribe((loggedIn) => {
                this.isLoggedIn = loggedIn;

                if (this.isLoggedIn) {
                    this.selectedGlobalCountry = localStorage.getItem(
                        'selectedGlobalCountry'
                    )
                        ? localStorage.getItem('selectedGlobalCountry')
                        : 'uk';
                    this.selectedGlobalCurrency = localStorage.getItem(
                        'selectedGlobalCurrency'
                    )
                        ? localStorage.getItem('selectedGlobalCurrency')
                        : 'GBP';
                    this.userDetails = this.userAuthService?.getUserInfo();
                }
            });

        this.dataCommunicatorService.$dataCommunicatorVar.subscribe(
            (res: any) => (this.companyData = res)
        );

        /* Obtaining Address from Old RegAddress_Modified obejects */

        this.rawCompanyAddressFromRegAddressModifiedKey =
            this.companyData['RegAddress_Modified']['addressLine1'] +
            ', ' +
            this.companyData['RegAddress_Modified']['addressLine2'] +
            ', ' +
            this.companyData['RegAddress_Modified']['addressLine3'] +
            ', ' +
            this.companyData['RegAddress_Modified']['addressLine4'] +
            (this.selectedGlobalCountry == 'uk'
                ? ', ' + this.companyData['RegAddress_Modified']['county']
                : ''); //from API response storing Raw address into a variable.

        if (
            this.companyData['RegAddress_Modified']['postalCode'] &&
            this.selectedGlobalCountry == 'uk'
        ) {
            this.formationWord = (
                this.titlecasePipe.transform(
                    this.rawCompanyAddressFromRegAddressModifiedKey.replace(
                        / ,/g,
                        ''
                    )
                ) +
                ', ' +
                this.companyData['RegAddress_Modified']['postalCode']
                    .toString()
                    .toUpperCase()
            ).split(/\s*,\s*/);
        } else if (
            (this.companyData['RegAddress_Modified']['eirCode'] ||
                this.companyData['RegAddress_Modified']['postalCode']) &&
            this.selectedGlobalCountry !== 'uk'
        ) {
            this.rawCompanyAddressFromRegAddressModifiedKey =
                this.rawCompanyAddressFromRegAddressModifiedKey +
                ', ' +
                this.companyData['RegAddress_Modified']['postalCode'] +
                ', ' +
                this.companyData['RegAddress_Modified']['eirCode'];
            this.formationWord = this.titlecasePipe
                .transform(
                    this.rawCompanyAddressFromRegAddressModifiedKey.replace(
                        / ,/g,
                        ''
                    )
                )
                .toString()
                .toUpperCase()
                .split(/\s*,\s*/);
        } else {
            this.formationWord = this.titlecasePipe
                .transform(
                    this.rawCompanyAddressFromRegAddressModifiedKey.replace(
                        / ,/g,
                        ''
                    )
                )
                .toString()
                .toUpperCase()
                .split(/\s*,\s*/);
        } // Removing whitespace and comma eg:(port sunlight, wirral, merseyside, , merseyside) also Spliting the string into an array of words.

        // this.finalRegAddress = ( [...new Set(this.formationWord)] ).join(', '); // Removing duplicate words and Joining the unique words back into a string.
        this.finalRegAddress =
            this.companyData?.['company_contact_info_latest']?.address;

        /* Final Address to displaying at UI */

        if (this.companyData?.['company_contact_info_latest']?.about_us) {
            this.companyAboutUsFirstLetterCapital =
                this.companyData['company_contact_info_latest']['about_us']
                    .charAt(0)
                    .toUpperCase() +
                this.companyData['company_contact_info_latest']['about_us']
                    .slice(1)
                    .toLowerCase();
        }

        if (this.companyData?.['statutoryAccounts']) {
            this.contactInfoNumberOfEmployees = JSON.parse(
                JSON.stringify(this.companyData)
            )?.['statutoryAccounts'].sort((a, b) => {
                let date1 = a.yearEndDate.split('/').reverse().join('');
                let date2 = b.yearEndDate.split('/').reverse().join('');
                return +date1 < +date2 ? 1 : -1;
            });
            this.contactInfoNumberOfEmployees =
                this.contactInfoNumberOfEmployees[0]?.['numberOfEmployees'];
        }

        this.diversityDataFromGetCompanyOverViewAPI();

        this.hasFinances = this.companyData['hasFinances'];

        this.financialBool = {
            hasFinances: this.hasFinances,
        };
        this.companyNumber = this.companyData['companyRegistrationNumber'];
        this.companyName = this.companyData['businessName'];

        // Start-calcuate next Annual Return Date
        if (this.companyData['latestAnnualReturnDate'] != null) {
            let nextAnnualDate =
                this.companyData['latestAnnualReturnDate'].split('/');
            let dateMonth = nextAnnualDate[0] + '/' + nextAnnualDate[1];
            let nextYear = parseInt(nextAnnualDate[2]) + 1;
            this.nextAnnualReturnDate = dateMonth + '/' + nextYear;
        }
        // END-calcuate next Annual Return Date
        if (!this.companyData['has_estimated_turnover_ml']) {
            delete this.financialCardDatasets['statutoryAccounts'][
                'estimated_turnover_powered_by_AI'
            ];
        }

        Object.keys(this.financialCardDatasets).map((parentKey) => {
            Object.keys(this.financialCardDatasets[parentKey]).map(
                async (childKey) => {
                    const finDataAll = await this.companyData[parentKey];
                    if (finDataAll)
                        finDataAll.sort(
                            (a, b) =>
                                a['yearEndDate'].split('/')[2] -
                                b['yearEndDate'].split('/')[2]
                        );

                    if (childKey !== 'revenue' && finDataAll) {
                        if (
                            finDataAll[finDataAll.length - 1]['turnover'] ===
                                0 ||
                            finDataAll[finDataAll.length - 1]['turnover'] ===
                                null
                        ) {
                            delete this.financialCardDatasets[
                                'statutoryAccounts'
                            ]['turnover'];
                        } else {
                            delete this.financialCardDatasets[
                                'statutoryAccounts'
                            ]['estimated_turnover'];
                        }

                        // this.overviewNoOfEmployeesData = finDataAll[finDataAll.length - 1]['numberOfEmployees'] ? finDataAll[finDataAll.length - 1]['numberOfEmployees'] : 0;

                        let latestYearValue = finDataAll.length
                                ? finDataAll[finDataAll.length - 1][childKey]
                                    ? parseFloat(
                                          finDataAll[finDataAll.length - 1][
                                              childKey
                                          ]
                                      )
                                    : 0
                                : 0,
                            previousYearValue =
                                finDataAll.length > 1
                                    ? finDataAll[finDataAll.length - 2][
                                          childKey
                                      ]
                                        ? parseFloat(
                                              finDataAll[finDataAll.length - 2][
                                                  childKey
                                              ]
                                          )
                                        : 0
                                    : 0;

                        this.financialCardDatasets[parentKey][childKey] = {
                            latestYearValue: latestYearValue,
                            previousYearValue: previousYearValue,
                            diffPercentageValue: this.checkPercentageDiff(
                                latestYearValue,
                                previousYearValue
                            ),
                            chartDatasets:
                                finDataAll && finDataAll.length
                                    ? this.createMiniLineChartDataset(
                                          finDataAll,
                                          childKey
                                      )
                                    : 0,
                            valueType: this.selectedGlobalCurrency,
                        };
                    } else {
                        this.showFinancialcard = false;
                    }
                }
            );
        });

        if (this.companyData['hasSafeAlerts'] && this.isLoggedIn) {
            for (let i = 0; i < this.companyData['safeAlerts'].length; i++) {
                if (
                    this.companyData['safeAlerts'][i].alertCodeTitle ==
                    'multiple key changes'
                ) {
                    this.companyData['safeAlerts'][i].alertCodeTitle =
                        'Multiple Indicators';
                }
            }
            this.getSafeAlertsData(this.companyData['safeAlerts']);
        }

        if (
            (this.companyData['hasCompanyCommentary'] && this.isLoggedIn) ||
            !this.isLoggedIn
        ) {
            this.getCompanyCommentaryData(
                this.companyData['companyCommentary']
            );
        }

        if (
            this.companyData['pscDetails'] &&
            this.companyData['pscDetails'].length
        ) {
            this.companyData['pscDetails'].sort((a, b) => {
                if (['current', 'active'].includes(b.stat)) {
                    return 1;
                }
                return -1;
            });

            let temppscDetails = JSON.parse(JSON.stringify(this.companyData));
            this.companyData['pscDetails'] = [];
            if (
                !this.companyData.hasOwnProperty(
                    'pscStatementControlPersonDetails'
                )
            )
                this.companyData['pscStatementControlPersonDetails'] = [];
            if (!this.companyData.hasOwnProperty('pscSuperSecurePersonDetails'))
                this.companyData['pscSuperSecurePersonDetails'] = [];

            temppscDetails['pscDetails'].filter((element) => {
                if (
                    element.controlType &&
                    element.controlType ==
                        'persons-with-significant-control-statement'
                ) {
                    this.companyData['pscStatementControlPersonDetails'].push(
                        element
                    );
                }
                if (
                    element.controlType &&
                    element.controlType ==
                        'super-secure-person-with-significant-control'
                ) {
                    this.companyData['pscSuperSecurePersonDetails'].push(
                        element
                    );
                }
                if (element.pscName && element.pscName !== null) {
                    this.companyData['pscDetails'].push(element);
                }
                if (element.pscName) {
                    if (
                        element.pscName['name'] &&
                        element.pscName['name']['name']
                    ) {
                        element.pscName = element.pscName['name'];
                    }

                    element.pscName = element.pscName['name']
                        ? this.titlecasePipe.transform(element.pscName['name'])
                        : this.titlecasePipe.transform(element.pscName);
                }
            });
            for (let i = 0; i < this.companyData['pscDetails'].length; i++) {
                if (
                    this.companyData['pscDetails'][i].pscName !== undefined ||
                    this.companyData['pscDetails'][i].pscName !== null ||
                    this.companyData['pscDetails'][i].pscName !== ''
                ) {
                    this.personWithSignificantControls[i] =
                        this.companyData['pscDetails'][i];
                }
            }
            for (
                var i = 0;
                i < this.personWithSignificantControls.length;
                i++
            ) {
                if (
                    this.personWithSignificantControls[i].nationality !==
                        undefined &&
                    this.personWithSignificantControls[i].nationality !== null
                ) {
                    if (
                        this.personWithSignificantControls[i].nationality ==
                        'english'
                    ) {
                        if (this.countryCodemap.has('british')) {
                            this.personWithSignificantControls[i][
                                'countryCode'
                            ] = this.countryCodemap.get('british');
                        }
                    } else {
                        if (
                            this.countryCodemap.has(
                                this.personWithSignificantControls[
                                    i
                                ].nationality.toLowerCase()
                            )
                        ) {
                            this.personWithSignificantControls[i][
                                'countryCode'
                            ] = this.countryCodemap.get(
                                this.personWithSignificantControls[
                                    i
                                ].nationality.toLowerCase()
                            );
                        }
                    }
                }

                if (
                    this.personWithSignificantControls[i].countryOfResidence !==
                    undefined
                ) {
                    if (
                        this.personWithSignificantControls[i]
                            .countryOfResidence !== null
                    ) {
                        if (
                            this.countryNameMap.has(
                                this.personWithSignificantControls[
                                    i
                                ].countryOfResidence.toLowerCase()
                            )
                        ) {
                            this.personWithSignificantControls[i][
                                'countryResidenceCode'
                            ] = this.countryNameMap.get(
                                this.personWithSignificantControls[
                                    i
                                ].countryOfResidence.toLowerCase()
                            );
                        }
                    }
                }
                let natureofcontrols = [];
                natureofcontrols =
                    this.companyData['pscDetails'][i].natureOfControl.split(
                        ','
                    );
                this.companyData['pscDetails'][i]['natures_of_control'] =
                    natureofcontrols;
                if (
                    natureofcontrols !== undefined &&
                    natureofcontrols !== null
                ) {
                    for (var j = 0; j < natureofcontrols.length; j++) {
                        if (
                            this.personWithSignificantControls[
                                i
                            ].natures_of_control[j].indexOf('percent') > -1
                        ) {
                            var ownership =
                                this.personWithSignificantControls[i]
                                    .natures_of_control[j];
                            ownership = ownership.replace(/-/g, ' ');
                            let newOwnership =
                                ownership.substring(
                                    0,
                                    ownership.lastIndexOf(' ')
                                ) + ' %';
                            let newowner1 = newOwnership.replace(/to/g, '-');
                            this.personWithSignificantControls[
                                i
                            ].natures_of_control[j] = newowner1;
                        } else {
                            var ownership =
                                this.personWithSignificantControls[i]
                                    .natures_of_control[j];
                            ownership = ownership.replace(/-/g, ' ');
                            this.personWithSignificantControls[
                                i
                            ].natures_of_control[j] = ownership;
                        }
                    }
                }

                let tempDateOfBirth =
                    this.companyData['pscDetails'][i].dataOfBirth;
                if (
                    tempDateOfBirth !== undefined &&
                    tempDateOfBirth !== null &&
                    tempDateOfBirth !== ''
                ) {
                    if (typeof tempDateOfBirth == 'string') {
                        let date_of_birth = {
                            month: `${
                                Month[parseInt(tempDateOfBirth.split('/')[0])]
                            }`,
                            year: `${tempDateOfBirth.split('/')[1]}`,
                        };
                        this.personWithSignificantControls[i].dataOfBirth =
                            date_of_birth;
                    }
                }
                let address = this.pscAddress(
                    this.personWithSignificantControls[i]
                );
                this.personWithSignificantControls[i]['pscAddress'] = address;
                // if ()

                let pscNameObj = {
                    name: this.personWithSignificantControls[i].pscName,
                    link: this.personWithSignificantControls[i].links,
                };

                this.personWithSignificantControls[i]['pscName'] = pscNameObj;
            }

            if (
                this.companyData['pscStatementControlPersonDetails'].length > 0
            ) {
                for (
                    var i = 0;
                    i <
                    this.companyData['pscStatementControlPersonDetails'].length;
                    i++
                ) {
                    this.companyData['pscStatementControlPersonDetails'][i][
                        'description'
                    ] =
                        'The company knows or has reasonable cause to believe that there is a registrable person in relation to the company but it has not identified the registrable person.';
                    this.companyData['pscStatementControlPersonDetails'][i][
                        'psc_statement_notified_date'
                    ] =
                        this.companyData['pscStatementControlPersonDetails'][
                            i
                        ].notifiedDate;
                    this.companyData['pscStatementControlPersonDetails'][i][
                        'psc_statement_status'
                    ] =
                        this.companyData['pscStatementControlPersonDetails'][
                            i
                        ].stat;
                    if (
                        this.companyData['pscStatementControlPersonDetails'][i]
                            .stat == 'ceased'
                    ) {
                        this.companyData['pscStatementControlPersonDetails'][i][
                            'psc_statement_ceased_date'
                        ] =
                            this.companyData[
                                'pscStatementControlPersonDetails'
                            ][i].ceasedDate;
                    } else {
                        this.companyData['pscStatementControlPersonDetails'][i][
                            'psc_statement_ceased_date'
                        ] = '-';
                    }
                }
            }
            if (this.companyData['pscSuperSecurePersonDetails'].length > 0) {
                for (
                    var i = 0;
                    i < this.companyData['pscSuperSecurePersonDetails'].length;
                    i++
                ) {
                    this.companyData['pscSuperSecurePersonDetails'][i][
                        'description'
                    ] =
                        "The person with significant control's details are not shown because restrictions on using or disclosing any of the individual’s particulars are in force under regulations under section 790ZG in relation to this company.";
                    this.companyData['pscSuperSecurePersonDetails'][i][
                        'psc_protected_status'
                    ] = this.companyData['pscSuperSecurePersonDetails'][i].stat;
                }
            }
        }

        if (this.companyData['directorsData']) {
            if (this.companyData['companyStatus'] === 'dissolved') {
                this.companydirectorStatusCounts.total =
                    this.companyData['totalDirectorsCount'];
                this.companydirectorStatusCounts.active = 0;
                this.companydirectorStatusCounts.inactive =
                    this.companyData['activeDirectorsCount'] +
                    this.companyData['activeSecretary'];
                this.companydirectorStatusCounts.resigned =
                    this.companyData['resignedDirectorsCount'];
            } else {
                this.companydirectorStatusCounts.total =
                    this.companyData['totalDirectorsCount'];
                this.companydirectorStatusCounts.active =
                    this.companyData['activeDirectorsCount'] +
                    this.companyData['activeSecretary'];
                this.companydirectorStatusCounts.inactive = 0;
                this.companydirectorStatusCounts.resigned =
                    this.companyData['resignedDirectorsCount'];
            }

            this.directorDetails = this.companyData['directorsData'];

            let directorAge: any;
            let DirectorResignedArray = [];
            let DirectorActiveArray = [];
            let DirectorInactiveArray = [];

            this.directorDetails = this.directorDetails.sort((a, b): any => {
                let prevResignedDate: any = this.commonService.changeToDate(
                        a.fromDate
                    ),
                    newResignedDate: any = this.commonService.changeToDate(
                        b.fromDate
                    );
                if (prevResignedDate < newResignedDate) return -1;
                if (prevResignedDate > newResignedDate) return 1;
            });

            this.directorDetails = this.directorDetails.sort((a, b): any => {
                let prevResignedDate: any = this.commonService.changeToDate(
                        a.toDate
                    ),
                    newResignedDate: any = this.commonService.changeToDate(
                        b.toDate
                    );
                if (prevResignedDate < newResignedDate) return -1;
                if (prevResignedDate > newResignedDate) return 1;
            });

            for (let i = 0; i < this.directorDetails.length; i++) {
                this.directorDetails[i]['companyRegistrationNumber'] =
                    this.companyData['companyRegistrationNumber'];
                this.directorDetails[i]['businessName'] =
                    this.companyData['businessName'];

                if (this.directorDetails[i].detailedInformation) {
                    if (
                        this.directorDetails[i].detailedInformation.nationality
                    ) {
                        if (
                            this.countryCodemap.has(
                                this.directorDetails[i].detailedInformation
                                    .nationality
                            )
                        ) {
                            this.directorDetails[i]['countryCode'] =
                                this.countryCodemap.get(
                                    this.directorDetails[
                                        i
                                    ].detailedInformation.nationality.toLowerCase()
                                );
                        }
                    }

                    if (
                        this.directorDetails[i].detailedInformation &&
                        this.directorDetails[i].detailedInformation
                            .nationality &&
                        this.directorDetails[i].detailedInformation
                            .nationality != undefined
                    ) {
                        this.directorDetails[i]['nationality'] =
                            this.directorDetails[
                                i
                            ].detailedInformation.nationality;
                    }

                    if (
                        this.directorDetails[i].detailedInformation &&
                        this.directorDetails[i].detailedInformation.country &&
                        this.directorDetails[i].detailedInformation.country !=
                            '' &&
                        this.directorDetails[i].detailedInformation.country !=
                            null &&
                        this.directorDetails[i].detailedInformation.country !=
                            undefined
                    ) {
                        this.directorDetails[i]['country'] =
                            this.directorDetails[i].detailedInformation.country;
                    }

                    this.directorDetails[i]['full_name'] =
                        this.directorDetails[i].detailedInformation.fullName;
                    let otherRelationsObj = {
                        name: this.directorDetails[i].full_name,
                        link: this.directorDetails[i].directorPnr,
                        role: this.directorDetails[i].directorRole,
                    };

                    this.directorDetails[i]['otherRelations'] =
                        otherRelationsObj;

                    let dNameObj = {
                        name: this.directorDetails[i].full_name,
                        link: this.directorDetails[i].directorPnr,
                    };

                    this.directorDetails[i]['dName'] = dNameObj;

                    if (
                        this.directorDetails[i].detailedInformation !==
                            undefined &&
                        this.directorDetails[i].detailedInformation !== null
                    ) {
                        let data = this.directorDetails[i].detailedInformation;
                        let address1 = '';
                        if (
                            data.addressLine1 !== undefined &&
                            data.addressLine1 !== null &&
                            data.addressLine1 !== ''
                        ) {
                            address1 = this.titlecasePipe.transform(
                                data.addressLine1
                            );
                        }
                        if (
                            data.addressLine2 !== undefined &&
                            data.addressLine2 !== null &&
                            data.addressLine2 !== ''
                        ) {
                            address1 =
                                address1 +
                                ', ' +
                                this.titlecasePipe.transform(data.addressLine2);
                        }
                        if (
                            data.addressLine3 !== undefined &&
                            data.addressLine3 !== null &&
                            data.addressLine3 !== ''
                        ) {
                            address1 =
                                address1 +
                                ', ' +
                                this.titlecasePipe.transform(data.addressLine3);
                        }
                        if (
                            data.addressLine4 !== undefined &&
                            data.addressLine4 !== null &&
                            data.addressLine4 !== ''
                        ) {
                            address1 =
                                address1 +
                                ', ' +
                                this.titlecasePipe.transform(data.addressLine4);
                        }
                        if (
                            data.addressLine5 !== undefined &&
                            data.addressLine5 !== null &&
                            data.addressLine5 !== ''
                        ) {
                            address1 =
                                address1 +
                                ', ' +
                                this.titlecasePipe.transform(data.addressLine5);
                        }
                        if (
                            data.country !== undefined &&
                            data.country !== null &&
                            data.country !== ''
                        ) {
                            address1 =
                                address1 +
                                ', ' +
                                this.titlecasePipe.transform(data.country);
                        }
                        if (
                            data.postalCode !== undefined &&
                            data.postalCode !== null &&
                            data.postalCode !== ''
                        ) {
                            address1 =
                                address1 +
                                ', ' +
                                data.postalCode.toString().toUpperCase();
                        }
                        this.directorDetails[i]['address1'] = address1;
                    }

                    let address2 = this.formatDirectorAddress(
                        this.directorDetails[i].serviceAddress
                    );
                    this.directorDetails[i]['address2'] = address2;

                    if (
                        this.directorDetails[i].detailedInformation
                            .birthdDate !== undefined &&
                        this.directorDetails[i].detailedInformation
                            .birthdDate !== null
                    ) {
                        let date_of_birth_obj = {
                            date: this.directorDetails[
                                i
                            ].detailedInformation.birthdDate.split('/')[0],
                            month: this.directorDetails[
                                i
                            ].detailedInformation.birthdDate.split('/')[1],
                            year: this.directorDetails[
                                i
                            ].detailedInformation.birthdDate.split('/')[2],
                        };

                        // this.directorDetailData[0]['directorData']['detailedInformation']['countryCode'] = dirDetailData.directorData['countryCode'];

                        directorAge = this.directorsAge(date_of_birth_obj);
                        this.directorDetails[i]['date_of_birth'] = `${
                            Month[parseInt(date_of_birth_obj.month)]
                        }, ${date_of_birth_obj.year}`;
                        this.directorDetails[i]['age'] = directorAge;
                    } else {
                        this.directorDetails[i]['age'] = '';
                    }
                }

                // if (this.directorDetails[i].toDate !== undefined && this.directorDetails[i].toDate !== null) {
                // 	let toDate = this.directorDetails[i].toDate.toString().split("/").includes('/') ? this.directorDetails[i].toDate.split("/") : this.directorDetails[i].toDate;
                // 	this.directorDetails[i].toDate = new Date(toDate[2], parseInt(toDate[1]) - 1, toDate[0]);
                // }
                // if (this.directorDetails[i].fromDate !== undefined && this.directorDetails[i].fromDate !== null) {
                // 	let fromDate = this.directorDetails[i].fromDate.split("/");
                // 	this.directorDetails[i].fromDate = new Date(fromDate[2], parseInt(fromDate[1]) - 1, fromDate[0]);
                // }

                if (
                    (this.directorDetails[i].toDate === null ||
                        this.directorDetails[i].toDate === undefined ||
                        this.directorDetails[i].toDate === '') &&
                    this.companyData['companyStatus'] !== 'dissolved'
                ) {
                    this.directorDetails[i]['status'] = 'active';
                    DirectorActiveArray.push(this.directorDetails[i].toDate);
                } else if (
                    (this.directorDetails[i].toDate === null ||
                        this.directorDetails[i].toDate === undefined ||
                        this.directorDetails[i].toDate === '') &&
                    this.companyData['companyStatus'] === 'dissolved'
                ) {
                    this.directorDetails[i]['status'] = 'inactive';
                    DirectorInactiveArray.push(this.directorDetails[i].toDate);
                } else {
                    if (
                        this.directorDetails[i].appointment &&
                        this.directorDetails[i].appointment !==
                            'previous appointment'
                    ) {
                        if (this.companyData['companyStatus'] === 'dissolved') {
                            this.directorDetails[i]['status'] = 'inactive';
                        } else {
                            this.directorDetails[i]['status'] = 'active';
                        }
                        DirectorResignedArray.push(undefined);
                    } else {
                        this.directorDetails[i]['status'] = 'resigned';
                        DirectorResignedArray.push(
                            this.directorDetails[i].toDate
                        );
                    }
                }
                if (this.directorDetails[i].directorPnr) {
                    this.disqualifiedDeletedExceptionDirectors.push(
                        this.directorDetails[i].directorPnr
                    );
                }

                let personalContactInformation = this.companyData[
                    'person_contact_info_latest'
                ]
                    ? this.companyData['person_contact_info_latest']
                    : [];

                /** Integrate Person Contact Info Data Start  */
                // this.directorDetails[i]["directorEmail"] = "";
                // this.directorDetails[i]["linkedin_url"] = "";
                // this.directorDetails[i]["twitter_url"] = "";
                this.directorDetails[i]['tel_1'] = '';
                // this.directorDetails[i]["facebook_url"] = "";
                this.directorDetails[i]['jobTitle'] = '';

                if (personalContactInformation.length > 0) {
                    for (
                        let k = 0;
                        k < personalContactInformation.length;
                        k++
                    ) {
                        if (
                            personalContactInformation[k].pnr &&
                            !isNaN(personalContactInformation[k].pnr) &&
                            parseInt(personalContactInformation[k].pnr) ==
                                parseInt(this.directorDetails[i].directorPnr)
                        ) {
                            if (!this.directorDetails[i]['linkedin_url']) {
                                this.directorDetails[i]['linkedin_url'] =
                                    personalContactInformation[k].linkedin_url
                                        ? personalContactInformation[k]
                                              .linkedin_url
                                        : '';
                            }
                            if (!this.directorDetails[i]['directorEmail']) {
                                this.directorDetails[i]['directorEmail'] =
                                    personalContactInformation[k].email_gen1
                                        ? personalContactInformation[k]
                                              .email_gen1
                                        : personalContactInformation[k].email_1
                                        ? personalContactInformation[k].email_1
                                        : '';
                            }
                            if (!this.directorDetails[i]['tel_1']) {
                                this.directorDetails[i]['tel_1'] =
                                    personalContactInformation[k].tel_1
                                        ? personalContactInformation[k].tel_1
                                        : '';
                            }
                            if (!this.directorDetails[i]['jobTitle']) {
                                this.directorDetails[i]['jobTitle'] =
                                    personalContactInformation[k].job_title
                                        ? personalContactInformation[k]
                                              .job_title
                                        : '';
                            }
                            // break
                        } else if (
                            this.directorDetails[i].detailedInformation &&
                            personalContactInformation[k].first_name
                        ) {
                            let personalContactInformation_first_name =
                                personalContactInformation[k].first_name;
                            let personalContactInformation_last_name =
                                personalContactInformation[k].last_name
                                    ? personalContactInformation[k].last_name
                                    : '';
                            let personalContactInformation_first_name_1 =
                                personalContactInformation[k].first_name
                                    ? personalContactInformation[
                                          k
                                      ].first_name.slice(0, 3)
                                    : '';
                            let personalContactInformation_full_name = (
                                personalContactInformation_first_name +
                                personalContactInformation_last_name
                            ).toLowerCase();
                            let personalContactInformation_full_name_1 = (
                                personalContactInformation_first_name_1 +
                                personalContactInformation_last_name
                            ).toLowerCase();

                            let detailedInformation_first_name = this
                                .directorDetails[i].detailedInformation.forename
                                ? this.directorDetails[i].detailedInformation
                                      .forename
                                : '';
                            let detailedInformation_last_name = this
                                .directorDetails[i].detailedInformation.surname
                                ? this.directorDetails[i].detailedInformation
                                      .surname
                                : '';
                            let detailedInformation_first_name_1 = this
                                .directorDetails[i].detailedInformation.forename
                                ? this.directorDetails[
                                      i
                                  ].detailedInformation.forename.slice(0, 3)
                                : '';
                            let detailedInformation__full_name = (
                                detailedInformation_first_name +
                                detailedInformation_last_name
                            ).toLowerCase();
                            let detailedInformation__full_name_1 = (
                                detailedInformation_first_name_1 +
                                detailedInformation_last_name
                            ).toLowerCase();
                            if (
                                detailedInformation__full_name ===
                                personalContactInformation_full_name
                            ) {
                                if (!this.directorDetails[i]['linkedin_url']) {
                                    this.directorDetails[i]['linkedin_url'] =
                                        personalContactInformation[k]
                                            .linkedin_url
                                            ? personalContactInformation[k]
                                                  .linkedin_url
                                            : '';
                                }
                                if (!this.directorDetails[i]['directorEmail']) {
                                    this.directorDetails[i]['directorEmail'] =
                                        personalContactInformation[k].email_gen1
                                            ? personalContactInformation[k]
                                                  .email_gen1
                                            : personalContactInformation[k]
                                                  .email_1
                                            ? personalContactInformation[k]
                                                  .email_1
                                            : '';
                                }
                                if (!this.directorDetails[i]['tel_1']) {
                                    this.directorDetails[i]['tel_1'] =
                                        personalContactInformation[k].tel_1
                                            ? personalContactInformation[k]
                                                  .tel_1
                                            : '';
                                }
                                if (!this.directorDetails[i]['jobTitle']) {
                                    this.directorDetails[i]['jobTitle'] =
                                        personalContactInformation[k].job_title
                                            ? personalContactInformation[k]
                                                  .job_title
                                            : '';
                                }
                                // break
                            } else if (
                                detailedInformation__full_name_1 ===
                                personalContactInformation_full_name_1
                            ) {
                                if (!this.directorDetails[i]['linkedin_url']) {
                                    this.directorDetails[i]['linkedin_url'] =
                                        personalContactInformation[k]
                                            .linkedin_url
                                            ? personalContactInformation[k]
                                                  .linkedin_url
                                            : '';
                                }
                                if (!this.directorDetails[i]['directorEmail']) {
                                    this.directorDetails[i]['directorEmail'] =
                                        personalContactInformation[k].email_gen1
                                            ? personalContactInformation[k]
                                                  .email_gen1
                                            : personalContactInformation[k]
                                                  .email_1
                                            ? personalContactInformation[k]
                                                  .email_1
                                            : '';
                                }
                                if (!this.directorDetails[i]['tel_1']) {
                                    this.directorDetails[i]['tel_1'] =
                                        personalContactInformation[k].tel_1
                                            ? personalContactInformation[k]
                                                  .tel_1
                                            : '';
                                }
                                if (!this.directorDetails[i]['jobTitle']) {
                                    this.directorDetails[i]['jobTitle'] =
                                        personalContactInformation[k].job_title
                                            ? personalContactInformation[k]
                                                  .job_title
                                            : '';
                                }
                            }
                        }
                    }
                } else {
                    this.directorDetails[i]['directorEmail'] = '';
                    this.directorDetails[i]['linkedin_url'] = '';
                    this.directorDetails[i]['tel_1'] = '';
                    this.directorDetails[i]['jobTitle'] = '';
                }
                /** Integrate Person Contact Info Data End */
            }
            if (this.isLoggedIn) {
                this.disqualifiedDirectorDetails();
            }

            this.directorOverviewArray = this.directorDetails.filter(
                (obj) => obj.status == 'active'
            );

            this.companyData['directorsData'] = this.directorDetails.sort(
                (a, b) => (a.status > b.status ? 1 : -1)
            );
        }
        if (this.companyData['personalContactInformation']) {
            this.personalContactInfoData =
                this.companyData['personalContactInformation'];

            for (let personInfoDetail of this.personalContactInfoData) {
                if (personInfoDetail) {
                    let fullname = '';

                    if (
                        personInfoDetail.first_name &&
                        personInfoDetail.first_name != 'null'
                    ) {
                        fullname = personInfoDetail.first_name + ' ';
                    }
                    if (
                        personInfoDetail.middle_name &&
                        personInfoDetail.middle_name != 'null'
                    ) {
                        fullname += personInfoDetail.middle_name + ' ';
                    }
                    if (
                        personInfoDetail.last_name &&
                        personInfoDetail.last_name != 'null'
                    ) {
                        fullname += personInfoDetail.last_name + ' ';
                    }
                    if (
                        personInfoDetail.email_gen1 &&
                        personInfoDetail.email_gen1 !== ' ' &&
                        personInfoDetail.email_gen1 !== 'null'
                    ) {
                        personInfoDetail['directorEmail'] =
                            personInfoDetail.email_gen1;
                    }

                    if (
                        personInfoDetail.linkedin_url &&
                        personInfoDetail.linkedin_url != ' ' &&
                        personInfoDetail.linkedin_url != '0' &&
                        personInfoDetail.linkedin_url !== 'null'
                    ) {
                        personInfoDetail['linkedin_url'] =
                            personInfoDetail.linkedin_url.replace(
                                'https://www.',
                                ''
                            );
                        personInfoDetail['linkedin_url'] =
                            'https://www.' + personInfoDetail['linkedin_url'];
                    }

                    personInfoDetail['companyName'] =
                        personInfoDetail.company_name;
                    personInfoDetail['companyNumber'] =
                        personInfoDetail.company_reg;
                    personInfoDetail['dName'] =
                        fullname && fullname ? fullname : '-';
                    personInfoDetail['jobTitle'] = personInfoDetail.job_title;
                    personInfoDetail['create_date'] =
                        this.commonService.changeToDate(
                            personInfoDetail.create_date
                        );
                    personInfoDetail['logo'] =
                        this.companyData['companyContactInformation'] &&
                        this.companyData['companyContactInformation'].length >
                            0 &&
                        this.companyData['companyContactInformation'][0].logo
                            ? this.companyData['companyContactInformation'][0]
                                  .logo
                            : '';
                }
            }
        }
        if (this.companyData['pin'] && this.companyData['pin'] !== null) {
            if (
                this.companyData['pin'].companyLocation !== undefined &&
                this.companyData['pin'] !== null
            ) {
                this.lat = this.companyData['pin'].companyLocation.lat;
                this.lng = this.companyData['pin'].companyLocation.lon;
                // this.options = {
                // 	center: { lat: this.lat, lng: this.lng },
                // 	zoom: 8
                // };

                setTimeout(() => {
                    const mapProperties = {
                        center: new google.maps.LatLng(this.lat, this.lng),
                        zoom: 8,
                    };
                    this.map = new google.maps.Map(
                        this.mapElement.nativeElement,
                        mapProperties
                    );
                }, 1000);

                // this.infoWindow = new google.maps.InfoWindow();

                let markerTitle =
                    this.titlecasePipe.transform(
                        this.companyData['businessName']
                    ) +
                    ' , ' +
                    this.commonService.formatCompanyAddress(
                        this.companyData['RegAddress_Modified']
                    );

                setTimeout(() => {
                    new google.maps.Marker({
                        position: { lat: this.lat, lng: this.lng },
                        title: markerTitle,
                        map: this.map,
                    });
                }, 1000);
            }
        }

        if (
            (this.companyData['hasCCJInfo'] && this.isLoggedIn) ||
            !this.isLoggedIn
        ) {
            this.getExactCCJData(this.companyData['ccjDetails']);
        }

        if (
            (this.companyData['hasPossibleCCJInfo'] && this.isLoggedIn) ||
            !this.isLoggedIn
        ) {
            this.getPossibleCCJData();
        }
        if (
            this.companyData['directorFailuresData'] &&
            this.companyData['directorFailuresData'].length
        ) {
            this.directorFailuresData =
                this.companyData['directorFailuresData'];
        }

        if (
            this.companyData['riskBandHistoryData'] &&
            this.companyData['riskBandHistoryData'].length
        ) {
            this.getRiskBandsHistory();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();

            let scrollToDivId = localStorage.getItem('scrollToDivId');
            if (scrollToDivId) {
                let target = document.getElementById(scrollToDivId);

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }

                localStorage.removeItem('scrollToDivId');
            }
        }, 1000);
    }

    createMiniLineChartDataset(inputValues, dataKey) {
        let outputDataset,
            colorRGBForChartPositive = '21 195 129',
            colorRGBForChartNegative = '176 0 32',
            barBgColors = [],
            chartLabels = inputValues.map(
                (val) => val['yearEndDate'].split('/')[2]
            ),
            chartData = inputValues.map((val) =>
                val[dataKey] ? parseFloat(val[dataKey]) : 0
            );

        outputDataset = {
            labels: chartLabels.splice(-5),
            datasets: [
                {
                    title: dataKey,
                    data: chartData.splice(-5),
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderWidth: 1,
                    borderColor: [],
                    hoverBorderColor: [],
                },
            ],
        };

        barBgColors = [];

        for (let { value, cagr } of inputValues) {
            if ((value || cagr) < 0) {
                barBgColors.push(`rgb( ${colorRGBForChartNegative} / 50% )`);
            } else {
                barBgColors.push(`rgb( ${colorRGBForChartPositive} / 50% )`);
            }
        }

        outputDataset.datasets[0]['backgroundColor'] = barBgColors;
        outputDataset.datasets[0]['hoverBackgroundColor'] = barBgColors.map(
            (val) => val.replace('/ 50%', '')
        );
        outputDataset.datasets[0]['borderColor'] = barBgColors.map((val) =>
            val.replace('/ 50%', '')
        );
        outputDataset.datasets[0]['hoverBorderColor'] = barBgColors.map((val) =>
            val.replace('/ 50%', '')
        );

        return outputDataset;
    }

    checkPercentageDiff(latestYearValue, previousYearValue): any {
        let increased = { increased: 0 },
            decreased = { decreased: 0 },
            equal = { equal: 0 };

        if (previousYearValue) {
            if (latestYearValue > previousYearValue) {
                increased.increased =
                    ((latestYearValue - previousYearValue) /
                        previousYearValue) *
                    100;
                increased.increased =
                    increased.increased < 0
                        ? increased.increased * -1
                        : increased.increased;
                return increased;
            } else if (latestYearValue < previousYearValue) {
                decreased.decreased =
                    ((previousYearValue - latestYearValue) /
                        previousYearValue) *
                    100;
                decreased.decreased =
                    decreased.decreased < 0
                        ? decreased.decreased * -1
                        : decreased.decreased;
                return decreased;
            }

            return equal;
        }

        return;
    }

    GoogleURLCompanyURLwithoutWordCompany(companyName: any) {
        return this.commonService.GoogleURLCompanyURLwithoutWordCompany(
            companyName
        );
    }

    linkedinURLForCompany(companyName: any) {
        return this.commonService.linkedinURLForCompany(companyName);
    }

    GoogleURLCompanyURL(companyName: any) {
        return this.commonService.GoogleURLCompanyURL(companyName);
    }

    onUpdateInfo() {
        this.showOrHideContactInfoModal = true;

        if (
            this.companyData['company_contact_info_latest']['website'] &&
            this.companyData['company_contact_info_latest']['website'].length >
                0 &&
            this.companyData['company_contact_info_latest']['website']
        ) {
            this.domain = this.companyData['company_contact_info_latest'][
                'website'
            ]
                ? this.companyData['company_contact_info_latest']['website']
                : '-';
        }
        // else {
        // 	this.domain = this.companyData['RegAddress_Modified'] && this.companyData['RegAddress_Modified'].website ? this.companyData['RegAddress_Modified'].website : "";
        // }

        this.email_address =
            this.companyData['companyContactInformation'][0].email_gen1 || '';

        // this.company_tradingAs = this.companyData['companyContactInformation'] && this.companyData['companyContactInformation'].length > 0 && this.companyData['companyContactInformation'][0].company_tradingAs ? this.companyData['companyContactInformation'][0].company_tradingAs : "";
        this.company_tradingAs =
            this.companyData['company_contact_info_latest'] &&
            this.companyData['company_contact_info_latest']['company_tradingAs']
                ? this.companyData['company_contact_info_latest'][
                      'company_tradingAs'
                  ]
                : '';

        this.linkedin_profile =
            this.companyData['companyContactInformation'] &&
            this.companyData['companyContactInformation'].length > 0 &&
            this.companyData['companyContactInformation'][0].linkedin_url
                ? this.companyData['companyContactInformation'][0].linkedin_url
                : '';

        if (
            this.companyData['companyContactInformation'] &&
            this.companyData['companyContactInformation'].length > 0 &&
            this.companyData['companyContactInformation'][0].ctps &&
            this.companyData['companyContactInformation'][0].ctps != ''
        ) {
            if (this.companyData['companyContactInformation'][0].ctps === 'y') {
                this.ctpsChecked = true;
            } else {
                this.ctpsChecked = false;
            }
        } else {
            if (this.companyData['RegAddress_Modified'].ctps === 'y') {
                this.ctpsChecked = true;
            } else {
                this.ctpsChecked = false;
            }
        }

        if (
            this.companyData['companyContactInformation'] &&
            this.companyData['companyContactInformation'].length > 0 &&
            this.companyData['companyContactInformation'][0].tel_1
        ) {
            this.contact_number =
                this.companyData['companyContactInformation'][0].tel_1;
        } else {
            this.contact_number =
                this.companyData['RegAddress_Modified'] &&
                this.companyData['RegAddress_Modified'].telephone
                    ? this.companyData['RegAddress_Modified'].telephone
                    : '';
        }
    }

    onUpdateInformation() {
        if (this.linkedin_profile != '' && this.linkedin_profile != undefined) {
            if (this.linkedin_profile.includes('https://')) {
                this.linkedin_profile = this.linkedin_profile;
            } else {
                this.linkedin_profile = 'https://' + this.linkedin_profile;
            }
        }

        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            company_name: this.companyData['businessName'],
            domain: this.domain,
            email_address:
                typeof this.email_address == 'string'
                    ? this.email_address
                    : this.email_address.join(','),
            company_tradingAs: this.company_tradingAs,
            contact_number: this.contact_number,
            linkedin_profile: this.linkedin_profile,
            ctps: this.ctpsChecked,
        };

        this.showOrHideContactInfoModal = false;

        if (this.userAuthService.hasRolePermission(['Super Admin'])) {
            obj['isAdmin'] = true;

            this.globalServerCommunication
                .globalServerRequestCall(
                    'post',
                    'DG_LIST',
                    'updateCompanyContactInfoData',
                    obj
                )
                .subscribe((response) => {
                    if (response.body.status === 200) {
                        this.msgs = [];
                        this.msgs.push({
                            severity: 'success',
                            summary:
                                'Confirmed Your data sent to the Admin for verification',
                        });

                        let inputObj = [obj.companyNumber];

                        this.globalServerCommunication
                            .globalServerRequestCall(
                                'get',
                                'DG_LIST',
                                'indexCompany',
                                inputObj
                            )
                            .subscribe(
                                (res) => {
                                    if (res.body.status == 200) {
                                        setTimeout(() => {
                                            this.msgs = [];
                                            // this.msgs.push({ severity: 'success', summary: "Already a suggestion for this industry is there" })
                                        }, 2000);
                                        setTimeout(() => {
                                            const currentUrl = this.router.url;
                                            const activateRouteQueryParam =
                                                this.activateRouter.snapshot.url
                                                    .length == 0;

                                            if (
                                                this.router.url.split('?')[0] &&
                                                activateRouteQueryParam
                                            ) {
                                                window.open(
                                                    '/company/' +
                                                        this.companyNumber +
                                                        '/' +
                                                        this.formatCompanyNameForUrl(
                                                            this.titlecasePipe.transform(
                                                                this.companyName
                                                            )
                                                        ),
                                                    '_blank'
                                                );
                                            } else {
                                                /*
										Do not enable the below code before discussing with Akmal.
										It reloads the `AppMainComponent`, which is the main
										layout container and parent for all of the Components/Modules.
										===============================================================
										this.router.routeReuseStrategy.shouldReuseRoute = () => false;
										===============================================================
									*/
                                                this.router.onSameUrlNavigation =
                                                    'reload';
                                                this.router.navigate([
                                                    currentUrl,
                                                ]);
                                            }
                                        }, 4000);
                                    } else {
                                        this.msgs = [];
                                        this.msgs.push({
                                            severity: 'success',
                                            summary:
                                                'Could Not Start Company Indexing',
                                        });
                                    }
                                },
                                (err) => {
                                    this.msgs = [];
                                    this.msgs.push({
                                        severity: 'success',
                                        summary:
                                            'Could Not Start Company Indexing',
                                    });
                                }
                            );
                        setTimeout(() => {
                            this.msgs = [];
                        }, 6000);
                    } else {
                        this.msgs = [];
                        this.msgs.push({
                            severity: 'error',
                            summary:
                                'Company contact information not updated!!',
                        });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 4000);
                    }
                });
        } else {
            obj['isAdmin'] = false;
            this.globalServerCommunication
                .globalServerRequestCall(
                    'post',
                    'DG_HELPDESK',
                    'suggestRequest',
                    obj
                )
                .subscribe((res) => {
                    this.msgs = [];
                    if (res) {
                        if (res.body.status === 201) {
                            this.msgs.push({
                                severity: 'info',
                                summary:
                                    'Already a suggestion for this company is there.',
                                detail: '',
                            });
                        } else {
                            this.msgs.push({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Your data sent to the Admin for verification.',
                            });
                        }
                        setTimeout(() => {
                            this.msgs = [];
                            this.domain = undefined;
                            this.email_address = undefined;
                            this.company_tradingAs = undefined;
                            this.contact_number = undefined;
                            this.linkedin_profile = undefined;
                            this.ctpsChecked = undefined;
                        }, 4000);
                    }
                });
        }
    }

    formatWebsite(websiteParam: any) {
        if (!CustomUtils.isNullOrUndefined(websiteParam)) {
            let website = websiteParam;
            website = website.replace('https://', '');
            website = website.replace('http://', '');
            website = website.replace('www.', '');
            return website.toLowerCase();
        } else return '';
    }

    formatDirectorNameForUrl(directorName: any) {
        return this.commonService.formatDirectorNameForUrl(directorName);
    }

    formatDate(date: any) {
        return this.commonService.formatDate(date);
    }

    calculateAge(dob: any) {
        return this.commonService.calculateAge(dob);
    }

    parseDate(date: any) {
        return this.commonService.parseDate(date);
    }

    pscAddress(data: any) {
        return this.commonService.pscAddress(data);
    }

    directorsAge(date_of_birth: any) {
        return this.commonService.directorsAge(date_of_birth);
    }

    getSafeAlertsData(data: any[]) {
        this.safeAlerts = data;

        this.safeAlertsColumn = [
            {
                field: 'alertCode',
                header: 'Alert Code',
                width: '100px',
                textAlign: 'right',
                verticalAlign: 'top',
            },
            {
                field: 'alertCodeTitle',
                header: 'Alert Code Title',
                width: '140px',
                textAlign: 'left',
                verticalAlign: 'top',
            },
            {
                field: 'alertDate',
                header: 'Alert Date',
                width: '110px',
                textAlign: 'right',
                verticalAlign: 'center',
            },
            {
                field: 'safealertdescription',
                header: 'Description',
                width: '280px',
                textAlign: 'left',
            },
        ];
    }

    getCompanyCommentaryData(data: any[]) {
        this.companyCommentryData = data;
        this.commentry = this.companyCommentryData;
        this.companyCommentaryColumn = [
            {
                field: 'commentaryText',
                header: 'Commentary',
                width: '160px',
                textAlign: 'left',
            },
            {
                field: 'commentaryImpact',
                header: 'Impact',
                width: '40px',
                textAlign: 'center',
            },
        ];

        for (let i = 0; i < this.companyCommentryData.length; i++) {
            if (
                this.companyCommentryData[i]['commentaryText'] !== null ||
                this.companyCommentryData[i]['commentaryText'] !== ''
            ) {
                this.companyCommentryData[i]['commentaryText'] =
                    this.companyCommentryData[i]['commentaryText'].replace(
                        /[!@#$%^&*()�,.?";:{}|<>]/g,
                        ''
                    );
            }
        }
    }

    formatDirectorAddress(data) {
        return this.commonService.formatDirectorAddress(data);
    }

    disqualifiedDirectorDetails() {
        let obj = { pnr: this.disqualifiedDeletedExceptionDirectors };

        this.globalServerCommunication
            .globalServerRequestCall(
                'post',
                'DG_DIRECTOR_DETAILS',
                'disqualifiedDirectors',
                obj
            )
            .subscribe((res) => {
                // this.companyService.getDisqualifiedDirectorDetails(obj).then(data => {
                let data = res.body;
                if (data.status == 200) {
                    if (data.results.length > 0) {
                        this.disqualifiedDirectorsCount = data.results.length;

                        for (let dirDetail of this.directorDetails) {
                            for (let disqualifiedDirDetail of data.results) {
                                if (
                                    dirDetail.directorPnr ==
                                    disqualifiedDirDetail.PNR
                                ) {
                                    dirDetail['disqualifiedDirectors'] =
                                        disqualifiedDirDetail;
                                }
                            }
                        }
                    }
                }
            });
    }

    checkSubscriptionAuth(conditionCheck: any, route: any[]) {
        if (this.isLoggedIn) {
            if (!conditionCheck) {
                event.preventDefault();
                event.stopPropagation();
                if (this.userAuthService.hasRolePermission(['Client User'])) {
                    this.showUpgradePlanDialogForClientuser = true;
                } else {
                    this.showUpgradePlanDialog = true;
                }
            } else {
                let routeUrl: any;
                if (typeof route == 'string') {
                    routeUrl = route;
                    if (routeUrl.includes('https://www.')) {
                        routeUrl = routeUrl.replace('https://www.', '');
                        routeUrl = 'https://www.' + routeUrl;
                    } else if (routeUrl.includes('https://www.in.')) {
                        routeUrl = routeUrl.replace('https://www.in.', '');
                        routeUrl = 'https://in.' + routeUrl;
                    } else if (routeUrl.includes('https://www.https://')) {
                        routeUrl = routeUrl.replace('https://www.https://', '');
                        routeUrl = 'https://' + routeUrl;
                    } else if (routeUrl.includes('https://uk.')) {
                        routeUrl = routeUrl.replace('https://uk.', '');
                        routeUrl = 'https://uk.' + routeUrl;
                    } else if (routeUrl.includes('https://')) {
                        routeUrl = routeUrl;
                    } else if (routeUrl.includes('http://')) {
                        routeUrl = routeUrl.replace('https://', '');
                    } else {
                        routeUrl = 'https://' + routeUrl;
                    }
                } else {
                    routeUrl = this.router.serializeUrl(
                        this.router.createUrlTree(route)
                    );
                }
                window.open(routeUrl, '_blank');
            }
        } else {
            event.preventDefault();
            event.stopPropagation();
            this.showLoginDialog = true;
        }
    }

    handleOverlayClick(event: { overlay: { getTitle: () => any }; map: any }) {
        let isMarker = event.overlay.getTitle != undefined;

        if (isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('' + title + '');
            this.infoWindow.open(event.map, event.overlay);
        }
    }

    calculatePercentageForOverviewFinancials(
        previousYearValue: number,
        currentYearValue: number
    ) {
        let calculatedPercentageValue = '';

        if (previousYearValue < currentYearValue) {
            if (
                previousYearValue === 0 &&
                (currentYearValue > 0 || currentYearValue < 0)
            ) {
                calculatedPercentageValue = '';
            } else if (currentYearValue === 0 && previousYearValue > 0) {
                calculatedPercentageValue = '-100';
            } else if (currentYearValue === 0 && previousYearValue < 0) {
                calculatedPercentageValue = '100';
            } else {
                let percentageChange: any = (
                    ((currentYearValue - previousYearValue) /
                        previousYearValue) *
                    100
                ).toFixed(1);
                if (
                    (previousYearValue < 0 && currentYearValue > 0) ||
                    (previousYearValue < 0 && currentYearValue < 0)
                ) {
                    percentageChange = percentageChange * -1;
                }
                calculatedPercentageValue = percentageChange.toString();
            }
        } else if (previousYearValue > currentYearValue) {
            if (
                previousYearValue === 0 &&
                (currentYearValue > 0 || currentYearValue < 0)
            ) {
                calculatedPercentageValue = '';
            } else if (currentYearValue === 0 && previousYearValue > 0) {
                calculatedPercentageValue = '-100';
            } else if (currentYearValue === 0 && previousYearValue < 0) {
                calculatedPercentageValue = '100';
            } else {
                let percentageChange: any = (
                    ((currentYearValue - previousYearValue) /
                        previousYearValue) *
                    100
                ).toFixed(1);
                if (
                    (previousYearValue < 0 && currentYearValue > 0) ||
                    (previousYearValue < 0 && currentYearValue < 0)
                ) {
                    percentageChange = percentageChange * -1;
                }

                calculatedPercentageValue = percentageChange.toString();
            }
        }

        return calculatedPercentageValue;
    }

    getExactCCJData(data) {
        this.exactCCJData = data;

        if (this.exactCCJData) {
            this.exactCCJData = this.exactCCJData.map((obj) => {
                obj.ccjDate = this.commonService.changeToDate(obj.ccjDate);
                return obj;
            });
            //date sorting
            this.exactCCJData = this.exactCCJData.sort((a, b): any => {
                let prevDate: any = a.ccjDate,
                    newDate: any = b.ccjDate;
                if (prevDate < newDate) return 1;
                if (prevDate > newDate) return -1;
            });

            if (this.exactCCJData && this.exactCCJData.length > 1) {
                this.totalCCJValue = this.exactCCJData.reduce(
                    (value1, value2) =>
                        (value1.ccjAmount ? value1.ccjAmount : value1) +
                        value2.ccjAmount
                );
            } else if (this.exactCCJData && this.exactCCJData.length == 1) {
                this.totalCCJValue = this.exactCCJData[0].ccjAmount;
            }
        }

        this.exactCCJDataColumn = [
            {
                field: 'ccjDate',
                header: 'Date',
                width: '120px',
                textAlign: 'center',
            },
            {
                field: 'court',
                header: 'Court',
                width: '250px',
                textAlign: 'left',
            },
            {
                field: 'ccjAmount',
                header: 'Amount',
                width: '110px',
                textAlign: 'right',
            },
            {
                field: 'ccjStatus',
                header: 'Status',
                width: '110px',
                textAlign: 'center',
            },
            {
                field: 'caseNumber',
                header: 'Case Number',
                width: '120px',
                textAlign: 'center',
            },
            {
                field: 'ccjPaidDate',
                header: 'Date Paid',
                width: '120px',
                textAlign: 'center',
            },
            {
                field: 'plantiffForeName',
                header: 'Plantiff ForeName',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffSurName',
                header: 'Plantiff SurName',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffName',
                header: 'Plantiff Name',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffTelephone',
                header: 'Plantiff Telephone',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffAddressLine1',
                header: 'Plantiff AddressLine1',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffAddressLine2',
                header: 'Plantiff AddressLine2',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffAddressLine3',
                header: 'Plantiff AddressLine3',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffAddressLine4',
                header: 'Plantiff AddressLine4',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffAddressLine5',
                header: 'Plantiff AddressLine5',
                width: '150px',
                textAlign: 'left',
            },
            {
                field: 'plantiffPostCode',
                header: 'Plantiff PostCode',
                width: '150px',
                textAlign: 'left',
            },
        ];
    }

    getPossibleCCJData() {
        if (this.companyData['possibleCCJDetails']) {
            this.possibleCCJData = this.companyData['possibleCCJDetails'];

            this.possibleCCJData = this.possibleCCJData.map((obj) => {
                obj.ccjDate = this.commonService.changeToDate(obj.ccjDate);
                return obj;
            });
            //date sorting
            this.possibleCCJData = this.possibleCCJData.sort((a, b): any => {
                let prevDate: any = a.ccjDate,
                    newDate: any = b.ccjDate;
                if (prevDate < newDate) return 1;
                if (prevDate > newDate) return -1;
            });
            this.possibleCCJDataColumn = [
                {
                    field: 'ccjDate',
                    header: 'Date',
                    width: '120px',
                    textAlign: 'center',
                },
                {
                    field: 'court',
                    header: 'Court',
                    width: '280px',
                    textAlign: 'left',
                },
                {
                    field: 'ccjAmount',
                    header: 'Amount',
                    width: '110px',
                    textAlign: 'right',
                },
                {
                    field: 'ccjStatus',
                    header: 'Status',
                    width: '110px',
                    textAlign: 'center',
                },
                {
                    field: 'caseNumber',
                    header: 'Case Number',
                    width: '110px',
                    textAlign: 'center',
                },
                {
                    field: 'ccjPaidDate',
                    header: 'Date Paid',
                    width: '120px',
                    textAlign: 'center',
                },
                {
                    field: 'incomingRecordDetails',
                    header: 'Registered CCJ Details',
                    width: '280px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffForeName',
                    header: 'Plantiff ForeName',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffSurName',
                    header: 'Plantiff SurName',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffName',
                    header: 'Plantiff Name',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffTelephone',
                    header: 'Plantiff Telephone',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffAddressLine1',
                    header: 'Plantiff AddressLine1',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffAddressLine2',
                    header: 'Plantiff AddressLine2',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffAddressLine3',
                    header: 'Plantiff AddressLine3',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffAddressLine4',
                    header: 'Plantiff AddressLine4',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffAddressLine5',
                    header: 'Plantiff AddressLine5',
                    width: '150px',
                    textAlign: 'left',
                },
                {
                    field: 'plantiffPostCode',
                    header: 'Plantiff PostCode',
                    width: '150px',
                    textAlign: 'left',
                },
            ];
        }
    }

    formatCompanyNameForUrl(companyName) {
        return this.commonService.formatCompanyNameForUrl(companyName);
    }

    getSICCodeInArrayFormat(SICCode) {
        return this.commonService.getSICCodeInArrayFormat(SICCode);
    }

    onIndustryUpdateInfo() {
        this.industryTagList = [];
        let searchFilters = [];

        searchFilters.push({ chip_group: 'Status', chip_values: ['live'] });

        this.sharedLoaderService.showLoader();
        this.searchFilterService
            .getAllFilterProps(
                searchFilters,
                'industryTagList.keyword',
                ['Industry'],
                undefined,
                'companyDetailsPage'
            )
            .then((data) => {
                if (
                    data.distinct_categories &&
                    data.distinct_categories.buckets &&
                    data.distinct_categories.buckets.length > 0
                ) {
                    for (let val of data.distinct_categories.buckets) {
                        if (val.key !== 'lending') {
                            this.industryTagList.push({
                                label: val.key.replace(
                                    /(^|\s)\S/g,
                                    function (t) {
                                        return t.toUpperCase();
                                    }
                                ),
                                value: val.key,
                                checked: false,
                            });
                        }
                    }
                }
                if (this.companyData['industryTagList']) {
                    this.selectedIndustryTag =
                        this.companyData['industryTagList'];
                }
                this.showOrHideIndustryModal = true;
                this.sharedLoaderService.hideLoader();
            });
    }

    updateCompanyIndustryTag() {
        let selectedIndustryTagString = this.selectedIndustryTag.toString();

        let obj = {
            userId: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            companyName: this.companyData['businessName'],
            selectedIndustryTagString: selectedIndustryTagString,
            listId: this.activateRouter.snapshot.queryParams['cListId']
                ? this.activateRouter.snapshot.queryParams['cListId']
                : '',
        };

        this.showOrHideIndustryModal = false;

        if (this.userAuthService.hasRolePermission(['Super Admin'])) {
            obj['isAdmin'] = true;

            this.globalServerCommunication
                .globalServerRequestCall(
                    'post',
                    'DG_HELPDESK',
                    'updateIndustryTagMaster',
                    obj
                )
                .subscribe((res) => {
                    if (res.body.status === 200) {
                        this.msgs = [];
                        this.msgs.push({
                            severity: 'success',
                            summary:
                                'Confirmed Your data sent to the Admin for verification',
                        });

                        let inputObj = [obj.companyNumber];

                        this.globalServerCommunication
                            .globalServerRequestCall(
                                'get',
                                'DG_LIST',
                                'indexCompany',
                                inputObj
                            )
                            .subscribe(
                                (res) => {
                                    if (res.body.status == '200 ') {
                                        setTimeout(() => {
                                            this.msgs = [];
                                            this.msgs.push({
                                                severity: 'success',
                                                summary:
                                                    'Already a suggestion for this industry is there',
                                            });
                                        }, 3000);
                                    } else {
                                        this.msgs = [];
                                        this.msgs.push({
                                            severity: 'success',
                                            summary:
                                                'Could Not Start Company Indexing',
                                        });
                                    }
                                },
                                (err) => {
                                    this.msgs = [];
                                    this.msgs.push({
                                        severity: 'success',
                                        summary:
                                            'Could Not Start Company Indexing',
                                    });
                                }
                            );

                        setTimeout(() => {
                            this.msgs = [];
                        }, 5000);
                    } else {
                        this.msgs = [];
                        this.msgs.push({
                            severity: 'error',
                            summary: 'Industry Tag Data Not Updated!!',
                        });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 3000);
                    }
                });
        } else {
            obj['isAdmin'] = false;

            this.globalServerCommunication
                .globalServerRequestCall(
                    'post',
                    'DG_HELPDESK',
                    'insertUpdateUserSuggestionIndustrytag',
                    obj
                )
                .subscribe((res) => {
                    if (res) {
                        if (res.body.status === 201) {
                            this.msgs = [];
                            this.msgs.push({
                                severity: 'info',
                                summary:
                                    'Already a suggestion for this industry tag is there.',
                                detail: '',
                            });
                        } else {
                            this.msgs = [];
                            this.msgs.push({
                                severity: 'success',
                                summary: 'Confirmed',
                                detail: 'Your data sent to the Admin for verification.',
                            });
                        }

                        setTimeout(() => {
                            this.msgs = [];
                            selectedIndustryTagString = undefined;
                        }, 2000);
                    }
                });
        }
    }

    firstName(director_name) {
        let firstName = '';
        if (director_name !== undefined) {
            let indexOfComma = director_name.indexOf(',');
            if (indexOfComma !== -1) {
                let firstName1 = director_name
                    .substring(indexOfComma + 1)
                    .trim();
                if (firstName1.indexOf(' ') > -1)
                    firstName = firstName1.substr(0, firstName1.indexOf(' '));
                else firstName = firstName1;
            } else if (director_name.indexOf(' ') !== -1) {
                firstName = director_name.substring(
                    0,
                    director_name.indexOf(' ')
                );
            }
        }
        return firstName;
    }

    lastName(director_name) {
        let lastName = '';
        if (director_name !== undefined) {
            let indexOfComma = director_name.indexOf(',');
            if (indexOfComma !== -1) {
                lastName = director_name.substring(0, indexOfComma).trim();
            } else if (director_name.indexOf(' ') !== -1) {
                lastName = director_name.substring(
                    director_name.lastIndexOf(' ') + 1
                );
            }
        }
        return lastName;
    }

    linkedInUrlForDirector(director_name, userUID) {
        let obj = [userUID];

        if (this.isLoggedIn) {
            if (
                this.userAuthService.hasAddOnPermission('contactInformation') ||
                this.userAuthService.hasRolePermission(['Super Admin'])
            ) {
                var FinalName = ' ';
                this.globalServerCommunication
                    .globalServerRequestCall(
                        'get',
                        'DG_API',
                        'relatedCompanyToDirector',
                        obj
                    )
                    .subscribe((res) => {
                        if (res.body.status === 200) {
                            let companiesarray = res.body['results'];
                            let length =
                                companiesarray.length > 5
                                    ? 5
                                    : companiesarray.length;

                            for (let j = 0; j < length; j++) {
                                if (companiesarray[j].label !== undefined) {
                                    var NewName = companiesarray[j].label
                                        .trim()
                                        .split(' ');
                                    // FinalName += NewName[0]
                                    for (let i = 0; i < NewName.length; i++) {
                                        if (
                                            NewName[i] !== 'LIMITED' &&
                                            NewName[i] !== 'LTD'
                                        ) {
                                            FinalName += NewName[i] + '%20';
                                        }
                                    }
                                }
                                if (j !== length - 1) {
                                    FinalName += '%20OR%20';
                                }

                                if (j == length - 1) {
                                    let url =
                                        'https://www.linkedin.com/search/results/people/?firstName=' +
                                        this.firstName(director_name) +
                                        '&lastName=' +
                                        this.lastName(director_name);
                                    window.open(url, '_blank').focus();
                                }
                            }
                        }
                    });
            } else {
                event.preventDefault();
                event.stopPropagation();
                if (this.userAuthService.hasRolePermission(['Client User'])) {
                    this.showUpgradePlanDialogForClientuser = true;
                } else {
                    this.showUpgradePlanDialog = true;
                }
            }
        } else {
            event.preventDefault();
            event.stopPropagation();
            this.showLoginDialog = true;
        }
    }

    addCompanyToFatchEmail(selectedData) {
        this.sharedLoaderService.showLoader();

        const filteredData = selectedData.map(({ full_name, profile_id }) => ({
            full_name,
            profile_id,
        }));
        const payload = {
            persons: filteredData,
            companyNumber: selectedData[0].company_number,
            domain: selectedData[0].website,
        };

        this.globalServerCommunication
            .globalServerRequestCall(
                'post',
                'DG_LIST',
                'fetchAndVerifyLinkedinPersonEmail',
                payload
            )
            .subscribe((res) => {
                if (res.body.status == 200) {
                    this.selectedCompany = [];
                    this.importantOtherEmailsModal = false;
                    this.importantFetchEmailsModal = true;
                    this.emailData = res.body.data;
                    this.sharedLoaderService.hideLoader();
                } else {
                    this.sharedLoaderService.hideLoader();
                    this.selectedCompany = [];
                    this.message = [];
                    this.message.push({
                        severity: 'error',
                        summary: res.body.message,
                    });
                    setTimeout(() => {
                        this.message = [];
                    }, 4000);
                }
            });
    }

    cruptStringDecode(cruptString) {
        return cruptString.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    }

    dialogBoxForImpotantEmails() {
        this.sharedLoaderService.showLoader();

        this.emailAddress = [this.userDetails?.email];

        this.importantEmailsModal = true;

        this.globalServerCommunication
            .globalServerRequestCall('get', 'DG_LIST', 'fetchDirectorEmail', [
                this.companyNumber,
            ])
            .subscribe((res) => {
                if (res.body.status == 200) {
                    this.emailData = res.body.data;
                    // this.userDetailData = res.body['userDetails'][0];
                    // this.emailSpotterLimit = this.userDetailData["emailSpotterLimit"];
                    // this.subscription_id = this.userDetailData["subs_id"];
                    // this.subscription_endDate = this.userDetailData["subs_endDate"];
                }
                this.sharedLoaderService.hideLoader();
            });
    }
    dialogBoxForImpotantOtherEmails() {
        this.sharedLoaderService.showLoader();

        this.emailAddress = [this.userDetails?.email];

        this.importantOtherEmailsModal = true;

        this.globalServerCommunication
            .globalServerRequestCall(
                'get',
                'DG_LIST',
                'fetchLinkedinPersonData',
                [this.companyNumber]
            )
            .subscribe((res) => {
                if (res.body.status == 200) {
                    this.otherEmailData = res.body.data;
                }
                this.sharedLoaderService.hideLoader();
            });
    }

    showImportantEmails() {
        this.conirmEmailModalDialog = false;

        this.sharedLoaderService.showLoader();
        this.importantEmailsModal = false;

        let company_domain;

        let obj = {
            userId: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            companyName: this.companyData['businessName'],
            companyDomain: company_domain,
            type: 'all',
            limit: 10,
            lastId: 0,
            count: 0,
            requestLimit: 10,
            oldLimit: 1,
        };

        if (
            this.companyData['companyContactInformation'][0] &&
            this.companyData['companyContactInformation'][0].website &&
            this.commonService.is_domain(
                this.formatWebsite(
                    this.companyData['companyContactInformation'][0].website
                )
            )
        ) {
            obj.companyDomain =
                this.companyData['companyContactInformation'][0].website;

            this.processForImportantEmailsList(obj);
        } else if (
            this.companyData['RegAddress_Modified'] &&
            this.companyData['RegAddress_Modified'].website &&
            this.commonService.is_domain(
                this.formatWebsite(
                    this.companyData['RegAddress_Modified'].website
                )
            )
        ) {
            obj.companyDomain = this.companyData['RegAddress_Modified'].website;

            this.processForImportantEmailsList(obj);
        } else {
            this.sharedLoaderService.hideLoader();

            this.messageService.add({
                key: 'tc',
                severity: 'info',
                summary: 'Info',
                detail: 'Invalid domain to start process!!',
            });
        }
    }

    // Method for get list of imporatnt emails
    processForImportantEmailsList(obj) {
        this.importantEmailsColumns = [
            {
                field: 'fullName',
                header: 'Person Name',
                width: '100px',
                textAlign: 'left',
                visible: true,
            },
            {
                field: 'email',
                header: 'Email',
                width: '150px',
                textAlign: 'left',
                visible:
                    this.userAuthService.hasRolePermission(['Super Admin']) ||
                    this.userAuthService.hasAddOnPermission(
                        'contactInformation'
                    ),
            },
            {
                field: 'position',
                header: 'Position',
                width: '150px',
                textAlign: 'left',
                visible: true,
            },
            {
                field: 'status',
                header: 'Status',
                width: '50px',
                textAlign: 'left',
                visible: true,
            },
            // { field: 'type', header: 'Type', width: '50px', textAlign: 'left' }
        ];

        this.globalServerCommunication
            .globalServerRequestCall(
                'post',
                'DG_LIST',
                'getEmailsFromSingleCompanyDomain',
                obj
            )
            .subscribe(
                (res) => {
                    if (res.body.code == 200) {
                        this.importantEmailsList = res.body.response;
                        if (this.importantEmailsList['companyEmails']) {
                            this.importantEmailsList['companyEmails'] =
                                this.importantEmailsList['companyEmails'].sort(
                                    (a, b) =>
                                        a.position && a.position !== '' ? -1 : 1
                                );
                            this.importantEmailsDataValue = JSON.parse(
                                JSON.stringify(
                                    this.importantEmailsList['companyEmails']
                                )
                            );
                        }
                        this.totalCountForEmails =
                            this.importantEmailsList['totalEmailsOnSnov'];
                        this.totalEmailFetchedCount =
                            this.importantEmailsList['resultFound'];
                        this.creditLimitForEmailSpotter =
                            this.emailSpotterLimit - 1;
                        this.sharedLoaderService.hideLoader();

                        if (this.totalEmailFetchedCount == 0) {
                            this.messageService.add({
                                key: 'tc',
                                severity: 'info',
                                summary: 'Info',
                                detail: 'No Emails has been Fetched!!',
                            });
                        } else {
                            this.emailsListModal = true;
                        }
                    } else {
                        this.sharedLoaderService.hideLoader();
                        this.messageService.add({
                            key: 'tc',
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Something went wrong!!',
                        });
                    }
                },
                (err) => {
                    this.sharedLoaderService.hideLoader();
                    this.messageService.add({
                        key: 'tc',
                        severity: 'warn',
                        summary: 'Warn',
                        detail: 'Not Found!!',
                    });
                }
            );
    }

    unSubscribeImportantEmailsModalModal() {
        this.importantEmailsColumns = [];
        this.importantEmailsDataValue = [];
    }

    confirmEmailDialog() {
        this.closeModal = true;
    }

    closeDialog() {
        this.closeModal = false;
        this.emailsListModal = false;
    }

    onChangeCtpsCheck(event) {
        this.isCtpsChecked = event.checked;
    }

    getRiskBandsHistory() {
        this.companyData['riskBandHistoryData'] =
            this.companyData['riskBandHistoryData'].slice(-4);
        let colorDefinedForRiskBand = {
            'Very Low Risk': '#6DC470',
            'Low Risk': '#59BA9B',
            'Moderate Risk': '#FFC201',
            'High Risk': '#E4790F',
            'Not Scored': '#D92727',
        };

        for (let keyOfriskBand of this.companyData['riskBandHistoryData']) {
            for (let color in colorDefinedForRiskBand) {
                if (keyOfriskBand.riskBand == color) {
                    this.modifiedRiskBandArr.push({
                        riskBand: keyOfriskBand.riskBand,
                        date: keyOfriskBand.date,
                        color: colorDefinedForRiskBand[color],
                        icon: PrimeIcons.PLUS_CIRCLE,
                    });
                }
            }
        }

        if (this.modifiedRiskBandArr.length > 4) {
            this.modifiedRiskBandArr = this.modifiedRiskBandArr.slice(-4);
        }
    }
    returnZero() {
        return 0;
    }

    showMessage(event) {
        this.msgs = [];
        this.msgs.push(event);

        setTimeout(() => {
            this.msgs = [];
        }, 3000);
    }

    getDiversityIdentification() {
        this.loaderForDiversityBlock = true;
        let payloadForGetDiversity = {
            companyNumber: this.companyData['companyRegistrationNumber'],
            userId: this.userDetails?.dbID,
        };

        this.globalServerCommunication
            .globalServerRequestCall(
                'post',
                'DG_API',
                'getDiversityChecks',
                payloadForGetDiversity
            )
            .subscribe({
                next: (res) => {
                    if (res.body.status == 200) {
                        this.companyData['diversityInclusionData'] = res.body;
                        this.diversityDataFromGetCompanyOverViewAPI();
                        this.loaderForDiversityBlock = false;
                        this.globalServerCommunication
                            .globalServerRequestCall(
                                'get',
                                'DG_LIST',
                                'indexCompany',
                                [this.companyData['companyRegistrationNumber']]
                            )
                            .subscribe((resAfterIndexing) => {});
                    }
                },
                error: (err) => {
                    this.loaderForDiversityBlock = false;
                    this.enableService = true;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error.message,
                    });
                    setTimeout(() => {
                        this.messageService.clear();
                    }, 3000);
                },
            });
    }

    diversityDataFromGetCompanyOverViewAPI() {
        this.userCreditDeductedForDiBool =
            this.companyData['hasDiversityInclusionData'];

        this.diversityNewData = this.companyData['diversityInclusionData'];

        if (this.diversityNewData) {
            const {
                ageDiversityData,
                bcropTag,
                femaleOwned,
                msmeCategory,
                ethnicOwned,
                militaryVeterans,
                vcseCategory,
                netZeroTarget,
                ppcTag,
            } = this.diversityNewData;

            this.diversityInclusionObject = {};

            this.diversityInclusionObject = {
                ageDiversityData,
                bcropTag,
                femaleOwned,
                msmeCategory,
                ethnicOwned,
                militaryVeterans,
                vcseCategory,
                netZeroTarget,
                ppcTag,
            };

            this.lengthOfAgeDiversityObject =
                Object.keys(ageDiversityData).length;
        }
    }

    calculateBarWidth(diversityInclusionObject, ageDiversityCount) {
        let result;

        if (ageDiversityCount != undefined) {
            result =
                (ageDiversityCount /
                    (diversityInclusionObject?.ageDiversityData['below30'] +
                        diversityInclusionObject?.ageDiversityData['31-50'] +
                        diversityInclusionObject?.ageDiversityData['51-65'] +
                        diversityInclusionObject.ageDiversityData['above65'])) *
                    100 +
                '%';

            return result;
        }
    }

    DiversityLimit() {
        this.globalServerCommunication
            .globalServerRequestCall('get', 'DG_USER_API', 'getUserDetails')
            .subscribe({
                next: (res) => {
                    if (res.status === 200) {
                        if (res.body.diversityLimit > 0) {
                            this.getDiversityIdentification();
                            this.diversityButonBoolean = true;
                        } else {
                            this.diversityAndInclusionMsgs = [];
                            this.diversityAndInclusionMsgs.push({
                                severity: 'error',
                                summary: 'Limit Not Available',
                            });
                            setTimeout(() => {
                                this.diversityAndInclusionMsgs = [];
                            }, 4000);
                            // this.noLimit = true;
                        }
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }
}
