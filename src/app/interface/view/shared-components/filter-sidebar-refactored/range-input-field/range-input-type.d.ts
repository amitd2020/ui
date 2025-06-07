type InputRangeType = {
    minFractionDigits?: number;
    maxFractionDigits?: number;
    minValue?: number;
    maxValue?: number;
    mode?: 'decimal' | 'currency';
    currencyCode?: 'GBP' | 'EUR';
    prefix?: string;
    suffix?: string;
    minPlaceholder?: string;
    maxPlaceholder?: string;
    disable?: boolean;
    greater_than?: number | string;
    less_than?: number | string;
    errorMessage?: {
        empty: string,
        gtLtValueCheck: string
    };
    canBeNegative?: boolean;
    addRowButton?: boolean;
    deleteRowButton?: boolean;
    dropdown?: boolean;
    andOrInputSwitch?: boolean;
    numOfFinacialField?: Array<any>;
    estimatedToggle?: boolean;
    dirAgeToggle?: boolean;
    
}

export type InputRecordType = {
    [key: string] : InputRangeType
}


// {
//     minFractionDigits: 0number;
//     maxFractionDigits: 0,
//     minValue: 0,
//     mode: 'decimal'
//     currencyCode: 'GBP',
//     prefix: undefined,
//     minPlaceholder: 'Greater Than',
//     maxPlaceholder: 'Less Than',


// }