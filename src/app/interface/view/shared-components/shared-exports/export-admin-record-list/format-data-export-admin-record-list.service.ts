import { Injectable } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from "@angular/common";

import { CommonServiceService } from 'src/app/interface/service/common-service.service';


@Injectable({
	providedIn: 'root'
})
export class ExportAdminRecordlistService {

	constructor(
		private titlecasePipe: TitleCasePipe,
		private commonService: CommonServiceService,
		private datePipe: DatePipe,
		private toCurrencyPipe: CurrencyPipe
	) { }

	formatDataForCSV(columns, data, thisPage) {
		let actualVals = data;
		let actualCols = columns;
		let dataTemp = [];
		if (actualVals !== undefined) {

			if (thisPage == 'showContactScreen') {

				actualVals = actualVals.filter(val => val.email !== '');

			}

			for (let i = 0; i < actualVals.length; i++) {
				let tempRowData = {};
				for (let key in actualVals[i]) {

					for( let col of actualCols ) {
						if( col.field === "companyLinkUrl" ) {
							if (["companyNumber", 'companyRegistrationNumber'].includes(key)) {
								tempRowData[col.field] = `=HYPERLINK("https://app.datagardener.com/company-search?company=${ actualVals[i][key].toUpperCase() }")`;
							}
						}
					}

					if (key == 'IncorporationDate' || key == 'companyRegistrationDate') {
						tempRowData[key] = actualVals[i][key];
						tempRowData['companyAge'] = this.calculateCompanyAge(actualVals[i][key]);
					} else if (key === "SICCode" || key === "sic_code" || key === 'sicCode07') {
						let tempArray = this.commonService.getSICCodeInArrayFormat(actualVals[i][key]);
						let sicCodeString = '';
						for (let data of tempArray) {
							sicCodeString += data + "\n";
						}
						sicCodeString = sicCodeString.substring(0, sicCodeString.length - 1)
						tempRowData[key] = this.titlecasePipe.transform(sicCodeString);
					} else if (key == 'director_name') {
						if (actualVals[i].directorTitle) {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i].directorTitle) + ' ' + this.titlecasePipe.transform(actualVals[i][key]);
						} else {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]);
						}
					} else if (key == 'ward') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].toString());
					} else if (key == 'constituency') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].toString());
					} else if (key == 'country') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].toString());
					} else if (key == 'postcode') {
						tempRowData[key] = actualVals[i][key].toString().toUpperCase();
					} else if (key == 'accountsMadeUpDate') {
						tempRowData[key] = actualVals[i][key];
					} else if (['regions', 'region_array'].includes(key)) {

						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].toString());
					} else if (['cpvCodes', 'cpv_codes', 'code_desc_key'].includes(key)) {

						let tempStrCpv = '';

						for (let tempCpv of actualVals[i][key]) {
							tempStrCpv += tempCpv['code'] + ' ' + this.titlecasePipe.transform(tempCpv['desc'].replace(/.$/, "")) + ', ';
						}
						tempRowData[key] = tempStrCpv.substring(0, 25000);
					} else if (['cpv_codes_tree'].includes(key)) {

						for (let tempCpv of actualVals[i][key]) {
							tempRowData[key] = this.titlecasePipe.transform(tempCpv['code_desc_key']);
						}
					} else if (['isSME', 'isVCSE'].includes(key)) {

						tempRowData[key] = actualVals[i][key] && actualVals[i][key] == true ? 'Yes' : 'No';

					} else if (key == 'registrationDate') {
						tempRowData[key] = this.datePipe.transform(actualVals[i]['registrationDate'], 'dd/MM/yyyy');
					} else if (key == 'filedDate') {
						tempRowData[key] = this.datePipe.transform(actualVals[i]['filedDate'], 'dd/MM/yyyy');
					} else if (["businessName", "companyName", 'companyRegistrationNumber'].includes(key)) {
						tempRowData[key] = actualVals[i][key].toUpperCase();

					} else if (key == "ctps") {
						tempRowData[key] = actualVals[i][key] && actualVals[i][key].toLowerCase() === "y" ? "Yes" : actualVals[i][key] && actualVals[i][key].toLowerCase() === "n" ? "No" : "";
					} else if (key == "linkedin_url" && thisPage != 'showContactScreen') {
						tempRowData[key] = actualVals[i][key];
					} else if (key == "linkedin_url" && thisPage == 'showContactScreen') {
						tempRowData['otherFeatures'] = actualVals[i][key];
					} else if (key === "directorsData") {
						let directorName: string = "";
						if (actualVals[i][key]) {
							for (let j = 0; j < actualVals[i][key].length; j++) {

								directorName = actualVals[i][key][j].detailedInformation && actualVals[i][key][j].detailedInformation.fullName ? directorName + this.titlecasePipe.transform(actualVals[i][key][j].detailedInformation.fullName) : directorName + "";

								if (j !== actualVals[i][key].length && actualVals[i][key][j].detailedInformation && actualVals[i][key][j].detailedInformation.fullName) {

									if (actualVals[i][key].length - 1 == j) {

										directorName = directorName;

									} else {

										directorName = directorName + ",";
									}
								}
							}
						}

						tempRowData["directorName"] = directorName;
					} else if (key === "turnover_latest") {
						if (actualVals[i][key] && actualVals[i][key] !== "-") {
							tempRowData['turnover_latest'] = actualVals[i][key];
						} else {
							tempRowData['turnover_latest'] = "";
						}

					} else if (key === "estimated_turnover") {
						if (actualVals[i][key] && actualVals[i][key] !== "-") {
							tempRowData['estimated_turnover'] = this.toCurrencyPipe.transform(actualVals[i][key], '', '', '1.0-0');
						} else {
							tempRowData['estimated_turnover'] = "";
						}

					} else if (key === "totalAssets_latest") {
						if (actualVals[i][key] && actualVals[i][key] !== "-") {
							tempRowData['totalAssets_latest'] = actualVals[i][key];
						} else {
							tempRowData['totalAssets_latest'] = "";
						}

					} else if (key === "totalLiabilities_latest") {
						if (actualVals[i][key] && actualVals[i][key] !== "-") {
							tempRowData['totalLiabilities_latest'] = actualVals[i][key];
						} else {
							tempRowData['totalLiabilities_latest'] = "";
						}

					} else if (key === "netWorth_latest") {
						if (actualVals[i][key] && actualVals[i][key] !== "-") {
							tempRowData['netWorth_latest'] = actualVals[i][key];
						} else {
							tempRowData['netWorth_latest'] = "";
						}

					} else if (key === "grossProfit_latest") {
						if (actualVals[i][key] && actualVals[i][key] !== "-") {
							tempRowData['grossProfit_latest'] = actualVals[i][key];
						} else {
							tempRowData['grossProfit_latest'] = "";
						}

					} else if (key == "companyContactDetails") {
						if (actualVals[i][key] && actualVals[i][key].linkedin_url) {
							tempRowData['otherFeatures'] = actualVals[i][key].linkedin_url;
						}
					} else if (key == "email") {
						tempRowData[key] = actualVals[i][key];
					} else if (key == "esgScore") {
						tempRowData["esgCurrentPercentage"] = actualVals[i][key]['esgCurrentPercentage'];
						tempRowData["esgPreviousPercentage"] = actualVals[i][key]['esgPreviousPercentage'];
					} else if (key == 'eScore') {
						tempRowData["eCurrentPercentage"] = actualVals[i][key]['eCurrentPercentage'];
						tempRowData["ePreviousPercentage"] = actualVals[i][key]['ePreviousPercentage'];
					} else if (key == 'sScore') {
						tempRowData["sCurrentPercentage"] = actualVals[i][key]['sCurrentPercentage'];
						tempRowData["sPreviousPercentage"] = actualVals[i][key]['sPreviousPercentage'];
					} else if (key == 'gScore') {
						tempRowData["gCurrentPercentage"] = actualVals[i][key]['gCurrentPercentage'];
						tempRowData["gPreviousPercentage"] = actualVals[i][key]['gPreviousPercentage'];
					} else if (key == 'carbonEmission') {
						tempRowData["carbonCurrentTotal"] = actualVals[i][key]['carbonCurrentTotal'];
						tempRowData["carbonPreviousTotal"] = actualVals[i][key]['carbonPreviousTotal'];
					} else if (key == "website") {
						tempRowData[key] = actualVals[i][key];
					} else if (key == "companyRegistrationNumber") {
						tempRowData[key] = actualVals[i][key];
					} else if (key == "shareHoldingTotalCount") {
						tempRowData[key] = actualVals[i][key];
					} else if (key == 'industryArray') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].toString().replace(/,/g, ", "));
					} else if (key == 'shareholdingInformation') {
						tempRowData[key] = '';
					} else if (key == 'isDirector') {
						let additonalInfo = [];

						actualVals[i]['isPsc'] ? additonalInfo.push("PSC") : "";
						actualVals[i][key] ? additonalInfo.push("Director") : "";
						actualVals[i]['isShareholder'] ? additonalInfo.push("Shareholder") : "";
						actualVals[i]['isHighestShareholder'] ? additonalInfo.push("Highest Shareholder") : "";
						actualVals[i]['isSecondHighestShareholder'] ? additonalInfo.push("Second Highest Shareholder") : "";
						actualVals[i]['isPossibleDirector'] ? additonalInfo.push("Possible Director") : "";

						tempRowData["otherFeaturesForEmails"] = additonalInfo.join(", ");

					} else if (key == 'suppliers') {

						let tempData: Array<any> = [];

						for (let supplierName of actualVals[i][key]) {

							tempData.push(this.titlecasePipe.transform(supplierName.name));

						}

						tempRowData['suppliersName'] = tempData.join(', ');

					} else if ( key == 'directorAddress' ) {

						tempRowData["directorAddress"] = this.commonService.directorAddress(actualVals[i][key]);

					} else if ( key == 'job_title' ) {

						tempRowData[key] = actualVals[i][key].split(',').map(s => s.trim()).join(', ');

					} else if ( key == 'internationalScoreDescription' ) {

						tempRowData["internationalScoreDescription"] =  actualVals[i][key] == 'not scored' ? 'Not Scored / Very High Risk': actualVals[i][key];

					} else {

						if ( typeof (actualVals[i][key]) === "string" ) {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]);
						}
						else {
							tempRowData[key] = actualVals[i][key];
						}
						
					}
				}
				dataTemp.push(tempRowData);
				
			}		
		}
        return dataTemp;
	}

	calculateCompanyAge(dob) {
		return this.commonService.calculateAge(dob);
	}
	
}
