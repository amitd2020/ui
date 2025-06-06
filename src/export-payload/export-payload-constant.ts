export interface exportPayloadModel {
    appliedFilters: Array<any>,
    exportSheetType: string,
    sheetType: string,
    exportType: string,
    columns: Array<any>,
    userId: string,
    emailId: string,
    fileName: string,
    exportCount: number,
    listId: string,
    userRole: string,
    selectedCompanyArray: Array<any>,
    templateName: string
}

export const exportPayloadConstant: exportPayloadModel = {
    appliedFilters: [],
    exportSheetType: '',
    sheetType: '',
    exportType: '',
    columns: [
        {
            personContactInformation: []
        },
        {
            companyInformation: []
        },
        {
            directorsInformation: []
        },
        {
            contactInformation: []
        },
        {
            pscInformation: []
        },
        {
            shareholderInformation: []
        },
        {
            tradingAddressInformation: []
        },
        {
            financialInformation: []
        },
        {
            chargesInformation: []
        },
        {
            diversityAndInclusionInformation: []
        },
        {
            corporateLandInformation: []
        }
    ],
    userId: '',
    emailId: '',
    fileName: '',
    exportCount: 0,
    listId: '',
    userRole: '',
    selectedCompanyArray: [],
    templateName: ''
};