export interface CompanyDetailModel {
    total_directors_count: number;
    CompanyNameOriginal: string;
    URI: string;
    RegAddress: any[],
    CompanyName: string;
    Returns: string;
    CompanyNumber: number;
    pin: string;
    hasContactInfo: boolean;
    id: string;
    active_directors_count: number;
    resigned_directors_count: number;
    CompanyStatus: string;
    SICCode_4: string;
    hasFinances: boolean;
    SICCode_2: string;
    hasLandCorporate: boolean;
    active_directors: string;
    hasCharges: boolean;
    SICCode: string;
    LimitedPartnerships: string;
    CompanyCategory: string;
    Accounts: string;
    Mortgages: string;
    IncorporationDate: Date;
}

export interface latLongModel {
    lat: number;
    lon: number;
}