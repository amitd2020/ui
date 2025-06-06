export const apiEndpoint = {

	/* DG_API Endpoints */
	landCorporateData: "getLandCorporateData",
	getLandCorporateSaleData: "getLandCorporateSaleData",
	getLandCorporatePurchaseData: "getLandCorporatePurchaseData",
	getLandCorporateDataByTitleNumber: "getLandCorporateDataByTitleNumber",
	similarCompanies: "getSimilarCompanies",
	companyNews: "getCompanyNews",
	companyNewsOnly: "getCompanyNewsOnly",
	companyDirectorsData: "getCompanyDirectorsData",
	companyChargesData: "getCompanyChargesData",
	zScoreIndustryPieChart: "zScoreIndustryPieChart",
	companyByCmpNo: "getCompanyByCmpNo",
	companyOverview: "getCompanyOverview",
	getResponsibleProcurementData: "get_responsible_procurementData",
	infoByCompanyNumberPublic: "getInfoByCompanyNumberPublic",
	listOfCompanyDocuments: "getListOfCompanyDocuments",
	listOfCompanyDocumentsPublic: "getListOfCompanyDocumentsPublic",
	relatedCompaniesAndDirectorsByCmpNo: "getRelatedCompaniesAndDirectorsByCmpNo",
	relatedCompaniesAndDirectorsByCmpNoTableData: "getRelatedCompaniesAndDirectorsByCmpNoTableData",
	companyDetailsByCmpName: "getCompanyDetailsByCmpName",
	relatedCompanyToDirector: "getRelatedCompanyToDirector",
	getDocument: "getDocument",
	directorDetails: "getDirectorDetails",
	directorDetailsPublic: "getDirectorDetailsPublic",
	shareholderDetails: "getShareholderDetails",
	companyContactDetails: "getCompanyContactDetails",
	companyPersonContactDetails: "getCompanyPersonContactDetails",
	directorCompaniesByPNR: "getDirectorCompaniesByPNR",
	countryName: "getCountryName",
	ablData: "getAblData",
	getCorporateRiskData: 'getCorporateRiskData',
	internationalTradeData: "getInternationalTradeData",
	getIndustries: "getIndustries",
	commodityCode: "getCommodityCode",
	searchApiAggregateByParam: "getAggregateByParam",
	aggregateByParamEmails: "getAggregateByParamEmails",
	searchApiAggregateByParamHNWI: "getAggregateByParamHNWI",
	aggregateByParamChargesPersonEntitled: "getAggregateByParamChargesPersonEntitled",
	searchResults: "getSearchResults",
	getStatsData: "getStatsData",
	getChargesDashboard: "getChargesDashboard",
	getFullySatisfiedCount: "getFullySatisfiedCount",
	getOutstandingWithPartialCount: "getOutstandingWithPartialCount",
	getStatsComparisonData: "getStatsComparisonData",
	statsPageFinancialCounts: "statsPageFinancialCounts",
	getStatsComparisonPageFinancialCounts: "getStatsComparisonPageFinancialCounts",
	searchResultsPublic: "getSearchResultsPublic",
	saveFilters: "saveFilters",
	saveFiltersForConnectPlus: "saveFiltersForConnectPlus",
	companyNameSuggestionsNew: "getCompanyNameSuggestionsNew",
	companyNameSuggestions: "getCompanyNameSuggestions",
	industryNameSuggestions: "getIndustryNameSuggestions",
	latLong: "getLatLong",
	financialKeys: "getFinancialKeys",
	financialGrowthKeys: "FinancialGrowthKeys",
	exportData: "getExportData",
	exportDataForCreditReport: "getExportDataForCreditReport",
	companiesByListId: "getCompaniesByListId",
	directorSearchResults: "getDirectorSearchResults",
	contactInformationResults: "getContactInformationSearchResults",
	investorSearchResults: "getInvestorSearchResults",
	investeeSearchResults: "getInvesteeSearchResults",
	hwiSearchResultsNew: "getHnwiSearchResultsNew",
	distinctIndustries: "getDistinctIndustries",
	exportEmailsList: "exportEmailsList",
	emailsByCompanyDomain: "emailsByCompanyDomain",
	getEmailsFromSingleCompanyDomain: "getEmailsFromSingleCompanyDomain",
	getDetailsByListId: "getDetailsByListId",
	getHnwiShareholdingsByPnr: "getHnwiShareholdingsByPnr",
	statsAggregation: "statsAggregation",
	getDiversityStatsData: "getDiversityStatsData",
	getEthnicStatsData: "getEthnicStatsData",
	// getCharityStatsData: "getCharityStatsData",
	getDiversityStatisticalData: "getDiversityStatisticalData",
	emailCountsByListID: "emailCountsByListID",
	sendEmailForExports: "sendEmailForExports",
	accountsData: "accountsData",
	aggQueryForAccountSearch: "aggQueryForAccountSearch",
	companiesData: "companiesData",
	chargesDescriptionSearch: "chargesDescriptionSearch",
	indexCompanyByListId: 'indexCompanyByListId',
	getUserDiversityList: 'getUserDiversityList',
	getDiversityAndInclusion: 'getDiversityAndInclusion',
	companyLinkedInData: 'companyLinkedInData',
	personLinkedInData: 'personLinkedInData',
	companyLinkedInDataAddToList: 'companyLinkedInDataAddToList',
	getAggDataForConnectAccounts:"getAggDataForConnectAccounts",
	directors: 'directors',
	director: 'director',
	directorShareholders: 'director/shareholdings',
	fetchVisitors: 'fetch-visitors-from-db',
	fetchCompanies: 'fetch-companies-from-db',
	searchCompanyIpAddress: 'search-company',
	workflowDashBoard: 'workflowDashBoard',
	compareRegsRelation: 'compare-regs-relation',
	listsForComparison: 'listsForComparison',
	getAggDataForPersonLinkedIn: 'getAggDataForPersonLinkedIn',
	workflowAddToMonitor: 'workflowAddToMonitor',
	getCompanyFutureGrowth: 'getCompanyFutureGrowth',
	calculateGrowthScoreRanking: 'calculateGrowthScoreRanking',
	getCompanyProspensityGrowth: 'getCompanyProspensityGrowth',
	getBenchmarkOverviewData: 'getBenchmarkOverviewData',
	getPropensitykOverviewData: 'getPropensitykOverviewData',

	diversityCalculationList: "diversity-spends-list",
	diversityCalculation: 'diversity-spends',
	diversityCalculationStats: 'diversity-spends-stats',
	diversitySpendsTable: 'diversity-spends-table',
	exportAllDiversityCalculation: 'exportAllDiversityCalculation',
	getPersonLinkedinByCmpNo: 'getPersonLinkedinByCmpNo',
	getStatsComparisonFilteredLists: 'getStatsComparisonFilteredLists',
	getStatsComparisonDataSaveLists: 'getStatsComparisonDataSaveLists',
	diversity_spends_new_stats: 'diversity-spends-new-stats',
	upload_diversity_mapping_file: 'upload-diversity-mapping-file',
	getUserListForAccountSearchScreen: 'getUserListForAccountSearchScreen',
	getNaceCodes: 'getNaceCodes',
	getStatsDataNew: 'getStatsDataNew',
	getEmailsForConnectPlus: 'getEmailsForConnectPlus',
	searchPositionsPersonLinkedIn: 'search-positions-person-linkedIn',
	enrichData: 'enrich-data',
	getDataEnrichmentLists: 'getDataEnrichmentLists',
	saveContractForProcurementMonitor: 'saveContractForProcurementMonitor',
	removeContractFromProcurementMonitor: 'removeContractFromProcurementMonitor',
	procurementMonitor:'procurementMonitor',
	clearProcurementNotification: 'clearProcurementNotification',
	saveTemplateDataEnrichment: 'save-template-data-enrichment',
	fetchTemplateDataEnrichment: 'fetch-template-data-enrichment',

	/* DG_API Endpoints */

	/* DG_LOGIN Endpoints */
	reducePepAndSanctionHitLimit: "reducePepAndSanctionHitLimit",
	getPreferences: "getPreferences",
	setPreferences: "setPreferences",
	updateAddOnFilters: "updateAddOnFilters",
	getUserDetails: "getUserDetails",
	editProfile: "editProfile",
	changeUserPassword: "changeUserPassword",
	getAPIAccessToken: "getAPIAccessToken",
	registration: "registration",
	verifyEmail: "verifyEmail",
	getsmallurl: "getsmallurl",
	sendForgotPasswordLink: "sendForgotPasswordLink",
	checkPageStatus: "checkPageStatus",
	changePassword: "resetPassword",
	emailVerificationLink: "emailVerificationLink",
	getAddOnFilters: "getAddOnFilters",
	updateCreditReportsLimit: "updateCreditReportsLimit",
	updatePepAndSanctionHitLimit: "updatePepAndSanctionHitLimit",
	updateFirstLogin: "updateFirstLogin",
	insertUserAccountPreferenceData: "insertUserAccountPreferenceData",
	userPlanUpgrade: "userPlanUpgrade",
	socialRegistration: "socialRegistration",
	login: "login",
	resendMFACode: "resendMFACode",
	twoFactorAuthentication: "twoFactorAuthentication",
	LoginWithSocialMedia: "LoginWithSocialMedia",
	userAuthorization: "userAuthorization",
	userAuthorizationNew: "userAuthorizationNew",
	updateToken: "updateToken",
	userEmailExistsCheck: "userEmailExistsCheck",
	downloadContractPdf: "downloadContractPdf",
	revoke: "revoke",
	signup: "signup",
	isMFAEnabled: "isMFAEnabled",
	generateQR: "generateQR",
	makePrimary: "makePrimary",
	userEnableMfa: "userEnableMfa",
	verifyTOTP: "verifyTOTP",
	deleteMfa: "deleteMfa",
	validateTOTP: "validateTOTP",
	/* DG_LOGIN Endpoints */

	/* DG_LAND_CORPORATE Endpoints */
	getLandCorporateSearchResults: "getLandCorporateSearchResults",
	getLandCorporateSearchResultsPublic: "getLandCorporateSearchResultsPublic",
	/* DG_LAND_CORPORATE Endpoints */

	/* DG_LIST Endpoints */
	saveWatchListDirectors: "saveWatchListDirectors",
	removeFromDirectorWatchList: "removeFromDirectorWatchList",
	uploadPdfToS3: "uploadPdfToS3",
	getCompaniesInList: "getCompaniesInList",
	getCompaniesInListTableData: "getCompaniesInListTableData",
	getDefaultSearchCompaniesData: "getDefaultSearchCompaniesData",
	saveRecentCompanies: "saveRecentCompanies",
	saveWatchListCompanies: "saveWatchListCompanies",
	saveWatchListCompaniesPlus: "saveWatchListCompaniesPlus",
	checkCompanyInWatchList: "checkCompanyInWatchList",
	checkCompanyInWatchListPlus: "checkCompanyInWatchListPlus",
	removeFromWatchList: "removeFromWatchList",
	getUserFavouritesLists: "getUserFavouritesLists",
	editListOrAddCompanies: "editListOrAddCompanies",
	getUserCommercialId: "getUserCommercialId",
	updateContactUserListName: "updateContactUserListName",
	updateContactUserList: "updateContactUserList",
	deleteCompaniesFromList: "deleteCompaniesFromList",
	getAblChargesUserList: "getAblChargesUserList",
	getUserLists: "getUserLists",
	aiSearchList: "aiSearchList",
	getUserListsByUserId: "getUserListsByUserId",
	contactUserList: "contactUserList",
	addListForAUser: "addListForAUser",
	saveContactUserList: "saveContactUserList",
	addAllToList: "addAllToList",
	allCompaniesAddToList: "allCompaniesAddToList",
	ablChargesUserList: "ablChargesUserList",
	editAblChargesUserList: "ablChargesUserList/update",
	addNotesCompany: "addNotesCompany",
	getNotes: "getNotes",
	updateNotesCompany: "updateNotesCompany",
	notesList: "notesList",
	deleteNotesCompany: "deleteNotesCompany",
	exportCsvToEmail: "exportCsvToEmail",
	shareSavedFilterUrlToEmail: "shareSavedFilterUrlToEmail",
	getUserExportLimit: "getUserExportLimit",
	reduceExportLimit: "reduceExportLimit",
	reducePdfLimit: "reducePdfLimit",
	validateCompaniesFromUplodedCSV: "validateCompaniesFromUplodedCSV",
	validateUploadedCSV: "validateUploadedCSV",
	validateUploadedCSV_V2: "validateUploadedCSV_V2",
	validateLinkedinUploadedCSV: "validateLinkedinUploadedCSV",
	getCreditScoreData: "getCreditScoreData",
	updateUserSaveCompaniesListById: "updateUserSaveCompaniesListById",
	updateUserContactCompaniesListById: "updateUserContactCompaniesListById",
	updateIndustryTag: "updateIndustryTag",
	getLandLists: "getLandLists",
	getSaveFilteredLists: "getSaveFilteredLists",
	deleteConnectPlusUserFilterCriteria: "deleteConnectPlusUserFilterCriteria",
	updateConnectPlusFilterName: "updateConnectPlusFilterName",
	getConnectPlusSaveFilteredLists: "getConnectPlusSaveFilteredLists",
	getGovtProcSaveFilteredLists: "getGovtProcSaveFilteredLists",
	getCompaniesCount: "getCompaniesCount",
	deleteUserFilterCriteria: "deleteUserFilterCriteria",
	deleteUserList: "deleteUserList",
	deleteContactUserList: "deleteContactUserList",
	updateFilterName: "updateFilterName",
	updateListName: "updateListName",
	getRecentsList: "getRecentsList",
	getWatchList: "getWatchList",
	getWatchListPlus: "getWatchListPlus",
	getCompleteWatchList: "getCompleteWatchList",
	getWatchListDirectors: "getWatchListDirectors",
	watchlistNotification: "watchlistNotification",
	directorWatchlistNotification: "directorWatchlistNotification",
	uploadExportedCsv: "uploadExportedCsv",
	getUserReduceExportLimit:"getUserReduceExportLimit",
	uploadChargesExportCsv: "uploadChargesExportCsv",
	getuserExportFilesList: "getuserExportFilesList",
	getUserPdfLists: "getUserPdfLists",
	getUserCrmExportFilesList: "getuserCrmExportFilesList",
	getUserCbfExportFilesList: "getuserCbfExportFilesList",
	downloadUserExportList: "downloadUserExportList",
	downloadUserCbfExportList: "downloadUserCbfExportList",
	downloadPdfFromS3: "downloadPdfFromS3",
	downloadUserCrmExportList: "downloadUserCrmExportList",
	exportEmailsCSVDownload: "exportEmailsCSVDownload",
	updateUser: "updateUser",
	deleteUser: "deleteUser",
	exportAll: "exportAll",
	exportAllExcel: "exportAllExcel",
	exportAllCRM: "exportAllCRM",
	exportAllCBF: "exportAllCBF",
	exportExcelToEmail: "exportExcelToEmail",
	exportListAdd: "exportListAdd",
	findRelation: "findRelation",
	getUserMeetMeRelations: "getUserMeetMeRelations",
	deleteUserMeetMeRelation: "deleteUserMeetMeRelation",
	deleteExportListByIdAndFileName: "deleteExportListByIdAndFileName",
	deletePdfReportListByIdAndFileName: "deletePdfReportListByIdAndFileName",
	deleteCrmExportListByIdAndFileName: "deleteCrmExportListByIdAndFileName",
	deleteCbfExportListByIdAndFileName: "deleteCbfExportListByIdAndFileName",
	getCCJChartDataNew: "getCCJChartDataNew",
	getCCJChartDataMonthly: "getCCJChartDataMonthly",
	getChargesChartDataNew: "getChargesChartDataNew",
	getChargesChartDataMonthly: "getChargesChartDataMonthly",
	getRegistrationChartDataNew: "getRegistrationChartDataNew",
	getRegistrationChartDataMonthly: "getRegistrationChartDataMonthly",
	getLiquidationChartData: "getLiquidationChartData",
	getDissolvedChartData: "getDissolvedChartData",
	getMapDataNew: "getMapDataNew",
	getFurloughMapData: "getFurloughMapData",
	exportAllCharges: "exportAllCharges",
	exportAllChargesDescription: "exportAllChargesDescription",
	exportAllTrade: "exportAllTrade",
	exportAllDirectors: "exportAllDirectors",
	// userFootPrint: "userFootPrint",
	getSearchResults: "getSearchResults",
	getAllUsersDetails: "getAllUsersDetails",
	userDetailsForSingleUser: "userDetailsForSingleUser",
	fetchDirectorEmail: "fetchDirectorEmail",
	fetchAndVerifyLinkedinPersonEmail: "fetchAndVerifyLinkedinPersonEmail",
	fetchAndVerifyDirectorsEmail: "fetchAndVerifyDirectorsEmail",
	fetchListEmail: "mail-finder",
	fetchLinkedinPersonData: "fetchLinkedinPersonData",
	updateCompanyContactInfoData: "updateCompanyContactInfoData",
	indexCompany: "indexCompany",
	allUsersList: "allUsersList",
	clientUsersList: "clientUsersList",
	teamUsersList: "teamUsersList",
	getMonitorPlusData: "getMonitorPlusData",
	monitorPlusNotification: "monitorPlusNotification",
	savedFiltersSearch: "savedFiltersSearch",
	getUserDefinedExportTemplateList: "getUserDefinedExportTemplateList",
	// getEmailByDomain: "emailsByCompanyDomain",
	upgradePlanEmailNotification: "upgradePlanEmailNotification",
	removeFromWatchListPlus: "removeFromWatchListPlus",
	getEthnicityDataByList: "getEthnicityDataByList",
	verifyEmailsByListID: "verifyEmailsByListID",
	addChargesCompaniesToList: "addChargesCompaniesToList",
	otherRelatedCompaniesAPI: "GetRelatedCompaniesAndDirectorsByCmpNoList",
	getSharedCriteriaInfo: "getSharedCriteriaInfo",
	getDiversityChecks: 'getDiversityChecks',
	potentialLeadsList: 'potentialLeadsList',
	procurementPartnersList: 'procurementPartnersList',
	businessCollaboratorsList: 'businessCollaboratorsList',
	fiscalHoldingsList: 'fiscalHoldingsList',
	exportAllLinkedInPerson: 'exportAllLinkedInPerson',
	editListOrAddLinkedinId: 'editListOrAddLinkedinId',
	linkedInUserList: 'linkedInUserList',
	editLinkedInUserList: 'linkedInUserList/update',
	personLinkedInLists: 'personLinkedInLists',
	exportIreland: 'export-ireland',
	netZeroTargetCompanies: 'netZeroTargetCompanies',
	exportAllLinkedInCompany: 'exportAllLinkedInCompany',
	getPpcCompaniesData: 'getPpcCompaniesData',
	governmentProcurementLists: 'governmentProcurementLists',
	editListOrAddGovernmentProcurement: 'editListOrAddGovernmentProcurement',
	govermentProcurementDataAddToList: 'govermentProcurementDataAddToList',
	updateGovermentProcurementList: 'updateGovermentProcurementList',
	deleteGovermentProcurement: 'deleteGovermentProcurement',
	deleteGovermentProcurmentIdsFromList: 'deleteGovermentProcurmentIdsFromList',
	connectPlusLists: 'connectPlusLists',
	deleteConnectListByListId: 'deleteConnectListByListId',
	updateConnectListName: 'updateConnectListName',
	getListForDataEnrichment: 'getListForDataEnrichment',
	enrichDataPerson: 'enrich-data-person',
	
	// getDiversityAndInclusion: 'getDiversityAndInclusion',
	// getUserDiversityList: 'getUserDiversityList',

	/* DG_LIST Endpoints */

	/* DG_LAND_REGISTRY Endpoints */
	getLandSearchResults: "getLandSearchResults",
	getLandSearchResultsPublic: "getLandSearchResultsPublic",
	/* DG_LAND_REGISTRY Endpoints */

	/* DG_HELPDESK Endpoints */
	suggestRequest: "suggestRequest",
	directorSuggestRequest: "directorSuggestRequest",
	insertUpdateUserSuggestionIndustrytag: "insertUpdateUserSuggestionIndustrytag",
	getSuggestRequest: "GetSuggestRequest",
	getDirectorSuggestions: "getDirectorSuggestions",
	getSuggestedIndustryTagRequest: "getSuggestedIndustryTagRequest",
	updateDirectorContactInfoData: "updateDirectorContactInfoData",
	rejectUserSuggestion: "rejectUserSuggestion",
	rejectUserDirectorSuggestion: "rejectUserDirectorSuggestion",
	updateIndustryTagMaster: "updateIndustryTagMaster",
	rejectUserSuggestionIndustryTag: "rejectUserSuggestionIndustryTag",
	otherContactSuggestRequest: "otherContactSuggestRequest",
	getSuggestedOtherContactRequest: "getSuggestedOtherContactRequest",
	rejectOtherContactSuggestion: "rejectOtherContactSuggestion",
	addNewTags: "addNewTags",
	/* DG_HELPDESK Endpoints */

	/* DG_REAL_TIME Endpoints */
	realTimeCompany: "getRealTimeCompany",
	/* DG_REAL_TIME Endpoints */

	/* DG_FEATURES Endpoints */
	allFeatures: "getAllFeatures",
	updatePlanFeaturesByName: "updatePlanFeaturesByName",
	all: "all",
	activeFeatures: "getActiveFeatures",
	userFeatures: "getUserFeatures",
	userTeamFeatures: "userTeamFeatures",
	teamFeaturesList: 'teamFeaturesList',
	teamNamesList: 'teamNamesList',
	createTeam: 'createTeam',
	modifyTeamFeatures: 'modifyTeamFeatures',
	/* DG_FEATURES Endpoints */

	/* DG_PLANS Endpoints */
	planDetail: "getPlanDetail",
	allPlan: "getAllPlan",
	reportsPlan: "getReportsPlan",
	creditReportPlan: "creditReportPlan",
	pepAndSanctionPlan: "getPepAndSanctionPlan",
	/* DG_PLANS Endpoints */

	/* DG_PAYMENT Endpoints */
	freeSubscription: "freeSubscription",
	paidSubscription: "paidSubscription",
	paymentAuthFailedMoveUser: "paymentAuthFailedMoveUser",
	couponValidation: "couponValidation",
	createPaymentIntent: "createPaymentIntent",
	/* DG_PAYMENT Endpoints */

	/* DG_WEBHOOK Endpoints */
	/* DG_WEBHOOK Endpoints */

	/* DG_SUBSCRIPTION Endpoints */
	allSubscriptions: "getAllSubscriptions",
	custId: "getCustId",
	subsId: "getSubsId",
	updatePaidSubscription: "updatePaidSubscription",
	/* DG_SUBSCRIPTION Endpoints */

	/* DG_COMPANY_DETAILS Endpoints */
	ccjDetails: "getCCJDetails",
	possibleCCJDetails: "getPossibleCCJDetails",
	shareDetails: "getShareDetails",
	commentary: "getCommentary",
	safeAlerts: "getSafeAlerts",
	acquisitonMergerInformation: "getAcquisitonMergerInformation",
	tradingAddressNew: "getTradingAddressNew",
	getEcsData: "getEcsData",
	companyGroupStructure: "getCompanyGroupStructure",
	companyGroupStructureForReport: "getCompanyGroupStructureForReport",
	companyStatus: "getCompanyStatus",
	companyPatentData: "getCompanyPatentData",
	importExportData: "getImportExportData",
	statutoryAccountsNew: "getStatutoryAccountsNew",
	financialRatios: "getFinancialRatios",
	statutoryAccounts: "getStatutoryAccounts",
	shareholdingsForDirectorDetails: "getShareholdingsForDirectorDetails",
	companyShareHoldings: "getCompanyShareHoldings",
	getPersonShareHoldings: "getPersonShareHoldings",
	othersContactInfo: "othersContactInfo",
	getContractHistory: "GetContractHistory",
	DG_COMPANY_DETAILS: "DG_COMPANY_DETAILS",
	DG_PROMPT_QUERY: "query",
	promptHistory: "prompt-history",
	fetchMore: "fetchMore",
	/* DG_COMPANY_DETAILS Endpoints */

	/* DG_PUBLIC Endpoints */
	creditScore: "getCreditScore",
	/* DG_PUBLIC Endpoints */

	/* DG_CBIL Endpoints */
	createUserSetting: "createUserSetting",
	cbilsUserSettingsList: "getCbilsUserSettingsList",
	createUserData: "createUserData",
	cbilsUserDataList: "getCbilsUserDataList",
	cbilsUserDataListTableData: "getCbilsUserDataListTableData",
	updateBooleanOnBellClick: "updateBooleanOnBellClick",
	deleteCbilData: "deleteCbilData",
	exportCustomerWatchAll: "exportCustomerWatchAll",
	/* DG_CBIL Endpoints */

	/* DG_DIRECTOR_DETAILS Endpoints */
	disqualifiedDirectors: "getDisqualifiedDirectors",
	deletedDirectors: "getDeletedDirectors",
	directorsExceptions: "getDirectorsExceptions",
	/* DG_DIRECTOR_DETAILS Endpoints */

	/* DG_FEEDBACK Endpoints */
	feedbackQuestionList: "feedback-question-list",
	/* DG_FEEDBACK Endpoints */

	/* DG_PEP_SANCTIONS Endpoints */
	updatePepAndSanctionsData: "updatePepAndSanctionsData",
	pepAndSanctionsData: "getPepAndSanctionsData",
	acceptedPepAndSanctions: "acceptedPepAndSanctions",
	pepAndSanctionHistory: "pepAndSanctionHistory",
	userAcceptedPepAndSanctions: "getUserAcceptedPepAndSanctions",
	/* DG_PEP_SANCTIONS Endpoints */

	/* DG_VALUATION Endpoints */
	companyValuations: "companyValuations",
	companyValuationsHistory: "companyValuationsHistory",
	/* DG_VALUATION Endpoints */

	/* DG_ISCORE Endpoints */
	companyZscore: "getCompanyZscore",
	companyCagr: "getCompanyCagr",
	iscorePortfolioUserLists: "getIscorePortfolioUserLists",
	iscoreCompaniesPortfolioList: "addIscoreCompaniesPortfolioList",
	removeIscorePortfolioList: "removeIscorePortfolioList",
	updatePortfolioName: "updatePortfolioName",
	iscoreDashboardValuations: "iscoreDashboardValuations",
	listByIserviceCategory: "getListByIserviceCategory",
	portfolioListCompaniesLatestYearData: "getPortfolioListCompaniesLatestYearData",
	removeIscoreCompaniesPortfolioList: "removeIscoreCompaniesPortfolioList",
	graphApi: "graphApi",
	/* DG_ISCORE Endpoints */

	/* DG_RISK_ASSESMENT Endpoints */
	riskAssesmentData: "getRiskAssesmentData",
	creditorsDetailInfo: "getCreditorsDetailInfo",
	debtorsDetailInfo: "getDebtorsDetailInfo",
	/* DG_RISK_ASSESMENT Endpoints */

	/* DG_LRM Endpoints */
	officialCopyTitleKnown: "OfficialCopyTitleKnown",
	titleDeedHistory: "titleDeedHistory",
	/* DG_LRM Endpoints */

	/* DG_SALESFORCE Endpoints */
	saveSalesforceUserData: "saveSalesforceUserData",
	salesforceUserData: "getSalesforceUserData",
	salesforceRefreshTokenData: "getSalesforceRefreshTokenData",
	syncSalesforceData: "syncSalesforceData",
	createSaleforceLead: "createSaleforceLead",
	updateSalesforceLead: "updateSalesforceLead",
	removeTokenApi: "removeToken",
	updateSalesforceBooleanApi: "updateSalesforceBooleanByListId",
	/* DG_SALESFORCE Endpoints */

	/* DG_GULF Endpoints */
	/* DG_GULF Endpoints */


	/* DG_CHART Endpoints */
	barCharApi: "getBarChartDataURL",
	pieCharApi: "getPieChartDataURL",
	/* DG_CHART Endpoints */

	/* AUTOMATION SCHEDULER Endpoints */
	addJobToSchdulerApi: "addJobToSchduler",
	getJobByUserIdApi: "getJobByUserId",
	deleteJobByIdApi: "deleteJobById",
	updateJobApi: "updateJob",
	/* AUTOMATION SCHEDULER Endpoints */

	/** User Template Creation API End Point*/
	saveUserDefinedExportTemplate: "saveUserDefinedExportTemplate",
	saveUserDefinedContactTemplate: "saveUserDefinedContactTemplate",
	userDefinedContactTemplates: "userDefinedContactTemplates",

	/* ESG Endpoints */
	getESGData: "getEsgData",
	esgSelfAssessment: "esgSelfAssessment",
	getEsgWatchData: "getEsgWatchData",
	esgselfAssesmentSubmission: "esgselfAssesmentSubmission",
	saveEsgWatchData: "saveEsgWatchData",
	deleteEsgData: "deleteEsgData",
	getCarbonCalculatorData: "getCarbonCalculatorData",
	getCarbonCalculatorFormData: "getCarbanCalculatorFormData",
	saveCarbonCalculatorData: "saveCarbonCalculatorData",

	/* ESG Endpoints */

	/* BUYER-SUPPLIER Endpoints */
	getSupplierDataForTab: "getSupplierDataForTab",
	getBuyerDataForTab: "getBuyerDataForTab",
	getTopContractsData: "getTopContractsData",
	getBuyerDataForDashboard: "getBuyerDataForDashboard",
	getSupplierDataForDashboard: "getSupplierDataForDashboard",
	getNonRegBuyerData: "getNonRegBuyerData",
	getNonRegSupplierData: "getNonRegSupplierData",
	getNonRegBuyerSupplierDataByCmpNo: "getNonRegBuyerSupplierDataByCmpNo",
	getContractFinderData: "getContractFinderData",
	getContractFinderDataRevamp: "getContractFinderDataRevamp",
	getContractFinderDataForReferenceNumber: "getContractFinderDataForReferenceNumber",
	getContractFinderTableRefreshData: "getContractFinderTableRefreshData",
	supplierDataByNoticeIndentifier: "supplierDataByNoticeIndentifier",
	getAggregateByParamBuyerSupplier: "getAggregateByParamBuyerSupplier",
	getCpvCodes: "getCpvCodes",
	modPaymentInfo: "modPaymentInfo",
	getAllMonthYearForMOD: "getAllMonthYearForMOD",
	/* BUYER-SUPPLIER Endpoints */

	/* CONTRACT FINDER FILTER GET-AGGREGATEBY API*/
	getAggregateByParamContractFinder: "getAggregateByParamContractFinder",
	/* CONTRACT FINDER FILTER GET-AGGREGATEBY API*/

	// delete user template
	deleteUserTemplate: "deleteUserTemplate",
	deleteUserDefinedContactTemplate: "deleteUserDefinedContactTemplate",
	// delete user template

	// Sustainability Index chart data
	getSustainabilityIndexData: "getSustainabilityIndexData",
	// Sustainability Index chart data

	//getcompanyListByDirectorPNR //
	getCompanyDetailsByDirectorPnr: "getCompanyDetailsByDirectorPnr",
	//getcompanyListByDirectorPNR //

	//EPC DATA Endpoints
	getCompanyEpcLicenseByCompanyNumber: "getCompanyEpcLicenseByCompanyNumber",
	getCompanyEpcLicenseByTradingAdressId: "getCompanyEpcLicenseByTradingAdressId",
	getEpcCertificateByLmkKey: "getEpcCertificateByLmkKey", 
	getEpcRecommendationByLmkKey: "getEpcRecommendationByLmkKey",
	mapEpcCertificateDatawithCompanyNumber: "mapEpcCertificateDatawithCompanyNumber",
	deleteMappedEpcDataById: "deleteMappedEpcDataById",
	//EPC DATA Endpoints

	getUserHistories: "getUserHistories",

	//Exports New API
	exportExcelFile: "exportExcelFile",
	exportExcelFileWithFetchEmail: "export-companies",
	contactsExport: "contacts-export",
	contactsExportIr: "contactsExport-ireland",

	linkedInAuth: "linkedInAuth",

	// ESG-INDEX API
	getEsgIndexData: "getEsgIndexData",

	// Pdf Reports API
	getCompanyReports: "company",
	getEnterpriseReports: "getCompanyReport",
	getDirectorReport: "director",


	/* Branding Logo and Cover Image Endpoints Start Here */
	userImageUpload: 'upload-branding-images',
	getImageDetailByUserId: 'getImageDetailByUserId',
	deleteBrandingImages: 'delete-branding-images',
	/* Branding Logo and Cover Image Endpoints End Here*/

	// Endpoint for HubSpot
	checkToken: 'checkToken',
	pushToHubSpot: 'pushToHubSpot',
	searchContactsCountResult: "contactsCount",
	createHubspotContactForCRM: "createHubspotContact",
	updateHubspotContactForCRM: "UpdateContactToHubspot",

	// Endpoint for Search Ai
	getSearchResultsByAi: 'getSearchResultsByAi',
	getAiRequestPrompt: 'getAiRequestPrompt',

	getAllTagsList: 'getAllTagsList',
	"diversity-spends-new-stats-v2": "diversity-spends-new-stats-v2",

	// Endpoint for new buyer and supplier screen
	getContractFinderDataForBuyer: 'getContractFinderDataForBuyer',
	getContractFinderDataForSupplier: 'getContractFinderDataForSupplier'
};

