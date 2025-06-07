import { MenuItem } from "primeng/api";
import { UserAddOnType, UserRolesType } from "src/app/interface/auth-guard/user-auth/user-info";
import { latLongModel } from "src/app/interface/models/company-data-model";
import { apiRoute } from "../../../../../apiBus/apiRouteConstants";
import { apiEndpoint } from "../../../../../apiBus/apiEndpointServiceConstants";

type FilterOptionsListType = 'basic' | 'advanced';
type calenderDateRangeObject = { fromMinDate?: number | Date, fromMaxDate: number | Date, toMinDate?: number | Date, toMaxDate: number | Date };
type calenderYearRangeObject = { minYear: number | Date, maxYear: number | Date };
type APIPathParamsType = { route: keyof typeof apiRoute, endpoint: keyof typeof apiEndpoint, reqBy?: string, pageName?: string, aggRequest?: boolean };

type RadiusPropTypes = {
    radius?: number,
    postCode?: string,
    userLocation?: latLongModel,
    chip_values?: Array<string>
};

type FilterSecondBlockComponentTypes = 'string-search' | 'date-range' | 'input-range' | 'list-box' | 'tree-list' | 'radius-slider' | 'preference-options' | 'upgrade-plan' | 'year-range' | 'group-list-box';
type FilterSecondBlockComponentFeatureTypes = 'single' | 'multi' | 'number' | 'default-search' | 'custom-search' | 'sort-by' | 'exclude-selected' | 'range-selection' | 'single-input' | 'contract-finder-note' | 'exact-search' | 'radio_button' | 'info-icon' | 'uppercase' | 'showCheckBox' | 'leadCheckBox' | 'no-format';
type FilterSecondBlockComponentOutputTypes = {
    chip_group?: string,
    chip_values?: Array<any>,
    companySearchAndOr?: 'and' | 'or',
    directorNameSearchAndOr?: 'and' | 'or',
    filterInputKeywords?: string,
    chip_industry_sic_codes?: Array<string>,
    preferenceOperator?: Array<{ [key: string]: 'true' | 'false' | 'include' | 'only' }>,
    filter_exclude?: boolean,
    pageName?: string,
    listId?: string,
    label?: string
};

type ExtendedMenuItems = Omit< MenuItem, 'items' > & {
    key?: string,
    displayLabel?: string,
    chipGroupLabel?: string,
    previousLabels?: Array< string >,
    parentLabel?: string,
    group?: string,
    selected?: boolean,
    locked?: boolean,
    rolesAccess?: Array< UserRolesType >,
    featureAccessKey?: string,
    addOnAccessKey?: keyof UserAddOnType,
    forcedFeatureAccess?: boolean,
    withAggregation?: APIPathParamsType,
    filterSearchArrayKey?: string,
    countryAccess: Array<string>,
    componentTypes?: FilterSecondBlockComponentTypes[],
    componentFeatures?: FilterSecondBlockComponentFeatureTypes[],
    additionalNote?: string,
    dateRange?: calenderDateRangeObject,
    items?: ExtendedMenuItems[],
    optionalLabel?: string,
    imagePath?: string,
    iTagContent?: string
};

type FilterOptionsType = {
    companySearch?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    landCorporate?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] }, // commercialProperty
    landRegistry?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] }, // residentialProperty
    lendingLandscapePage?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    contractFinderPage?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    buyersDashboard?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    suppliersDashboard?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    esgIndex?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    accountSearch?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    chargesDescription?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    companyDescription?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    companyLinkedIn?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    personLinkedIn?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    'investor-finder'?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    'investee-finder'?: { basic?: ExtendedMenuItems[], advanced?: ExtendedMenuItems[] },
    
};

type PreferenceOptionsType = {
    parentHeader: string,
    options: Array< PreferenceOptionItemType >
    countryAccess?: string[]
}

type PreferenceOptionItemType = {
    header: string,
    items: Array< PreferenceControllerParentType >
    countryAccess?: string[],
    iTagContent?: string,
    componentFeatures?: Array<FilterSecondBlockComponentFeatureTypes>
}

type PreferenceControllerParentType = {
    label: string,
    controlLabel?: string,
    controllers?: Array< PreferenceControllerType >
    disabledCheck?: boolean,
    countryAccess?: string[]
}

type PreferenceControllerType = {
    label: string,
    value: boolean,
    preferenceOperator: { [key: string]: 'true' | 'false' | 'include' | 'only' },
    outputLabel: string
}

export const enum AccordionLightShades {
    public = '#33a1c8',
	private = '#66b8d6',
	combine = '#80abe4',
	addOn = '#66b3e2',
    primaryColor = '#009688'
    
}

export const enum AccordionDarkShades {
    public = '#2981a0',
	private = '#5ca6c1',
	combine = '#739acd',
	addOn = '#528fb5'
}