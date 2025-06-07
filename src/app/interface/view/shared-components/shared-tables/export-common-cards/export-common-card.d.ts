type CardChildItemTypes = {    
    key: string;
    header: string;
    userDefinedHeader: string;
    cardName: string;
    disabled: boolean;
    editInput: boolean;
    view: SheetType[];
    defaultSelected?: boolean;
    childItem?:CardChildItemTypes;
    countryAccess?: Array< CountryCodeType >
}

type  CardParentItemTypes = {
    cardItem: Array<CardChildItemTypes>,
    view: SheetType[];
    colorCard: ColorCardType;
    cardHeader: string;
    cardKey: string;
    connectedItem?: object;
    countryAccess?: Array< CountryCodeType >;
    screenAccess?: Array<pageType>;
    accountAccess?: Array<accountType>;  
    addonType?: addons;
}

type SheetType = 'extended' | 'compressed' | 'qualifiedData';
type ColorCardType = 'greenCard' | 'blueCard' | 'voiletCard';
type CountryCodeType = 'uk' | 'ie';
type pageType =  'companySearch' | 'showContactScreen' | 'exportTemplatePage' | 'diversityInclusion';
type accountType = 'admin' | 'default' | 'public' | 'private' | 'combined';
type addons = 'contactInformation' | 'lendingLandscape' | 'diversityAndInclusion' | 'propertyIntelligence';