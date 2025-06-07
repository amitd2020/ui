type PayloadFormationObj = {
    filterData?: Array<FilterDataTypes>;
    listId?: string;
    pageName?: string;
    filterSearchArray?:  Array<any>;
    pageSize?: number;
    startAfter?: number;
    pageNumber?: number;
    sortOn?: Array<any>;
    startPlan?: boolean;
    dissolvedIndex?: boolean; 
    userId?: string;
}

type FilterDataTypes = {
    chip_group: string,
    chip_values: Array<any>,
    companySearchAndOr?: string,
    directorNameSearchAndOr?: string,
    preferenceOperator?: Array<object>
};