class ApiEndpointSets {
    default = "searchApiAggregateByParam";
    SIC_Codes = "getIndustries";
    Commodity_Code = "commodityCode";
    getPropertyValue = ( propName ) => {
        return this[ propName ];
    };
}

class CompanyDetailsPage extends ApiEndpointSets {
    constructor() {
        super();
    }
};

let companyDetailsPage = new CompanyDetailsPage;
class CompanySearchPage extends ApiEndpointSets {
    constructor() {
        super();
    }
};
class InsightsSearch extends ApiEndpointSets {
    constructor() {
        super();
    }
};
class LendingLandscapePage extends ApiEndpointSets {
    constructor() {
        super();
    }
};