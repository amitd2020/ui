import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';

export enum IScoreLables {

    Iscore1 = '1. Pretax Profit Percentage',
    Iscore2 = '2. Current Ratio',
    Iscore3 = '3. Sales Per Net Working Capital',
    Iscore4 = '4. Gearing Ratio',
    Iscore5 = '5. Equity Ratio',
    Iscore6 = '6. Creditor Days',
    Iscore7 = '7. Debtor Days',
    Iscore8 = '8. Liquidity Test',
    Iscore9 = '9. Return Capital Employed',
    Iscore10 = '10. Return Total Assets',
    Iscore11 = '11. Debts Equity',
    Iscore12 = '12. Return Equity',
    Iscore13 = '13. Return Net Assets',
    Iscore14 = '14. Total Debt Ratio'
}

export enum HeaderEnum {

    PRETAX_PROFIT_PERCENTAGE = '1. Pretax Profit Percentage',
    CURRENT_RATIO = '2. Current Ratio',
    SALES_PER_NET_WORKING_CAPITAL = '3. Sales Per Net Working Capital',
    GEARING_RATIO = '4. Gearing Ratio',
    EQUITY_RATIO = '5. Equity Ratio',
    CREDITOR_DAYS = '6. Creditor Days',
    DEBTOR_DAYS = '7. Debtor Days',
    LIQUIDITY_TEST = '8. Liquidity Test',
    RETURN_CAPITAL_EMPLOYED = '9. Return Capital Employed',
    RETURN_TOTAL_ASSETS = '10. Return Total Assets',
    DEBT_EQUITY = '11. Debts Equity',
    RETURN_EQUITY = '12. Return Equity',
    RETURN_NET_ASSETS = '13. Return Net Assets',
    TOTAL_DEBT_RATIO = '14. Total Debt Ratio'

}

@Injectable({
    providedIn: 'root'
})
export class CommonServiceService {

    linkedInCode = new BehaviorSubject('');

    constructor(
        private titlecasePipe: TitleCasePipe
    ) { }

    typeOfData(val) {
        return typeof val;
    }

    camelCaseToTitleCaseStr(inputStr: string) {
        return inputStr.replace(/_|-/g, " ").match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); })
    }

    changeToDate(value: any): Date | null {
        if ((typeof value === 'string') && ((value.indexOf('-') > -1) || (value.indexOf('/') > -1))) {
            let str;

            if ((value.indexOf('-') > -1)) {
                str = value.split('-');
            } else if (value.indexOf('/') > -1) {
                str = value.split('/');
            }

            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);

            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }


    // Below commented DATE CALCULATION is replaced with new method, mention just below this Commented code.

    // calculateAge(dob) {
    //     if (dob) {
    //         dob = dob.replace(/-/g, "/");
    //         let year: string = "";
    //         let month: string = "";
    //         let index: number = 0;
    //         for (let i = dob.length; i >= 0; i--) {
    //             if (dob.charAt(i) === "/") {
    //                 index = index + 1;
    //                 if (index === 2) break;
    //             }
    //             if (index === 0 && dob.charAt(i) !== "/") year = dob.charAt(i) + year;
    //             else if (index === 1 && dob.charAt(i) !== "/")
    //                 month = dob.charAt(i) + month;
    //         }
    //         let current_year: number = new Date().getFullYear();
    //         let current_month: number = new Date().getMonth() + 1;
    //         dob =
    //             dob.substring(3, 5) + "/" + dob.substring(0, 3) + dob.substring(6, 10);
    //         let incorporation_date: number = (Number(year) * 12 + Number(month)) / 12;
    //         let current_data_with_month: number =
    //             (current_year * 12 + current_month) / 12;
    //         return this.round(current_data_with_month - incorporation_date, 1);
    //     }
    //     return "-";
    // }

    calculateAge = ( inputDate ) => {

        /**
         * `inputDate` format should be: 'dd/mm/yyyy' | 'dd-mm-yyyy'
         */
    
        const CurrentDate = new Date();
        
        if ( !inputDate ) return; // If there is null value in inputDate key, function will terminate at this Point and return from here.
        
        inputDate = inputDate.includes('-') ? inputDate.split('-') : inputDate.split('/'); // Splitting normal date string with '/' or '-'.
        
        /**
         * 1. Converting `inputDate` ( dd/mm/yyyy ) to ( yyyy-mm-dd ).
         * 2. Added 'T00:00:00Z' to convert the normal date string to real date string.
         */
        let finalInputDate = (`${ inputDate[2] }-${ inputDate[1] }-${ inputDate[0] }T00:00:00Z`);
        
        let dobDate = new Date( finalInputDate );
    
        let totalTime = CurrentDate.getTime() - dobDate.getTime(); // Getting the diff of timestamps for both dates.
        let totalDays = Math.ceil( totalTime / ( 1000 * 60 * 60 * 24 ) ); // Converting Timestamp in days. Formula to calculate days: ( Miliseconds  Secons  Minutes  Hours )
        let totalAgeYears: any = totalDays / 365; // Converting Days into Months.
    
        totalAgeYears = ( totalAgeYears % 1 ) && !!( +totalAgeYears.toFixed(1).split('.')[1] ) // Condition ( Boolean: Value has decimal ) && ( If the decimal value is not 0 ).
            ? totalAgeYears.toFixed(1) // XXX.XXXXXX = XX.X
            : Math.floor( totalAgeYears ); // XXX.XXXXXX = XX
        
        return totalAgeYears;
        
    };

    calculateAgeForLandscapes(dob) {
        if (dob) {
            let year: string = "";
            let month: string = "";
            let index: number = 0;
            for (let i = dob.length; i >= 0; i--) {
                if (dob.charAt(i) === "-") {
                    index = index + 1;
                    if (index === 2) break;
                }
                if (index === 0 && dob.charAt(i) !== "-") year = dob.charAt(i) + year;
                else if (index === 1 && dob.charAt(i) !== "-")
                    month = dob.charAt(i) + month;
            }
            let current_year: number = new Date().getFullYear();
            let current_month: number = new Date().getMonth() + 1;
            dob =
                dob.substring(3, 5) + "-" + dob.substring(0, 3) + dob.substring(6, 10);
            let incorporation_date: number = (Number(year) * 12 + Number(month)) / 12;
            let current_data_with_month: number =
                (current_year * 12 + current_month) / 12;
            return this.round(current_data_with_month - incorporation_date, 1);
        }
        return "-";
    }

    directorsAge(date_of_birth) {
        const monthNames = [ undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        let dob = date_of_birth;
        if(dob.date !== undefined) {
            date_of_birth = {
                month: monthNames[parseInt(dob.month)],
                year: dob.year
            }
        }
        date_of_birth = "01" + "/" + date_of_birth.month + "/" + date_of_birth.year;
        let birthday = new Date(date_of_birth);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    pscAddress(data) {
        let address = "";
        if (data.premisesNumber !== undefined && data.premisesNumber !== null && data.premisesNumber !== "") {
            address = address + this.titlecasePipe.transform(data.premisesNumber) + ",";
        }
        if (data.addressLine1 !== undefined && data.addressLine1 !== null && data.addressLine1 !== "") {
            address = address + this.titlecasePipe.transform(data.addressLine1) + ",";
        }
        if (data.addressLine2 !== undefined && data.addressLine2 !== null && data.addressLine2 !== "") {
            address = address + this.titlecasePipe.transform(data.addressLine2) + ",";
        }
        if (data.locality !== undefined && data.locality !== null && data.locality !== "") {
            address = address + this.titlecasePipe.transform(data.locality) + ",";
        }
        // if (data.locality !== undefined && data.locality !== null) {
        //     address = address + this.titlecasePipe.transform(data.locality) + ",";
        // }
        if (data.postalCode !== undefined && data.postalCode !== null && data.postalCode !== "") {
            address = address + data.postalCode.toUpperCase() + ", ";
        }
        if (data.region !== undefined && data.region !== null && data.region !== "") {
            address = address + this.titlecasePipe.transform(data.region);
        }
        address = address.replace(/,\s*$/, "");
        return address
    }

    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    getSICCodeInArrayFormat(SICCode) {
        if (SICCode) {
            let temp_sicCodes: string[] = [];
            if (SICCode.SicText_1) {
                let tempStr = SICCode.SicNumber_1 + ' - ' + SICCode.SicText_1
                temp_sicCodes.push(tempStr);
            }

            if (SICCode.SicText_2) {
                let tempStr = SICCode.SicNumber_2 + ' - ' + SICCode.SicText_2
                if (!(temp_sicCodes.includes(tempStr))) {
                    temp_sicCodes.push(tempStr);
                }
            }

            if (SICCode.SicText_3) {
                let tempStr = SICCode.SicNumber_3 + ' - ' + SICCode.SicText_3
                if (!(temp_sicCodes.includes(tempStr))) {
                    temp_sicCodes.push(tempStr);
                }
            }

            if (SICCode.SicText_4) {
                let tempStr = SICCode.SicNumber_4 + ' - ' + SICCode.SicText_4
                if (!(temp_sicCodes.includes(tempStr))) {
                    temp_sicCodes.push(tempStr);
                }
            }

            return temp_sicCodes;
        }
        else {
            return SICCode;
        }
    }


    public formatDate(date) {
        if (date === undefined) {
            return "-";
        } else if (date === null) {
            return "-";
        } else if (date === "-") {
            return "-";
        }
        else {
            if (/\/.*\//.test(date) == false && date.length == 10) {
                return this.parseDate(date);
            } else if (/\/.*\//.test(date) == true) {
                //regular expression to check that a date has a slash. Test is an inbuilt method of javascript to match regEx and return true.
                return this.parseDate(date);
            } else {
                return this.formatISODate(date);
            }
        }
    }

    public parseDate(date) {
        var darr = date ? date.split("/") : [];
        var dd = darr[0];
        var mm = darr[1];
        var yyyy = darr[2];
        if (
            dd === "1" ||
            dd === "2" ||
            dd === "3" ||
            dd === "4" ||
            dd === "5" ||
            dd === "6" ||
            dd === "7" ||
            dd === "8" ||
            dd === "9"
        ) {
            if (parseInt(darr[0]) < 10) {
                dd = "0" + darr[0];
            }
        }
        if (
            mm === "1" ||
            mm === "2" ||
            mm === "3" ||
            mm === "4" ||
            mm === "5" ||
            mm === "6" ||
            mm === "7" ||
            mm === "8" ||
            mm === "9"
        ) {
            if (parseInt(darr[1]) < 10) {
                mm = "0" + darr[1];
            }
        }
        var new_date = dd + "-" + mm + "-" + yyyy;
        return new_date;
    }

    formatISODate(date) {
        const date1 = new Date(date);
        let new_return_date = "";

        new_return_date =
            this.twoCharactersString(String(date1.getDate())) +
            "-" +
            this.twoCharactersString(String(date1.getMonth() + 1)) +
            "-" +
            date1.getFullYear();
        return new_return_date;
    }

    twoCharactersString(str): string {
        return str.length === 1 ? "0" + str : str;
    }

    formatDirectorName(name) {
        let nameStr = name.split(',');
        let dName
        if (nameStr[1] != undefined) {
            dName = nameStr[1] + ' ' + nameStr[0];
        }
        else {
            dName = nameStr[0];
        }
        return dName;

    }

    public formatCompanyAddress(address) {
        let str = "";
        if (address.addressLine1 != undefined && address.addressLine1 !== null) {
            if (address.addressLine1.length > 0 && address.addressLine1 !== "Not Provided") {
                str += this.titlecasePipe.transform(address.addressLine1) + ", ";
            } else if (address.addressLine1 === "Not Provided") {
                str += address.addressLine1.toLowerCase();
            }
        }
        if (address.addressLine2 != undefined && address.addressLine2 != null) {
            if (address.addressLine2.length > 0)
                str += this.titlecasePipe.transform(address.addressLine2) + ", ";
        }
        if (address.addressLine3 != undefined && address.addressLine3 != null) {
            if (address.addressLine3.length > 0)
                str += this.titlecasePipe.transform(address.addressLine3) + ", ";
        }
        if (address.addressLine4 != undefined && address.addressLine4 != null) {
            if (address.addressLine4.length > 0)
                str += this.titlecasePipe.transform(address.addressLine4) + ", ";
        }
        if (address.postalCode != undefined && address.postalCode.length > 0)
            str += address.postalCode.toUpperCase();
        // if (address.County != undefined && address.County.length > 0) str += address.County.toLowerCase() + ", ";
        // if (address.Country != undefined && address.Country.length > 0) str += address.Country.toLowerCase() + ", ";
        // if (address.PostCode != undefined && address.PostCode.length > 0) str += address.PostCode.toUpperCase() + "";

        var splitStr = str.split(" ");
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] =
                splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(" ");
    }

    public formatPscAddress(address) {
        let str = "";
        if (address.premises != undefined && address.premises.length > 0) str += address.premises.toLowerCase() + ", ";
        if (address.address_line_1 != undefined && address.address_line_1.length > 0 && address.address_line_1 !== "Not Provided") {
            str += address.address_line_1.toLowerCase() + ", ";
        } else if (address.address_line_1 === "Not Provided") {
            str += address.address_line_1.toLowerCase();
        }
        if (address.address_line_2 != undefined) {
            if (address.address_line_2.length > 0)
                str += address.address_line_2.toLowerCase() + ", ";
        }
        if (address.locality != undefined && address.locality.length > 0)
            str += address.locality.toLowerCase() + ", ";
        if (address.postal_code != undefined && address.postal_code.length > 0) str += address.postal_code.toUpperCase() + ", ";
        if (address.hasOwnProperty('region') && address.region.length > 0) str += address.region.toLowerCase() + ", ";

        var splitStr = str.split(" ");
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] =
                splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(" ");
    }

    public formatDirectorAddress(address) {
        if (address) {
            let str = "";
            if (address.addressLine1) {
                if (address.addressLine1.length > 0 && address.addressLine1 !== null) {
                    str += this.titlecasePipe.transform(address.addressLine1);
                }
            }
            if (address.addressLine2) {
                if (address.addressLine2.length > 0 && address.addressLine2 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.addressLine2);
                }
            }
            if (address.addressLine3) {
                if (address.addressLine3.length > 0 && address.addressLine3 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.addressLine3);
                }
            }
            if (address.addressLine4) {
                if (address.addressLine4.length > 0 && address.addressLine4 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.addressLine4);
                }
            }
            if (address.addressLine5) {
                if (address.addressLine5.length > 0 && address.addressLine5 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.addressLine5);
                }
            }
            if (address.postalCode) {
                if (address.postalCode.length > 0 && address.postalCode !== null) {
                    str += ", " + address.postalCode.toUpperCase();
                }
            }
            if (address.country) {
                if (address.country.length > 0 && address.country !== null) {
                    str += ", " + this.titlecasePipe.transform(address.country);
                }
            }
            if (address.regCareOfAddress) {
                if (address.regCareOfAddress.length > 0 && address.regCareOfAddress !== null) {
                    str += ", " + this.titlecasePipe.transform(address.regCareOfAddress);
                }
            }
            if (address.regPobox) {
                if (address.regPobox.length > 0 && address.regPobox !== null) {
                    str += ", " + this.titlecasePipe.transform(address.regPobox);
                }
            }
            return str;
        }

        return '';
    }

    public formatCompanyNameForUrl(companyName) {

        let regexp = /[&\/\\#,+()$~%'":*?<>{}|]/g;
        let regexpspace = / /g;
        if (companyName) {
            companyName = companyName.replace(regexp, "").replace(regexpspace, "-");
            return companyName;
        } else {
            return " ";
        }

    }

    public formatDirectorNameForUrl(directorName) {
        if (directorName) {
            let regexp = /[&\/\\#,+()$~%'":*?<>{}|]/g;
            let regexpspace = / /g;

            directorName = directorName.replace(regexp, "").replace(regexpspace, "-");

            return directorName;
        }
    }

    public formatNameForPersonEntitled(nameArray) {
        let tempNameArray = []
        nameArray.forEach(person_entitled => {
            if (person_entitled.includes(".")) {
                let tempArray = person_entitled.split(".");
                person_entitled = "";
                tempArray.forEach(name => {
                    name = this.titlecasePipe.transform(name)
                    person_entitled = person_entitled + name + ".";
                });
                person_entitled = person_entitled.substring(0, (person_entitled.length - 1))
                tempNameArray.push(person_entitled)
            }
            else {
                if (person_entitled !== "") {
                    tempNameArray.push(this.titlecasePipe.transform(person_entitled))
                }
            }

        });
        return tempNameArray;
    }

    public formatCompanyAddressNew(address) {
        let str = "";
        if (address.AddressLine1 != undefined){
        if (address.AddressLine1.length > 0 && address.AddressLine1 !== "Not Provided") {
        str += this.titlecasePipe.transform(address.AddressLine1) + ", ";
        } else if (address.AddressLine1 === "Not Provided") {
        str += address.AddressLine1;
        }
        }
        if (address.AddressLine2!=undefined){
        if (address.AddressLine2.length > 0)
        str += this.titlecasePipe.transform(address.AddressLine2) + ", ";
        }
        if (address.PostTown != undefined &&address.PostTown.length > 0)
        str += this.titlecasePipe.transform(address.PostTown) + ", ";
        if (address.County != undefined && address.County.length > 0) str += this.titlecasePipe.transform(address.County) + ", ";
        if (address.Country != undefined && address.Country.length > 0) str += this.titlecasePipe.transform(address.Country) + ", ";
        if (address.PostCode != undefined && address.PostCode.length > 0) str += address.PostCode.toUpperCase() + "";
        
        var splitStr = str.split(" ");
        for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(" ");
    }

    public arrayElementPositionChange(arr, old_index, new_index) {
        if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
            while (k--) {
            arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }

    modifyGridLikeMasonry( gridElem, colsXl, colsLg, colsMd, colsSm ) {

        let grid: any = document.querySelectorAll( gridElem ),
            gutterVal = 8,
            gridHeight = 0;

        for ( let gEl of grid ) {

            let gridCell = gEl.children,
                calculatedGridHeight = 0;
            
            for ( let gc of gridCell ) {
                gridHeight += gc.offsetHeight + gutterVal;
            }
    
            gEl.style['flex-flow'] = 'column wrap';
    
            if ( window.screen.width >= 1200 ) {
                calculatedGridHeight = ( gridHeight / colsXl ) + ( gridHeight / ( gridCell.length + 1 ) );
            } else if ( window.screen.width < 1200 && window.screen.width >= 1024 ) {
                calculatedGridHeight = ( gridHeight / colsLg ) + ( gridHeight / ( gridCell.length + 1 ) );
            } else if ( window.screen.width < 1024 && window.screen.width >= 768 ) {
                calculatedGridHeight = ( gridHeight / colsMd ) + ( gridHeight / ( gridCell.length + 1 ) );
            } else {
                calculatedGridHeight = ( gridHeight / colsSm ) + ( gridHeight / ( gridCell.length + 1 ) );
            }

            gEl.style['max-height'] = `${ calculatedGridHeight - 100 }px`;

        }

    }

    formatDateSlash (date) {
        let Receiveddate = new Date(date),
            year = Receiveddate.getFullYear(),
            month = (Receiveddate.getMonth() + 1).toString(),
            formatedMonth = (month.length === 1) ? ('0' + month) : month,
            day = Receiveddate.getDate().toString(),
            formatedDay = (day.length === 1) ?  ('0' + day) : day,
            hour = Receiveddate.getHours().toString()
        let formattedDate = formatedDay + '/' + formatedMonth + '/' + year;
        return formattedDate;
    }

    comparingObjects( obj1, obj2 ) {

		obj1 = typeof obj1 == 'object' ? JSON.stringify( obj1 ) : obj1;
		obj2 = typeof obj2 == 'object' ? JSON.stringify( obj2 ) : obj2;

		return Object.keys( obj1 ).length === Object.keys( obj2 ).length && Object.keys( obj1 ).every( key => obj1[ key ] == obj2[ key ]);
	}

    is_domain( str ) {

        let regexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;

        if (regexp.test( str )) {
            return true;
        }
        else {
            return false;
        }

    }

    camelCaseToSentence(str) {
        if (!str) {
            return "";
        }
        let result = str.replace(/([A-Z])/g, " $1");
        let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult;
    }


    formattedCamelCaseToSentence(str) {
        if (!str) {
            return "";
        }
        let final_string = "";
        let trim_string = str.trim().toLowerCase().split(",");
        for(var i = 0; i < trim_string.length; i++) {
            trim_string[i] = trim_string[i].charAt(0).toUpperCase() + trim_string[i].slice(1);
            if(i == trim_string.length - 1) {
                final_string += trim_string[i];
            } else if(i < trim_string.length) {
                final_string += trim_string[i] + ", ";
            }
        }
        return final_string;
    }
    
    formattedCamelCaseToSentenceforArray(strArray) {
        if (!strArray) {
            return "";
        }
        let input_string = "";
        for(var i = 0; i < strArray.length; i++) {
            if(i == strArray.length - 1) {
                input_string += strArray[i];
            } else if(i < strArray.length) {
                input_string += strArray[i] + ", ";
            }
        }
    
        let final_string = "";
        let trim_string = input_string.trim().toLowerCase().split(",");
        for(var i = 0; i < trim_string.length; i++) {
            trim_string[i] = trim_string[i].trim().toLowerCase();
            trim_string[i] = trim_string[i].charAt(0).toUpperCase() + trim_string[i].slice(1);
            if(i == trim_string.length - 1) {
                final_string += trim_string[i];
            } else if(i < trim_string.length) {
                final_string += trim_string[i] + ", ";
            }
        }
        return final_string;
    }

    //Get Month Name Function
    monthName ( month ) {

        let monthName = "";
        
        if ( month === "01" ) {
            monthName = "JAN";
        } else if ( month === "02" ) {
            monthName = "FEB";
        } else if ( month === "03" ) {
            monthName = "MAR";
        } else if ( month === "04" ) {
            monthName = "APR";
        } else if ( month === "05" ) {
            monthName = "MAY";
        } else if ( month === "06" ) {
            monthName = "JUN";
        } else if ( month === "07" ) {
            monthName = "JUL";
        } else if ( month === "08" ) {
            monthName = "AUG";
        } else if ( month === "09" ) {
            monthName = "SEP";
        } else if ( month === "10" ) {
            monthName = "OCT";
        } else if ( month === "11" ) {
            monthName = "NOV";
        } else if ( month === "12" ) {
            monthName = "DEC";
        }
        return monthName;

    }

    hexToRgb( hex ) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

        if ( result ) {
            let r= parseInt(result[1], 16);
            let g= parseInt(result[2], 16);
            let b= parseInt(result[3], 16);

            return r + "," + g + "," + b;
        }

        return null;
    }

    directorAddress(address){
        if (address) {
            let str = "";
            if (address.ADD1) {
                if (address.ADD1.length > 0 && address.ADD1 !== null) {
                    str += this.titlecasePipe.transform(address.ADD1);
                }
            }
            if (address.ADD2) {
                if (address.ADD2.length > 0 && address.ADD2 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.ADD2);
                }
            }
            if (address.ADD3) {
                if (address.ADD3.length > 0 && address.ADD3 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.ADD3);
                }
            }
            if (address.ADD4) {
                if (address.ADD4.length > 0 && address.ADD4 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.ADD4);
                }
            }
            if (address.ADD5) {
                if (address.ADD5.length > 0 && address.ADD5 !== null) {
                    str += ", " + this.titlecasePipe.transform(address.ADD5);
                }
            }
            if (address.CNTRY) {
                if (address.CNTRY.length > 0 && address.CNTRY !== null) {
                    str += ", " + this.titlecasePipe.transform(address.CNTRY);
                }
            }
            if (address.PCODE) {
                if (address.PCODE.length > 0 && address.PCODE !== null) {
                    str += ", " + address.PCODE.toUpperCase();
                }
            }
            
            return str;
        }
        return '';
    }

	linkedinURLForCompany(companyName: string) {
		if (companyName) {
			var NewName = companyName.split(" ");
			var FinalName = "";
			for (let i = 0; i < NewName.length; i++) {
				FinalName += NewName[i];
				FinalName += "+"
			}
			FinalName = this.regexForTrim(FinalName);
			FinalName = this.regexForRemovePlusFromLast(FinalName);
			const substring = "&";
			if (companyName.includes(substring)) {
				const stringReplacingAmpersands = companyName.replace(/&/g, "%26");
				return ("https://www.linkedin.com/search/results/companies/?keywords=" + encodeURIComponent( stringReplacingAmpersands.replace(/"/g, "").toLowerCase() ) );
			}
			return ("https://www.linkedin.com/search/results/companies/?keywords=" + encodeURIComponent( FinalName.replace(/"/g, "").toLowerCase() ) );
		} else {
			return companyName ? companyName.replace(/"/g, "") : '';
		}
	}

    regexForTrim(x: string) {
		return x.replace(/^\s+|\s+$/gm, '');
	}

    
	regexForRemovePlusFromLast(x: string) {
		return x.replace(/\++$/, '');
	}

    facebookURLForCompany(companyName: string) {

		if (companyName) {

			var NewName = companyName.split(" ");
			var FinalName = " ";
			for (let i = 0; i < NewName.length; i++) {
				if (NewName[i] !== "LIMITED" && NewName[i] !== "LTD") {
					FinalName += NewName[i] + " ";
				}
			}
			const substring = "&";

			if (companyName.includes(substring)) {
				const stringReplacingAmpersands = companyName.replace(/&/g, "%26");
				return "https://www.facebook.com/search/top/?q=" + encodeURIComponent( stringReplacingAmpersands.replace(/"/g, "") );
			}
			return "https://www.facebook.com/search/top/?q=" + encodeURIComponent( FinalName.replace(/"/g, "") );

		} else {
			return companyName ? companyName.replace(/"/g, "") : '';
		}
	}

    twitterURLForCompany(companyName: string) {

		if (companyName) {

			var NewName = companyName.split(" ");
			var FinalName = " ";

			for (let i = 0; i < NewName.length; i++) {

				if (NewName[i] !== "LIMITED" && NewName[i] !== "LTD") {
					FinalName += NewName[i] + " ";
				}

			}
			FinalName = this.regexForTrim(FinalName);
			FinalName = this.regexForRemovePlusFromLast(FinalName);

			const substring = "&";

			if (companyName.includes(substring)) {
				const stringReplacingAmpersands = companyName.replace(/&/g, "%26");
				return ( "https://www.twitter.com/search/results/top/?q=" + encodeURIComponent( stringReplacingAmpersands.replace(/"/g, "").toLowerCase() ) );
			}
			return ( "https://www.twitter.com/search/results/top/?q=" + encodeURIComponent( FinalName.replace(/"/g, "").toLowerCase() ) );
		} else {
			return companyName ? companyName.replace(/"/g, "") : '';
		}
	}

    GoogleURLCompanyURL(companyName: string) {
		return "https://www.google.co.uk/search?q=" + encodeURIComponent( companyName.replace(/"/g, "") );
	}

    GoogleURLCompanyURLwithoutWordCompany(companyName: string) {

        const substring = "&";

        if (companyName.includes(substring)) {
            const stringReplacingAmpersands = companyName.replace(/&/g, "%26");
            return "https://www.google.co.uk/search?q=" + stringReplacingAmpersands;
        }
        return "https://www.google.co.uk/search?q=" + companyName;

	}

    createNestedBreadcrumbs(menuItems: MenuItem[]) {

		let initialMenuItem: MenuItem[] = [{ label: 'Industry Sectors', routerLink: ['/industry-analysis/industry-sectors'] }];

		for (let item of menuItems) {
			item.routerLink = `/industry-analysis/industry-sectors${item.routerLink}`;
			initialMenuItem.push(item);
		}

		// this.breadcrumbService.setItems(initialMenuItem);
	}

    checkForeignCompany( companyNumber: string ): boolean {

        companyNumber.toLowerCase();

        let isForiegnCompany = companyNumber.charAt(0) == '#' ? true : ( companyNumber.charAt(0) + companyNumber.charAt(1) ) == 'ie';

        return isForiegnCompany;

    }

    convertImageToDataUrl( fileName: string ): Promise<string> {

        let imagePath = `assets/layout/images/${ fileName }`;

        return new Promise( resolve => {
            
            var image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = () => {
                var canvas = document.createElement( 'canvas' );
                var context = canvas.getContext( '2d' );
                canvas.height = image.naturalHeight;
                canvas.width = image.naturalWidth;
                context.drawImage( image, 0, 0 );
                var dataURL = canvas.toDataURL();

                return resolve( dataURL );
            };

            image.src = imagePath;
        });

    }
 
}
