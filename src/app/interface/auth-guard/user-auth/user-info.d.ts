import { MenuItem } from "primeng/api";

type UserRolesType = 'Under Development' | 'Super Admin' | 'Client Admin Master' | 'Client Admin' | 'Client User' | 'Team Admin' | 'Individual' | 'Any' | 'admin';
type CountryCodeType = 'uk' | 'ie';

type UserInfoType = {
	dbID: string,
	email: string,
	isSubscriptionActive: boolean,
	planId: string,
	userRole: UserRolesType,
	username: string,
	teamId: string,
	isTrial: boolean,
	sessionExp: Date,
	// Optional
	teamAdmin?: boolean,
	featureLockIconPath?: string,
	featureLockIconForValentineOnly?: string,
	clientAdminEmail?: string,
    userFavourite_id?: string,
    exportedBucket_id?: string,
    companyName?: string,
    companyNumber?: string,
    addOnFeaturesDataObject?: object,
	userCommercialIds?: Array<{ _id: string, listName: string }>
}

type UserFeaturesType = {
	_id: string
	name: string
	featureEnabled: boolean
	description: string
	pageName: string
	pageNameDescription: string
}

type UserAddOnType = {
	accountSearch?: boolean
	accountType?: boolean
	chargesDescription?: boolean
	companyDescription?: boolean
	companyMonitorPlus?: boolean
	contactInformation?: boolean
	corporateCount?: boolean
	corporateRiskLandscape?: boolean
	crmExport?: boolean
	defaultExportFeature?: boolean
	diversityAndInclusion?: boolean
	emailSpotter?: boolean
	enterpriseReport?: boolean
	epc?: boolean
	ethnicDiversity?: boolean
	ethnicityFilter?: boolean
	exportTemplate?: boolean
	femaleFounder?: boolean
	governmentEnabler?: boolean
	hnwiLandscape?: boolean
	industryAnalysis?: boolean
	internationalTradeFilter?: boolean
	internationalTradeLandscape?: boolean
	investorInvesteeLandscape?: boolean
	lendingLandscape?: boolean
	propertiesCount?: boolean
	propertyIntelligence?: boolean
	riskFilter?: boolean
	specialFilter?: boolean
	valuationFilter?: boolean
	smartIntel?: boolean
	companyLinkedIn?: boolean
	personLinkedIn?: boolean
	diversityCalculation?: boolean
	webWiget?: boolean,
	charities?: boolean,
	developerFeatures?: boolean
	statsComparison?: boolean,
	benchMarking?: boolean,
	dataEnrichment?: boolean
}

type ExtendedMainMenuItems = Omit< MenuItem, 'items' > & {
	accessType: 'public' | 'restricted',
	featureLockedBoolean?: boolean,
	roles?: Array< UserRolesType >,
	countryAccess?: Array< CountryCodeType >,
	addOnCheck?: keyof UserAddOnType,
	wildCardCheck?: any,
	listIdToken?: string,
	items?: ExtendedMainMenuItems[],
	isPanelCollapsed?: boolean
}