export interface limit_data {
    serialNum: number;
    feature: string;
    total_Limit: string;
    limit_Available: string;
}

export interface corporateLand_data {
    id: string,
    companyno_1: string,
    status: string,
    CompanyName: string,
    propertyAddress: string,
    titleNumber: string,
    pricePaid: string,
    tenure: string,
    postCode: string,
    town: string,
    district: string,
    county: string,
    companyno_2: string,
    companyno_3: string,
    companyno_4: string
}

export interface subscription_data {
    planName: string;
    feature: string;
    planAmt: string;
    startDate: string;
    endDate: string;
    status: string;
    invoice: string;
}