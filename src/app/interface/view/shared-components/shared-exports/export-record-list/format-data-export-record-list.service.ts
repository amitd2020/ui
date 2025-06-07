import { CurrencyPipe, TitleCasePipe } from "@angular/common";
import { Injectable } from '@angular/core';
import { CommonServiceService } from "src/app/interface/service/common-service.service";

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}
@Injectable({
	providedIn: 'root'
})

export class FormatDataRecordListService {

	constructor(
		private commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private toCurrencyPipe: CurrencyPipe
	) { }

	formatData( companiesData, appliedFilters?, thisPage? ) {

		let searchedDirectorName: string = '', directorNameSearchCondition: string = '';

		// If Searched For Director From Header Search-bar or Filters

		if (appliedFilters) {
			for (let filterObj of appliedFilters) {
				if (filterObj.chip_group == 'Director Name') {
					directorNameSearchCondition = '';
					searchedDirectorName = filterObj.chip_values[0].toLowerCase();
					directorNameSearchCondition = filterObj.directorNameSearchAndOr;
				}
			}
		}


		let tempCompaniesData = [];

		if ( companiesData ) {

			companiesData.forEach(companyData => {

				companyData["total_directors_count"] = 0
				companyData["resigned_directors_count"] = 0;
				companyData["active_directors_count"] = 0;
				companyData["NumMortCharges"] = 0;

				if (companyData["companyRegistrationDate"] !== undefined) {
					if (companyData["companyRegistrationDate"] !== null) {
						companyData["companyRegistrationDate"] = this.formatDate(companyData["companyRegistrationDate"])
					}
				}

				if (companyData.companyContactDetails) {
					let tempArray = [];
					tempArray.push(companyData.companyContactDetails)
					companyData["companyContactDetails"] = tempArray;
				}

				if (companyData['RegAddress_Modified']) {
					companyData['RegAddress'] = this.commonService.formatCompanyAddress(companyData['RegAddress_Modified']);
				}

				companyData["total_directors_count"] = companyData["totalDirectorsCount"];
				companyData["active_directors_count"] = companyData["activeDirectorsCount"];
				companyData["resigned_directors_count"] = companyData["resingedDirectorsCount"];

				if (companyData["mortgagesObj"]) {
					companyData["NumMortCharges"] = companyData["mortgagesObj"].length;
				}

				if (companyData["accountsMadeUpDate"]) {
					companyData["accountsMadeUpDate"] = this.changeToDate(this.formatDate(companyData["accountsMadeUpDate"]));
				}

				if (companyData.ccjDetails) {
					companyData['CCJCount'] = companyData.ccjDetails.length;
				} else {
					companyData['CCJCount'] = '-';
				}

				// if (companyData.RegAddress_Modified.district_code) {
				//     companyData.RegAddress_Modified.district_code = companyData.RegAddress_Modified.district_code.toUpperCase();
				// }

				if (companyData.simplifiedAccounts) {
					if (companyData.simplifiedAccounts[0].turnover && companyData.simplifiedAccounts[0].turnover != "") {
						companyData['turnover_latest'] = companyData.simplifiedAccounts[0].turnover;
					} else {
						companyData['turnover_latest'] = "-";
					}
					if (companyData.simplifiedAccounts[0].estimated_turnover && companyData.simplifiedAccounts[0].estimated_turnover != "") {
						companyData['estimated_turnover'] = companyData.simplifiedAccounts[0].estimated_turnover;
					} else {
						companyData['estimated_turnover'] = "-";
					}
					if (companyData.simplifiedAccounts[0].totalAssets && companyData.simplifiedAccounts[0].totalAssets != "") {
						companyData['totalAssets_latest'] = companyData.simplifiedAccounts[0].totalAssets;
					} else {
						companyData['totalAssets_latest'] = "-";
					}
					if (companyData.simplifiedAccounts[0].totalLiabilities && companyData.simplifiedAccounts[0].totalLiabilities != "") {
						companyData['totalLiabilities_latest'] = companyData.simplifiedAccounts[0].totalLiabilities;
					} else {
						companyData['totalLiabilities_latest'] = "-";
					}
					if (companyData.simplifiedAccounts[0].netWorth && companyData.simplifiedAccounts[0].netWorth != "") {
						companyData['netWorth_latest'] = companyData.simplifiedAccounts[0].netWorth;
					} else {
						companyData['netWorth_latest'] = "-";
					}
					if (companyData.statutoryAccounts) {
						if (companyData.statutoryAccounts[0].grossProfit && companyData.statutoryAccounts[0].grossProfit != "") {
							companyData['grossProfit_latest'] = companyData.statutoryAccounts[0].grossProfit;
						}
						else {
							companyData['grossProfit_latest'] = '-';
						}
					} else {
						companyData['grossProfit_latest'] = '-';
					}
					if (companyData.simplifiedAccounts[0].numberOfEmployees) {
						companyData['numberOfEmployees'] = parseInt(companyData.simplifiedAccounts[0].numberOfEmployees);
					}
					// else {
					//     companyData['numberOfEmployees'] = "-";
					// }
				}
				// else {
				//     companyData['numberOfEmployees'] = "-";
				// }

				if (searchedDirectorName) {
					if (companyData.directorsInformation) {
						let tempDirectorArray = [];
						for (let j = 0; j < companyData.directorsInformation.length; j++) {
							let count = 0;
							for (let strToFind of searchedDirectorName.split(' ')) {
								if (companyData.directorsInformation[j].detailedInformation && companyData.directorsInformation[j].detailedInformation.fullName.trim().includes(strToFind)) {
									count++;
								}
							}
							if (directorNameSearchCondition === 'and') {
								if (count == searchedDirectorName.split(' ').length) {
									tempDirectorArray.push(companyData.directorsInformation[j]);
								}
							} else {
								if (count > 0) {
									tempDirectorArray.push(companyData.directorsInformation[j]);
								}
							}
						}
						companyData['searcheddirectorsInformation'] = tempDirectorArray;
					}

				}

				if (thisPage === "landRegistry") {
					companyData['Address'] = this.titlecasePipe.transform((companyData["paon"] || '') + ' ' + (companyData["street"] || '') + ' ' + (companyData["locality"] || '') + ' ') + (companyData["postcode"] || '').toUpperCase();
				}
				if (thisPage === "landCorporate") {
					companyData['companyno_1'] = companyData['Company_Registration_No_1'];
					companyData['companyno_2'] = companyData['Company_Registration_No_2'];
					companyData['companyno_3'] = companyData['Company_Registration_No_3'];
					companyData['companyno_4'] = companyData['Company_Registration_No_4'];
				}
				if (thisPage === "companySearch") {
					if (companyData["businessName"] !== undefined && companyData["businessName"] !== null && companyData["businessName"] !== "") {
						tempCompaniesData.push(companyData)
					}
				} else {
					tempCompaniesData.push(companyData)
				}

			});

		}

		companiesData = [];
		return tempCompaniesData;
	}


	formatDate(date) {
		return this.commonService.formatDate(date);
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

	dateForFileName() {
		let Fulldate = new Date();
		let date = Fulldate.getDate();
		let month = Fulldate.getMonth() + 1;
		let yearStr = Fulldate.getFullYear().toString();
		let hour = Fulldate.getHours();
		let minute = Fulldate.getMinutes();
		let second = Fulldate.getSeconds();
		let dateStr = '';
		let monthStr = '';
		let hourStr = '';
		let minuteStr = '';
		let secondStr = '';
		if (date < 10) {
			dateStr = '0' + date;
		}
		else {
			dateStr = date.toString();
		}

		if (month < 10) {
			monthStr = '0' + month;
		}
		else {
			monthStr = month.toString();
		}

		if (hour < 10) {
			hourStr = '0' + hour;
		}
		else {
			hourStr = hour.toString();
		}
		if (minute < 10) {
			minuteStr = '0' + minute;
		}
		else {
			minuteStr = minute.toString();
		}
		if (second < 10) {
			secondStr = '0' + second;
		}
		else {
			secondStr = second.toString();
		}

		let finalStr = dateStr + monthStr + yearStr + '_' + hourStr + minuteStr + secondStr;

		return finalStr;
	}

	formatTableDataForChargesExport(data) {
		let tempArr = [...data]
		data = []
		for (let companyData of tempArr) {
			let tempMortgageArray = []
			if (companyData.mortgagesObj !== undefined && companyData.mortgagesObj !== null) {
				for (let charge of companyData.mortgagesObj) {
					let tempCharge = {};
					for (let key in charge) {
						if (key == "mortgageNumber") {
							// sortingArray.push(charge[key]);
							tempCharge["charge_number"] = charge[key];
						}
						else if (key == "createdDate") {
							if (charge[key] != null && charge[key] != undefined) {
								let createdDate = charge[key].split("/");
								tempCharge["created_on"] = charge[key];
							}
						}
						else if (key == "regDate") {
							if (charge[key] != null && charge[key] != undefined) {
								let regDate = charge[key].split("/");
								tempCharge["registered_on"] = charge[key];
							}
						}
						else if (key == "satisfiedDate") {
							if (charge[key] != null && charge[key] != undefined) {
								let satisfiedDate = charge[key].split("/");
								tempCharge["delivered_on"] = charge[key];
							}
						}
						else if (key == "memorandumNature") {
							if (["b", "f", "p", "r"].includes(charge[key])) {
								tempCharge["status"] = "Fully Satisfied";
								// satifiedCount++;
							}
							if (charge[key] == 's') {
								tempCharge["status"] = "Part Satisfied";
								// partialSatisfiedCount++;
							}
							if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(charge[key])) {
								tempCharge["status"] = "Outstanding";
								// outstandingCount++;
							}
						}
						else if (key == "mortgageDetails") {
							charge[key].forEach(details => {
								if (details.recordType == "persons entitled") {
									tempCharge["persons_entitled_raw"] = this.commonService.formatNameForPersonEntitled(details.description.split(";"));
									tempCharge["persons_entitled"] = this.commonService.formatNameForPersonEntitled(details.groupName.split(";"));
								}
								else if (details.recordType == "amount secured") {
									tempCharge["secured_details"] = details.description;
								}
								else if (details.recordType == "mortgage type") {
									tempCharge["classification"] = details.description;
								}
								else if (details.recordType == "mortgage detail") {
									tempCharge["particulars"] = details.description;
								}
							});

						}
						else {
							tempCharge[key] = charge[key]
						}
					}
					tempMortgageArray.push(tempCharge)

				}
			}
			companyData["mortgagesObj"] = tempMortgageArray
			data.push(companyData)

		}
		return data

	}

	formatDataForCSV( columns, data, thisPage ) {

		const actualVals = data;
		const actualCols = columns;

		let dataTemp = [];
		if (actualVals !== undefined) {
			for (let i = 0; i < actualVals.length; i++) {

				let tempRowData = {};
				
				for (let key in actualVals[i]) {

					for( let col of actualCols ) {
						if( col.field === "companyLinkUrl" ) {
							if( actualVals[i][key] != '' ) {
								if ( [ 'companyNumber', 'companyRegistrationNumber', 'CompanyNameOriginal', 'Company_Registration_No_1' ].includes( key )  ) {
									tempRowData[col.field] = `=HYPERLINK("https://app.datagardener.com/company-search?company=${ actualVals[i][key].toUpperCase() }")`;
								}
							}
						}
					}
					
					if (key === "sicCode07" || key === "sic_code") {
						let tempArray = this.commonService.getSICCodeInArrayFormat(actualVals[i][key]);
						let sicCodeString = '';
						for (let data of tempArray) {
							sicCodeString += data + "\n";
						}
						sicCodeString = sicCodeString.substring(0, sicCodeString.length - 1)
						tempRowData[key] = this.titlecasePipe.transform(sicCodeString);
					} else if (key === 'pscAddress') {
						tempRowData[key] = this.titlecasePipe.transform(this.formatPscAddress(actualVals[i].address));
					} else if (key === "share_holders_details") {
						let shareholderForename = this.titlecasePipe.transform(actualVals[i][key]['shareholderForename']);
						let shareholderSurname = this.titlecasePipe.transform(actualVals[i][key]['shareholderSurname']);
						if (shareholderForename !== null && shareholderSurname !== null) {
							tempRowData[key] = shareholderForename + " " + shareholderSurname;
						}
						else if (shareholderForename === null) {
							tempRowData[key] = shareholderSurname;
						}
						else if (shareholderSurname === null) {
							tempRowData[key] = shareholderForename;
						}
					} else if (key == "currency" || key == "companyName" || key == "businessName" || key == 'PostCode' || key == 'Postcode') {
						tempRowData[key] = actualVals[i][key].toUpperCase();
					} 
					 else if (key === 'Mortgages') {
						tempRowData['NumMortCharges'] = actualVals[i].Mortgages[0].NumMortCharges;
						tempRowData['NumMortOutstanding'] = actualVals[i].Mortgages[0].NumMortOutstanding;
						tempRowData['NumMortPartSatisfied'] = actualVals[i].Mortgages[0].NumMortPartSatisfied;
						tempRowData['NumMortSatisfied'] = actualVals[i].Mortgages[0].NumMortSatisfied;
					} else if (key == 'RegAddress') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i].RegAddress);
					} else if (key == 'serviceAddress') {
						if ( thisPage == 'related_Directors' ) {
							tempRowData['address2'] = this.titlecasePipe.transform(this.formatDirectorAddress(actualVals[i]['serviceAddress']));
						}
					} else if (key == 'detailedInformation') {
						if ( thisPage == 'related_Directors' ) {
							tempRowData['directorName'] = this.titlecasePipe.transform(actualVals[i]['detailedInformation']['fullName']);

							if (!(actualVals[i].hasOwnProperty('resignedOn'))) {
								tempRowData['resignedStatus'] = 'Active';
							}
							tempRowData['address1'] = this.titlecasePipe.transform(this.formatDirectorAddress(actualVals[i]['detailedInformation']));

						}
					} else if (key == 'directorName') {

						if ( thisPage == 'related_Directors' ) {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i]['detailedInformation']['fullName']);
						} else {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]);
						}
						if (!(actualVals[i].hasOwnProperty('resignedOn'))) {
							tempRowData['resignedStatus'] = 'Active';
						}
					} else if (key == 'resignedOn') {
						tempRowData[key] = actualVals[i][key];
						tempRowData['resignedStatus'] = 'Resigned';
					} else if ((key == 'address') && !(actualVals[i].hasOwnProperty('pscAddress'))) {
						if ((actualVals[i].hasOwnProperty('companyNumber')) && (!(actualVals[i].hasOwnProperty('directorName')))) {
							tempRowData[key] = this.titlecasePipe.transform(this.formatCompanyAddress(actualVals[i][key]));
						} else {
							tempRowData[key] = this.titlecasePipe.transform(this.formatDirectorAddress(actualVals[i][key]));
						}
					} else if (key == 'IncorporationDate') {
						tempRowData[key] = actualVals[i].IncorporationDate;
						tempRowData['companyAge'] = this.calculateCompanyAge(actualVals[i].companyRegistrationDate);
					} else if (key == 'persons_entitled') {
						let tempPersonEntitledString: string = '';
						for (let data of actualVals[i]['persons_entitled']) {
							tempPersonEntitledString += data['name'] + "\n";
						}
						tempRowData['persons_entitled'] = this.titlecasePipe.transform(tempPersonEntitledString);
					} else if (key == "particulars" || key == "secured_details" || key == "classification") {
						tempRowData[key] = actualVals[i][key]['description'];
					} else if (key == "dName" || key == "pscName") {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]['name']);
					} else if (key == "date_of_birth") {
						tempRowData[key] = Month[actualVals[i][key]["month"]] + "," + actualVals[i][key]["year"];
					} else if (key == 'internationalScoreDescription') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]); 
					} else {
						if (typeof (actualVals[i][key]) === "string") {
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
        return dataTemp
	}

	formatPscAddress(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			return this.commonService.formatPscAddress(address);
		}
	}

	formatDirectorAddress(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			return this.commonService.formatDirectorAddress(address);
		}
	}

	formatCompanyAddress(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			return this.commonService.formatCompanyAddress(address);
		}
	}

	calculateCompanyAge(dob) {
		return this.commonService.calculateAge(dob);
	}

	formateChargesStatusData( key ) {

		let chargeStatus = '';

		if ( [ "b", "f", "p", "r" ].includes( key ) ) {
			chargeStatus = "Fully Satisfied";
		}

		if ( key == 's' ) {
			chargeStatus = "Part Satisfied";
		}

		if ( [ "t", "u", "v", "w", "x", "y", "z", null, "" ].includes( key ) ) {
			chargeStatus = "Outstanding";
		}

		return chargeStatus;

	}

	fetchByStringKey = function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	}

	formatMortgagesObj(mortgagesObj) {
		let tempArr = [];
		let sortingArray = [];
		let outstandingCount = 0;
		let partialSatisfiedCount = 0;
		let satifiedCount = 0;
		mortgagesObj.forEach(charge => {
			let tempCharge = {};
			for (let key in charge) {
				if (key == "chargeCode") {
					sortingArray.push(charge[key]);
					tempCharge["charge_number"] = charge[key];
				}
				else if (key == "createdDate") {
					if (charge[key] != null && charge[key] != undefined) {
						tempCharge["created_on"] = charge[key];
					}
				}
				else if (key == "satisfiedDate") {
					if (charge[key] != null && charge[key] != undefined) {
						// let satisfiedDate = charge[key].split("/");
						tempCharge["delivered_on"] = charge[key];
					}
				}
				else if (key == "memorandumNature") {
					if (["b", "f", "p", "r"].includes(charge[key])) {
						tempCharge["status"] = "Fully Satisfied";
						satifiedCount++;
					}
					if (charge[key] == 's') {
						tempCharge["status"] = "Part Satisfied";
						partialSatisfiedCount++;
					}
					if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(charge[key])) {
						tempCharge["status"] = "Outstanding";
						outstandingCount++;
					}
				}
				else if (key == "mortgageDetails") {
					charge[key].forEach((details) => {
						if (details.recordType == "persons entitled") {
							tempCharge["persons_entitled"] = this.formatNameForPersonEntitled(details.description.split(";"));
						}
						if (details.recordType == "amount secured") {
							tempCharge["secured_details"] = details.description.replace(/[!@#$%^&*()�,.?";:{}|<>]/g, " ");
						}
						if (details.recordType == "mortgage type") {
							tempCharge["classification"] = details.description;
						}
						if (details.recordType == "mortgage detail") {
							tempCharge["particulars"] = details.description.replace(/[!@#$%^&*()�?";:{}|<>]/g, " ");
						}
					});
	
				}
				else {
					tempCharge[key] = charge[key]
				}
			}
			tempArr.push(tempCharge);
		});
		tempArr = this.sortCharges(tempArr)
		mortgagesObj = JSON.parse(JSON.stringify(tempArr));
		return mortgagesObj;
	}
	
	formatNameForPersonEntitled(nameArray) {
		let tempNameArray = []
		nameArray.forEach(person_entitled => {
			if (person_entitled.includes(".")) {
				let tempArray = person_entitled.split(".");
				person_entitled = "";
				tempArray.forEach(name => {
					name = this.titlecasePipe.transform(name);
					person_entitled = person_entitled + name + ".";
				});
				person_entitled = person_entitled.substring(0, (person_entitled.length - 1));
				tempNameArray.push(person_entitled);
			}
			else {
				if (person_entitled !== "") {
					tempNameArray.push(this.titlecasePipe.transform(person_entitled));
				}
			}

		});
		return tempNameArray;
	}
	formatPersonEntitled(appliedFilters, personEntitledArray) {
		let appliedPersonEntitled = [];
		if (appliedFilters) {
			for (let filter of appliedFilters) {
				if (filter.chip_group === 'Charges Person Entitled') {
					appliedPersonEntitled = filter.chip_values;
					break
				}
			};
		}
		let newPersonEntitledArray = []
		if (appliedPersonEntitled.length > 0) {
			appliedPersonEntitled.forEach((e) => {
				personEntitledArray.forEach((pe) => {
					if (pe.toLowerCase() == e.replace(";", "").toLowerCase()) {
						newPersonEntitledArray.push(pe)
					}
				})
			});
			personEntitledArray = newPersonEntitledArray
		}
		return (personEntitledArray.join(",").replace(",", " , "));
	}

	sortCharges(tempArr) {
		var len = tempArr.length,
			min;
		for (let i = 0; i < len; i++) {
			min = i;
			for (let j = i + 1; j < len; j++) {
				if (tempArr[j]["charge_number"] < tempArr[min]["charge_number"]) {
					min = j;
				}
			}
	
			if (i != min) {
				this.swap(tempArr, i, min);
			}
		}
		return (tempArr.reverse())
	}

	swap(items, firstIndex, secondIndex) {
		var temp = items[firstIndex];
		items[firstIndex] = items[secondIndex];
		items[secondIndex] = temp;
	}

	formatCompanyInfoDataForExportFile( companyInfoExportData, columns ) {

		let dataToExportForCompanyInfo = [];

		for ( let i = 0; i < companyInfoExportData.length; i++ ) {

			let sicCodes = '';
			let numOfEmployees;

			if ( companyInfoExportData[i].statutoryAccounts ) {
				numOfEmployees = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].numberOfEmployees;
			}

			if ( companyInfoExportData[i].sicCode07.SicNumber_1 ) {
				sicCodes = sicCodes + companyInfoExportData[i].sicCode07.SicNumber_1 + '-' + companyInfoExportData[i].sicCode07.SicText_1;
			}
			if ( companyInfoExportData[i].sicCode07.SicNumber_2 ) {
				sicCodes = sicCodes + ', ' + companyInfoExportData[i].sicCode07.SicNumber_2 + '-' + companyInfoExportData[i].sicCode07.SicText_2;
			}
			if ( companyInfoExportData[i].sicCode07.SicNumber_3 ) {
				sicCodes = sicCodes + ', ' + companyInfoExportData[i].sicCode07.SicNumber_3 + '-' + companyInfoExportData[i].sicCode07.SicText_3;
			}
			if ( companyInfoExportData[i].sicCode07.SicNumber_4 ) {
				sicCodes = sicCodes + ', ' + companyInfoExportData[i].sicCode07.SicNumber_4 + '-' + companyInfoExportData[i].sicCode07.SicText_4;
			}

			let data = {
				'Company Name': this.titlecasePipe.transform(companyInfoExportData[i].businessName),
				'Number': companyInfoExportData[i].companyRegistrationNumber,
				'Incorporation Date': companyInfoExportData[i].companyRegistrationDate,
				'SIC Codes': sicCodes,
				'Industry': this.titlecasePipe.transform(companyInfoExportData[i].industryTag),
				'Status': this.titlecasePipe.transform(companyInfoExportData[i].companyStatus),
				'Address': companyInfoExportData[i].RegAddress,
				'Business URL': "https://app.datagardener.com/company-search?company=" + companyInfoExportData[i].companyRegistrationNumber.toLowerCase()
			};

			for ( let selectedColumn of columns ) {

				for ( let key in selectedColumn ) {

					for ( let value of selectedColumn[ key ] ) {

						if ( value.key == 'region' ) {

							data[ 'Region' ] = this.titlecasePipe.transform(companyInfoExportData[i].RegAddress_Modified.region);

						} else if ( value.key == 'ward' ) {

							data[ 'Ward' ] = this.titlecasePipe.transform(companyInfoExportData[i].RegAddress_Modified.ward);

						}  else if ( value.key == 'constituency' ) {

							data[ 'Constituency' ] = this.titlecasePipe.transform(companyInfoExportData[i].RegAddress_Modified.constituency);

						} else if ( ['riskBand', 'internationalScoreDescription'].includes( value.key ) ) {	

							data[ 'Risk Band' ] = this.titlecasePipe.transform(companyInfoExportData[i].internationalScoreDescription);

						} else if ( value.key == 'districtCode' ) {

							if ( companyInfoExportData[i].RegAddress_Modified.postcode_district ) {
								data[ 'District Code' ] = companyInfoExportData[i].RegAddress_Modified.postcode_district.toUpperCase();
							} else {
								data[ 'District Code' ] = "";
							}

						} else if (  value.key == 'website' ) {
							if ( companyInfoExportData[i].companyContactInformation && companyInfoExportData[i].companyContactInformation.website && companyInfoExportData[i].companyContactInformation.website != "" ) {
		
								data[ 'Website' ] = companyInfoExportData[i].companyContactInformation.website;
		
							} else if ( companyInfoExportData[i].RegAddress_Modified && companyInfoExportData[i].RegAddress_Modified.website && companyInfoExportData[i].RegAddress_Modified.website != "" ) {
		
								data[ 'Website' ] = companyInfoExportData[i].RegAddress_Modified.website;
		
							} else if ( companyInfoExportData[i].companyContactDetails && companyInfoExportData[i].companyContactDetails.website && companyInfoExportData[i].companyContactDetails.website != "" ) {
		
								data[ 'Website' ] = companyInfoExportData[i].companyContactDetails.website;
		
							} else {
								data[ 'Website' ] = "";
							}
						} else if (  value.key == 'phone' ) {
							if ( companyInfoExportData[i].companyContactInformation && companyInfoExportData[i].companyContactInformation.tel_1 && companyInfoExportData[i].companyContactInformation.tel_1 != "" ) {
		
								data[ 'Phone' ] = companyInfoExportData[i].companyContactInformation.tel_1;
		
							} else if ( companyInfoExportData[i].RegAddress_Modified && companyInfoExportData[i].RegAddress_Modified.telephone && companyInfoExportData[i].RegAddress_Modified.telephone != "" ) {
		
								data[ 'Phone' ] = companyInfoExportData[i].RegAddress_Modified.telephone;
		
							} else if ( companyInfoExportData[i].companyContactDetails && companyInfoExportData[i].companyContactDetails.tel_1 && companyInfoExportData[i].companyContactDetails.tel_1 != "" ) {
		
								data[ 'Phone' ] = companyInfoExportData[i].companyContactDetails.tel_1;
		
							} else {
								data[ 'Phone' ] = "";
							}
						} else if (  value.key == 'ctpsRegistered' ) {
		
							let tempTelephone = companyInfoExportData[i].companyContactInformation && companyInfoExportData[i].companyContactInformation.tel_1 ? companyInfoExportData[i].companyContactInformation.tel_1 : companyInfoExportData[i].RegAddress_Modified && companyInfoExportData[i].RegAddress_Modified.telephone ? companyInfoExportData[i].RegAddress_Modified.telephone :
								companyInfoExportData[i].companyContactDetails && companyInfoExportData[i].companyContactDetails.tel_1 ? companyInfoExportData[i].companyContactDetails.tel_1 : "";
		
							if ( tempTelephone !== "" && companyInfoExportData[i].companyContactDetails && companyInfoExportData[i].companyContactDetails.ctps ) {
								if (companyInfoExportData[i].companyContactDetails.ctps == 'y') {
									data[ 'CTPS Registered' ] = 'Yes';
								} else if (companyInfoExportData[i].companyContactDetails.ctps == 'n') {
									data[ 'CTPS Registered' ] = 'No';
								}
							} else if ( tempTelephone !== "" && companyInfoExportData[i].RegAddress_Modified && companyInfoExportData[i].RegAddress_Modified.ctps ) {
								if (companyInfoExportData[i].RegAddress_Modified.ctps == 'y') {
									data[ 'CTPS Registered' ] = 'Yes';
								} else if (companyInfoExportData[i].RegAddress_Modified.ctps == 'n') {
									data[ 'CTPS Registered' ] = 'No';
								}
							} else if ( tempTelephone !== "" && companyInfoExportData[i].companyContactInformation && companyInfoExportData[i].companyContactInformation.ctps ) {
								if (companyInfoExportData[i].companyContactInformation.ctps == 'y') {
									data[ 'CTPS Registered' ] = 'Yes';
								} else if (companyInfoExportData[i].companyContactInformation.ctps == 'n') {
									data[ 'CTPS Registered' ] = 'No';
								}
							} else {
								data[ 'CTPS Registered' ] = '';
							}
						} else if ( value.key == 'ccjCount' ) {
		
							if ( companyInfoExportData[i].ccjDetails ) {
								data[ 'CCJ Count' ] = companyInfoExportData[i].ccjDetails.length;
							} else {
								data[ 'CCJ Count' ] = '';
							}
						} else if ( value.key == 'mortgagesChargesCount' ) {
							data[ 'Mortgages Charge' ] = companyInfoExportData[i].chargesCount ? companyInfoExportData[i].chargesCount : '';
						} else if ( value.key == 'noOfEmployees' ) {
							data[ 'No. of Employees' ] = numOfEmployees;
		
						} else if ( value.key == 'financialDatalatestYear' && companyInfoExportData[i].statutoryAccounts ) {
							
							data['Turnover'] = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].turnover ?  this.toCurrencyPipe.transform(companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].turnover, '', '', '1.0-0') : '';
							data['Estimated Turnover'] = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].estimated_turnover ? this.toCurrencyPipe.transform(companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].estimated_turnover, '', '', '1.0-0') : '';
							data['Total Assets'] = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].totalAssets ?  this.toCurrencyPipe.transform(companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].totalAssets, '', ' ', '1.0-0') : '';
							data['Total Liabilities'] = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].totalLiabilities ? this.toCurrencyPipe.transform(companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].totalLiabilities, '', ' ', '1.0-0') : '';
							data['Net Worth'] = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].netWorth ? this.toCurrencyPipe.transform(companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].netWorth, '', ' ', '1.0-0') : '';
							if (companyInfoExportData[i].statutoryAccounts) {
								data['Gross Profit'] = companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].grossProfit ? this.toCurrencyPipe.transform(companyInfoExportData[i].statutoryAccounts[companyInfoExportData[i].statutoryAccounts.length - 1].grossProfit, '', ' ', '1.0-0') : '';
							}
							else {
								data['Gross Profit'] = '-';
							}
						}

					}

				}

			}
				
			dataToExportForCompanyInfo.push(data);

		}

		return dataToExportForCompanyInfo;

	}

	formatDiretorInfoForExportFile( directorInforExportData, columns, appliedFiltersDirectorsChipValuesArray ) {

		let dataToExportForDirectorInfo = [];

		for (let i = 0; i < directorInforExportData.length; i++) {

			if ( directorInforExportData[i].directorsInformation ) {

				for (let k = 0; k < directorInforExportData[i].directorsInformation.length; k++) {

					if ( appliedFiltersDirectorsChipValuesArray.length > 0 && appliedFiltersDirectorsChipValuesArray.includes( directorInforExportData[i].directorsInformation[k].directorJobRole ) ) {
						
						if  ( !directorInforExportData[i].directorsInformation[k].toDate ) {

							let data = {};

							for ( let selectedColumn of columns ) {

								for ( let key in selectedColumn ) {
				
									for ( let value of selectedColumn[ key ] ) {

										if ( value.key == 'directorsName' ) {
								
											if ( directorInforExportData[i].directorsInformation[k].FNAME && directorInforExportData[i].directorsInformation[k].FNAME != "" ) {
			
												data['First Name'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].FNAME);
											} else {
			
												data['First Name'] = "";
			
											}
											if ( directorInforExportData[i].directorsInformation[k].MNAME && directorInforExportData[i].directorsInformation[k].MNAME != "" ) {
			
												data['Middle Name'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].MNAME);
			
											} else {
			
												data['Middle Name'] = "";
			
											}
			
											if ( directorInforExportData[i].directorsInformation[k].FNAME && directorInforExportData[i].directorsInformation[k].FNAME != "" && directorInforExportData[i].directorsInformation[k].SNAME && directorInforExportData[i].directorsInformation[k].SNAME != "" ) {
			
												data['Last Name'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].SNAME);
			
											} else if ( ( !directorInforExportData[i].directorsInformation[k].FNAME || directorInforExportData[i].directorsInformation[k].FNAME == "" ) && directorInforExportData[i].directorsInformation[k].SNAME && directorInforExportData[i].directorsInformation[k].SNAME != "" ) {
			
												data['Last Name'] = "";
			
											} else {
			
												data['Last Name'] = "";
											}
			
											data['Company Name'] = this.titlecasePipe.transform(directorInforExportData[i].businessName),
			
											data['Number'] = directorInforExportData[i].companyRegistrationNumber
			
											if ( directorInforExportData[i].RegAddress_Modified.website ) {
			
												data['Website'] = directorInforExportData[i].RegAddress_Modified.website;
			
											}
											else {
												data['Website'] = "";
											}
										} 
										else if ( value.key == 'role' ) {
			
											data['Role'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ROLE);
			
										} else if ( value.key == 'occupation' ) {
			
											data['Occupation'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ROLE);
			
										} else if ( value.key == 'nationality' ) {
			
											data['Nationality'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].NLTY);
			
										} else if ( value.key == 'address' ) {
			
											let address = '';
			
											if ( directorInforExportData[i].directorsInformation[k].ADD1 ) {
			
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD1) + ", ";
			
											}
			
											if ( directorInforExportData[i].directorsInformation[k].ADD2 ) {
			
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD2) + ", ";
			
											}
			
											if ( directorInforExportData[i].directorsInformation[k].ADD3 ) {
			
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD3) + ", ";
			
											}
			
											if ( directorInforExportData[i].directorsInformation[k].ADD4 ) {
			
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD4) + ", ";
			
											}
			
											if ( directorInforExportData[i].directorsInformation[k].ADD5 ) {
			
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD5) + ", ";
			
											}
			
											if ( directorInforExportData[i].directorsInformation[k].PCODE ) {
			
												address = address + directorInforExportData[i].directorsInformation[k].PCODE.toUpperCase();
			
											}
			
											data['Address'] = address;
			
										} else if ( value.key == 'birth' ) {
			
											data['Date of Birth'] = directorInforExportData[i].directorsInformation[k].BDATE;
			
										} else if ( value.key == 'appointedOn' ) {
			
											data['Appointed on'] = directorInforExportData[i].directorsInformation[k].FDATE;
			
										}

									}

								}
									
							}
								
							dataToExportForDirectorInfo.push( data );
							
						}

					} else {

						if (!directorInforExportData[i].directorsInformation[k].toDate) {

							let data = {};

							for ( let selectedColumn of columns ) {

								for ( let key in selectedColumn ) {
				
									for ( let value of selectedColumn[ key ] ) {
	
										if ( value.key == 'directorsName' ) {
											
											if ( directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].FNAME && directorInforExportData[i].directorsInformation[k].FNAME != "" ) {
												data['First Name'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].FNAME);
											} 
											else {
												data['First Name'] = "";
											}

											if ( directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].MNAME && directorInforExportData[i].directorsInformation[k].MNAME != "" ) {
												data['Middle Name'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].MNAME);
											} else {
												data['Middle Name'] = "";
											}

											if ( directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].FNAME && directorInforExportData[i].directorsInformation[k].FNAME != "" && directorInforExportData[i].directorsInformation[k].SNAME && directorInforExportData[i].directorsInformation[k].SNAME != "" ) {

												data['Last Name'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].SNAME);

											} else if ( directorInforExportData[i].directorsInformation[k] && ( !directorInforExportData[i].directorsInformation[k].FNAME || directorInforExportData[i].directorsInformation[k].FNAME == "" ) && directorInforExportData[i].directorsInformation[k].SNAME && directorInforExportData[i].directorsInformation[k].SNAME != "" ) {

												data['Last Name'] = "";

											} else {
												data['Last Name'] = "";
											}

											data['Company Name'] = this.titlecasePipe.transform(directorInforExportData[i].businessName);

											data['Number'] = directorInforExportData[i].companyRegistrationNumber

											if (directorInforExportData[i].RegAddress_Modified.website) {
												data['Website'] = directorInforExportData[i].RegAddress_Modified.website;
											}
											else {
												data['Website'] = "";
											}

										} else if ( value.key == 'role' ) {
											data['Role'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ROLE);
										} else if (value.key == 'occupation') {
											data['Occupation'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ROLE);
										} else if (value.key == 'nationality') {

											if ( directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].NLTY) {
												data['Nationality'] = this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].NLTY);
											} else {
												data['Nationality'] = "";
											}

										} else if (value.key == 'address') {

											let address = '';

											if (directorInforExportData[i].directorsInformation[k].detailedInformation && directorInforExportData[i].directorsInformation[k].ADD1) {
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD1) + ", ";
											}

											if (directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].ADD2) {
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD2) + ", ";
											}

											if (directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].ADD3) {
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD3) + ", ";
											}

											if (directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].ADD4) {
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD4) + ", ";
											}

											if (directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].ADD5) {
												address = address + this.titlecasePipe.transform(directorInforExportData[i].directorsInformation[k].ADD5) + ", ";
											}

											if (directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].PCODE) {
												address = address + directorInforExportData[i].directorsInformation[k].PCODE.toUpperCase();
											}

											data['Address'] = address;

										} else if (value.key == 'birth') {
											if ( directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].BDATE ) {

												data['Date of Birth'] = directorInforExportData[i].directorsInformation[k].BDATE;

											} else {
												data['Date of Birth'] = "";
											}

										} else if (value.key == 'appointedOn') {
											if (directorInforExportData[i].directorsInformation[k] && directorInforExportData[i].directorsInformation[k].FDATE ) {
												data['Appointed on'] = directorInforExportData[i].directorsInformation[k].FDATE;
											} else {
												data['Appointed on'] = ""
											}
										} 


									}

								}
									
							}
								
							dataToExportForDirectorInfo.push( data );

						}

					}

				}

			}					

		}

		return dataToExportForDirectorInfo;

	}

	formatContactInfoForExportFile( contactInfoExportData, columns ) {

		let dataToExportForContactInfo = [];

		for (let i = 0; i < contactInfoExportData.length; i++) {
			let sicCodes = '';
			let numOfEmployees;
			
			if (contactInfoExportData[i].simplifiedAccounts) {
				numOfEmployees = contactInfoExportData[i].simplifiedAccounts[contactInfoExportData[i].simplifiedAccounts.length - 1].numberOfEmplyees;
			}

			if (contactInfoExportData[i].sicCode07.SicNumber_1) {
				sicCodes = sicCodes + contactInfoExportData[i].sicCode07.SicNumber_1 + '-' + contactInfoExportData[i].sicCode07.SicText_1;
			}
			if (contactInfoExportData[i].sicCode07.SicNumber_2) {
				sicCodes = sicCodes + ', ' + contactInfoExportData[i].sicCode07.SicNumber_2 + '-' + contactInfoExportData[i].sicCode07.SicText_2;
			}
			if (contactInfoExportData[i].sicCode07.SicNumber_3) {
				sicCodes = sicCodes + ', ' + contactInfoExportData[i].sicCode07.SicNumber_3 + '-' + contactInfoExportData[i].sicCode07.SicText_3;
			}
			if (contactInfoExportData[i].sicCode07.SicNumber_4) {
				sicCodes = sicCodes + ', ' + contactInfoExportData[i].sicCode07.SicNumber_4 + '-' + contactInfoExportData[i].sicCode07.SicText_4;
			}

			let data = {};

			if ( contactInfoExportData[i].contactInformation ) {

				for ( let k = 0; k < contactInfoExportData[i].contactInformation.length; k++ ) {

					const contactData = contactInfoExportData[i].contactInformation[k];

					if (!(columns.includes('contactDirectorsName')) && !(columns.includes('contactOccupation')) && !(columns.includes('contactRole'))) {

						data['Company Name'] = this.titlecasePipe.transform(contactInfoExportData[i].businessName),
						data['Number']= contactInfoExportData[i].companyRegistrationNumber;

						if (contactInfoExportData[i].companyContactInformation && columns.includes('contactCompanyEmail')) {

							if (contactData.RegAddress_Modified.email && contactData.RegAddress_Modified.email !== "0" && contactData.RegAddress_Modified.email !== " " && contactData.RegAddress_Modified.email !== "null") {
								data['Company Email'] = contactData.RegAddress_Modified.email;
							} else if (contactData.RegAddress_Modified.email_raw && contactData.RegAddress_Modified.email_raw !== "0" && contactData.RegAddress_Modified.email_raw !== " " && contactData.RegAddress_Modified.email_raw !== "null") {
								data['Company Email'] = contactData.RegAddress_Modified.email_raw;
							} else {
								data['Company Email'] = "";
							}

						}
						if (contactData.RegAddress_Modified && columns.includes('contactCompanyLinkedIn')) {
							data['Company LinkedIn'] = contactData.RegAddress_Modified.linkedin_url && contactData.RegAddress_Modified.linkedin_url !== "0" && contactData.RegAddress_Modified.linkedin_url !== " " && contactData.RegAddress_Modified.linkedin_url !== "null" ? contactData.RegAddress_Modified.linkedin_url : "";
						}
						if (contactData.RegAddress_Modified && columns.includes('contactWebsite')) {
							data['Company Website'] = contactData.RegAddress_Modified.website && contactData.RegAddress_Modified.website !== "null" ? contactData.RegAddress_Modified.website : "";
						}
						data['Incorporation Date']= contactInfoExportData[i].companyRegistrationDate,
						data['SIC Codes']= sicCodes,
						data['Status']= this.titlecasePipe.transform(contactInfoExportData[i].companyStatus),
						data['Address']= contactInfoExportData[i].RegAddress,
						data['Business URL']= "https://app.datagardener.com/company-search?company=" + contactInfoExportData[i].companyRegistrationNumber.toLowerCase()
						dataToExportForContactInfo.push(JSON.parse(JSON.stringify(data)));
		
					} else {
		
						if (contactData.person_contact_details) {
							let tempObj = JSON.parse(JSON.stringify(data));
							for (let person_contact_details_obj of contactData.person_contact_details) {
								if (columns.includes('contactDirectorsName')) {
									data['Name'] = person_contact_details_obj.full_name ? this.titlecasePipe.transform(person_contact_details_obj.full_name) : "" 
								}
								data['Company Name'] = this.titlecasePipe.transform(contactInfoExportData[i].businessName),
								data['Number']= contactInfoExportData[i].companyRegistrationNumber;
								if (columns.includes('contactPersonEmail')) {
									data['Email'] = person_contact_details_obj.email ? person_contact_details_obj.email.toLowerCase() : ""
								}
								if (columns.includes('contactPersonLinkedIn')) {
									data['Linkedin'] = person_contact_details_obj.linkedin_url ? person_contact_details_obj.linkedin_url.toLowerCase() : ""
								}
								if (person_contact_details_obj && columns.includes('contactCompanyEmail')) {
									if (person_contact_details_obj.email && person_contact_details_obj.email !== "0" && person_contact_details_obj.email !== " " && person_contact_details_obj.email !== "null") {
										data['Company Email'] = person_contact_details_obj.email;
									} else if (person_contact_details_obj.email_raw && person_contact_details_obj.email_raw !== "0" && person_contact_details_obj.email_raw !== " " && person_contact_details_obj.email_raw !== "null") {
										data['Company Email'] = person_contact_details_obj.email_raw;
									} else {
										data['Company Email'] = "";
									}
								}
								if (person_contact_details_obj && columns.includes('contactCompanyLinkedIn')) {
									data['Company LinkedIn'] = person_contact_details_obj.linkedin_url && person_contact_details_obj.linkedin_url !== "0" && person_contact_details_obj.linkedin_url !== " " && person_contact_details_obj.linkedin_url !== "null" ? person_contact_details_obj.linkedin_url : "";
								}
								if (person_contact_details_obj && columns.includes('contactWebsite')) {
									data['Company Website'] = person_contact_details_obj.website && person_contact_details_obj.website !== "null" ? person_contact_details_obj.website : "";
								}
								if (columns.includes('contactOccupation')) {
									data['Occupation'] = person_contact_details_obj.job_title ? this.titlecasePipe.transform(person_contact_details_obj.job_title) : ""
		
								}
								data['Incorporation Date']= contactInfoExportData[i].companyRegistrationDate,
								data['SIC Codes']= sicCodes,
								data['Status']= this.titlecasePipe.transform(contactInfoExportData[i].companyStatus),
								data['Address']= contactInfoExportData[i].RegAddress,
								data['Business URL']= "https://app.datagardener.com/company-search?company=" + contactInfoExportData[i].companyRegistrationNumber.toLowerCase()
								if (columns.includes('contactRole')) {
									let additonalInfo = [];
									person_contact_details_obj['isPsc'] ? additonalInfo.push("PSC") : "";
									person_contact_details_obj['isDirector'] ? additonalInfo.push("Director") : "";
									person_contact_details_obj['isShareholder'] ? additonalInfo.push("Shareholder") : "";
									person_contact_details_obj['isHighestShareholder'] ? additonalInfo.push("Highest Shareholder") : "";
									person_contact_details_obj['isSecondHighestShareholder'] ? additonalInfo.push("Second Highest Shareholder") : "";
									data['Addtional Information'] = additonalInfo.join(", ");									
								}
								dataToExportForContactInfo.push(JSON.parse(JSON.stringify(data)));
								data = JSON.parse(JSON.stringify(tempObj))
							}
		
						}
		
					}

				}

			}
			
		}

		return dataToExportForContactInfo;

	}

	formatPSCInfoForExportFile( pscInformtionData, columns ) {

		let dataToExportForPscInfo = [];

		for (let i = 0; i < pscInformtionData.length; i++) {

			if (pscInformtionData[i].pscInformation) {

				for (let k = 0; k < pscInformtionData[i].pscInformation.length; k++) {

					const pscData = pscInformtionData[i].pscInformation[k];

					if ( pscData.pscName && pscData.pscName != "" ) {

						let data = {};

						for ( let selectedColumn of columns ) {

							for ( let key in selectedColumn ) {
			
								for ( let value of selectedColumn[ key ] ) {

									if ( value.key == 'pscName' && pscData.pscName && pscData.pscName != "" ) {

										if (pscData.controlType != "corporate-entity-person-with-significant-control") {

											if (pscData.title && pscData.title != "") {

												let tempName = pscData.pscName.split(' ');

												let tempMiddleName = "";

												if ( tempName.length == 3 ) {

													data['First Name'] = this.titlecasePipe.transform(tempName[1].trim());
													data['Middle Name'] = "";
													data['Last Name'] = this.titlecasePipe.transform(tempName[2].trim());
													data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
													data['Number'] = pscInformtionData[i].companyRegistrationNumber;
													data['Title'] = this.titlecasePipe.transform(tempName[0].trim());
													data['Corporate PSC Name'] = "";
													if (pscInformtionData[i].RegAddress_Modified.website) {
														data['Website'] = pscInformtionData[i].RegAddress_Modified.website;
													}
													else {
														data['Website'] = "";
													}

												} else if ( tempName.length == 4 ) {

													data['First Name'] = this.titlecasePipe.transform(tempName[1].trim());
													data['Middle Name'] = this.titlecasePipe.transform(tempName[2].trim());
													data['Last Name'] = this.titlecasePipe.transform(tempName[3].trim());
													data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
													data['Number'] = pscInformtionData[i].companyRegistrationNumber;
													data['Title'] = this.titlecasePipe.transform(tempName[0].trim());
													data['Corporate PSC Name'] = "";

												} else if ( tempName.length > 4 ) {

													data['First Name'] = this.titlecasePipe.transform(tempName[1].trim());

													for (let m = 2; m < tempName.length - 1; m++) {
														tempMiddleName = tempMiddleName + tempName[m] + " ";
													}

													data['Middle Name'] = this.titlecasePipe.transform(tempMiddleName.trim());
													data['Last Name'] = this.titlecasePipe.transform(tempName[tempName.length - 1].trim());
													data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
													data['Number'] = pscInformtionData[i].companyRegistrationNumber;
													data['Title'] = this.titlecasePipe.transform(tempName[0].trim());
													data['Corporate PSC Name'] = "";

												}
											} else {

												let tempName = pscData.pscName.split(' ');
												let tempMiddleName = "";

												if ( tempName.length == 2 ) {

													data['First Name'] = this.titlecasePipe.transform(tempName[0].trim());
													data['Middle Name'] = "";
													data['Last Name'] = this.titlecasePipe.transform(tempName[1].trim());
													data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
													data['Number'] = pscInformtionData[i].companyRegistrationNumber;
													data['Title'] = "";
													data['Corporate PSC Name'] = "";

												} else if ( tempName.length == 3 ) {

													data['First Name'] = this.titlecasePipe.transform(tempName[0].trim());
													data['Middle Name'] = this.titlecasePipe.transform(tempName[1].trim());
													data['Last Name'] = this.titlecasePipe.transform(tempName[2].trim());
													data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
													data['Number'] = pscInformtionData[i].companyRegistrationNumber;
													data['Title'] = "";
													data['Corporate PSC Name'] = "";

												} else if ( tempName.length > 3 ) {

													data['First Name'] = this.titlecasePipe.transform(tempName[0].trim());

													for (let m = 1; m < tempName.length - 1; m++) {
														tempMiddleName = tempMiddleName + tempName[m] + " ";
													}

													data['Middle Name'] = this.titlecasePipe.transform(tempMiddleName.trim());
													data['Last Name'] = this.titlecasePipe.transform(tempName[tempName.length - 1].trim());
													data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
													data['Number'] = pscInformtionData[i].companyRegistrationNumber;
													data['Title'] = "";
													data['Corporate PSC Name'] = "";

												}
											}
										} else if (pscData.controlType == "corporate-entity-person-with-significant-control") {

											data['First Name'] = "";
											data['Middle Name'] = "";
											data['Last Name'] = "";
											data['Company Name'] = this.titlecasePipe.transform(pscInformtionData[i].businessName),
											data['Number'] = pscInformtionData[i].companyRegistrationNumber;
											data['Title'] = "";
											data['Corporate PSC Name'] = this.titlecasePipe.transform(pscData.pscName.trim());
										}

									} else if ( value.key == 'natures_of_control' ) {

										data['Natures of Control'] = this.titlecasePipe.transform(pscData.natureOfControl);

									} else if ( value.key == 'kind' ) {

										data['Kind'] = this.titlecasePipe.transform(pscData.controlType);

									} else if ( value.key == 'birth' ) {

										data['Birth'] = pscData.dataOfBirth;

									} else if (value.key == 'address') {

										let address = '';

										if (pscData.premisesNumber) {
											address = address + this.titlecasePipe.transform(pscData.premisesNumber) + ", ";
										}

										if (pscData.addressLine1) {
											address = address + this.titlecasePipe.transform(pscData.addressLine1) + ", ";
										}

										if (pscData.addressLine2) {
											address = address + this.titlecasePipe.transform(pscData.addressLine2) + ", ";
										}

										if (pscData.locality) {
											address = address + this.titlecasePipe.transform(pscData.locality) + ", ";
										}

										if (pscData.region) {
											address = address + this.titlecasePipe.transform(pscData.region) + ", ";
										}

										if (pscData.postalCode) {
											address = address + pscData.postalCode.toUpperCase();
										}

										data['Address'] = address;

									} else if ( value.key == 'nationality' ) {

										data['Nationality'] = this.titlecasePipe.transform(pscData.nationality);

									} else if (value.key == 'pscCountry') {

										data['Country'] = this.titlecasePipe.transform(pscData.countryOfResidence);

									}

								}

							}

						}
							
						dataToExportForPscInfo.push(data);

					}

				}

			}

		}

		return dataToExportForPscInfo;

	}

	formatShareHoldersInfoDataForExportFile( exportData, columns ) {

		let dataToShareholderData = [];

		for (let i = 0; i < exportData.length; i++) {

			if (exportData[i].shareholderInformation && exportData[i].shareholderInformation.length) {

				for (let k = 0; k < exportData[i].shareholderInformation.length; k++) {

					const shareholder = exportData[i].shareholderInformation[k];

					let data = {};
					for ( let selectedColumn of columns ) {

						for ( let key in selectedColumn ) {
		
							if ( key == 'shareholderInformation' ) {
		
								for ( let value of selectedColumn[ key ] ) {
									
									if(value.key == 'name') {
										let midName = '';
										let tempName = '';
										
										if ( (shareholder.share_holders_details.shareholderForename && shareholder.share_holders_details.shareholderForename != "") || shareholder.share_holders_details.shareholderSurname && shareholder.share_holders_details.shareholderSurname != "" ) {

											tempName = shareholder.share_holders_details.shareholderForename.split(' ');

											for (let m = 1; m < tempName.length; m++) {
												midName = midName + tempName[m] + ' ';
											}

											if (shareholder.share_holders_details.shareholderForename && shareholder.share_holders_details.shareholderForename != "") {
												data['First Name'] = this.titlecasePipe.transform(tempName[0].trim());
											} else {
												data['First Name'] = "";
											}

											if (midName && midName != "") {
												data['Middle Name'] = this.titlecasePipe.transform(midName.trim());
											} else {
												data['Middle Name'] = "";
											}

											if (shareholder.share_holders_details.shareholderSurname && shareholder.share_holders_details.shareholderSurname != "") {
												data['Last Name'] = this.titlecasePipe.transform(shareholder.share_holders_details.shareholderSurname.trim());
											} else {
												data['Last Name'] = "";
											}
											

											data['Company Name'] = this.titlecasePipe.transform(exportData[i].businessName),
											data['Number'] = exportData[i].companyRegistrationNumber;
											
										}
										else {
											data['First Name'] = "";
											data['Middle Name'] = "";
											data['Last Name'] = "";
											
										}

									} else if (value.key == 'currency') {
										if (shareholder.currency) {
											data['Currency'] = shareholder.currency.toUpperCase();
										} else {
											data['Currency'] = "";
										}
									} else if (value.key == 'shareCount') {
										data['Share Count'] = shareholder.numberOfSharesIssued;
									} else if (value.key == 'shareType') {
										data['Share Type'] = this.titlecasePipe.transform(shareholder.shareType);
									} else if (value.key == 'nominalValue') {
										data['Nominal Value'] = shareholder.value;
									} else if (value.key == 'percentageOfTotal') {
										data['Percentage of Total Share'] = this.toCurrencyPipe.transform(shareholder.percentage_share, '', '', '1.0-0');
									}
								}

							}

						}

					}

					dataToShareholderData.push(data);

				}
			}
		}
		
		return dataToShareholderData;
	}

	formatTradingAddressDataForExportFile( exportData, columns ) {

		let tradingAddressData = [];

		for( let i = 0; i < exportData.length; i++ ) {
			
			if( exportData[i].tradingAddressInformation && exportData[i].tradingAddressInformation.length ) {
				
				for( let k = 0; k < exportData[i].tradingAddressInformation.length; k ++ ) {

					const tradingAddress = exportData[i].tradingAddressInformation[k];

					let data = {};

					for( let selectedColumn of columns ) {
						
						for( let key in selectedColumn ) {
							
							if( key == 'tradingAddressInformation' ) {

								for( let value of selectedColumn[key] ) {
									
									if ( value.key == 'address' ) {
										
										let address = '';

										if( tradingAddress.ADD1 ) {
											address = address + tradingAddress.ADD1 + ",";
										}
										if( tradingAddress.ADD2 ) {
											address = address + tradingAddress.ADD2 + ",";
										}
										if( tradingAddress.ADD3 ) {
											address = address + tradingAddress.ADD3 + ",";
										}
										if( tradingAddress.ADD4 ) {
											address = address + tradingAddress.ADD4 + ",";
										}
										
										data['Trading Address'] = address;
	
									} else if ( value.key == 'townOrCity' ) {
	
										if ( tradingAddress.district ) {
	
											data['Town or City'] = this.titlecasePipe.transform( tradingAddress.district );
	
										} else {
											
											data['Town or City'] = "";
	
										} 
	
									} else if ( value.key == 'county' ) {
	
										if ( tradingAddress.county ) {
	
											data['County'] = this.titlecasePipe.transform( tradingAddress.county );
	
										} else {
											
											data['County'] = "";
	
										} 
	
									} else if ( value.key == 'region' ) {
	
										if ( tradingAddress.county ) {
	
											data['Region'] = this.titlecasePipe.transform( tradingAddress.region );
	
										} else {
											
											data['Region'] = "";
	
										} 
	
									} else if ( value.key == 'secondaryName' ) {
	
										if ( tradingAddress.tradingAddress4 ) {
	
											data['Secondary Name'] = this.titlecasePipe.transform( tradingAddress.tradingAddress4 );
	
										} else {
											
											data['Secondary Name'] = "";
	
										} 
	
									} else if ( value.key == 'postCode' ) {
	
										if ( tradingAddress.postalCode ) {
	
											data['Post Code'] = tradingAddress.postalCode.toUpperCase();
	
										} else {
											
											data['Post Code'] = "";
	
										} 
	
									} else if ( value.key == 'telephoneNumber' ) {
	
										if ( tradingAddress.telephone ) {
	
											if( tradingAddress.tradingSTDCode ) {
	
												data["Telephone Number"] = tradingAddress.tradingSTDCode + ' ' + tradingAddress.telephone;
												
											} else {
	
												data["Telephone Number"] = tradingAddress.telephone;
	
											}
	
										} else {
											
											data['Telephone Number'] = "";
	
										} 
	
									} else if ( value.key == 'ctps' ) {         
	
										if ( tradingAddress.tradingCTPSFlag ) {
	
											if ( tradingAddress.tradingCTPSFlag == 'y' ) {
	
												data['CTPS Registered'] = "Yes";
	
											} else {
	
												data['CTPS Registered'] = "No";
	
											}
	
										} else {
											
											data['CTPS Registered'] = "";
	
										} 
	
									}

								}
							}
						}
					}
					tradingAddressData.push(data);
				}
			}
		}

		return tradingAddressData;
	}

	formatFinancialKeysInfoDataForExportFile( exportData, columns ) {

		let financialInformationData = [];

		for( let i = 0; i < exportData.length; i++ ) {

			if( exportData[i].financialInformation && exportData[i].financialInformation.length ) {

				for( let k = 0; k < exportData[i].financialInformation.length; k++ ) {

					const financial = exportData[i].financialInformation[k];

					let data = {};

					for( let selectedColumn of columns ) {
						for( let key in selectedColumn ) {
							if( key == 'financialInformation' ) {
								for( let value of selectedColumn[key] ) {
								
									if ( value.key == 'yearStartDate' ) {
	
										if ( financial.AC001 ) {
	
											data['Year Start Date'] = financial.AC001;
	
										} else {
											
											data['Year Start Date'] = "";
	
										}
	
									} else if ( value.key == 'yearEndDate' ) {
	
										if ( financial.AC002 ) {
	
											data['Year End Date'] = financial.AC002;
	
										} else {
											
											data['Year End Date'] = "";
	
										}
	
									} else if ( value.key == 'numberOfWeeks' ) {
	
										if ( financial.AC003 ) {
	
											data['Number of Weeks'] = financial.AC003;
	
										} else {
											
											data['Number of Weeks'] = "";
	
										}
	
									} else if ( value.key == 'numberOfMonths' ) {
	
										if ( financial.AC004 ) {
	
											data['Number of Months'] = financial.AC004;
	
										} else {
											
											data['Number of Months'] = "";
	
										}
	
									} else if ( value.key == 'currency' ) {
	
										if ( financial.AC005 ) {
	
											data['Currency'] = financial.AC005.toUpperCase();
	
										} else {
											
											data['Currency'] = "";
	
										}
	
									} else if ( value.key == 'consolidatedAccount' ) {
	
										if ( financial.AC006 ) {
	
											data['Consolidated Account'] = financial.AC006.toUpperCase();
	
										} else {
											
											data['Consolidated Account'] = "";
	
										}
	
									} else if ( value.key == 'turnover' ) {
	
										if ( financial.AC008 ) {
	
											data['Turnover'] = this.toCurrencyPipe.transform(financial.AC008, '', ' ', '1.0-0');
	
										} else {
											
											data['Turnover'] = "";
	
										}
	
									} else if ( value.key == 'export' ) {
	
										if ( financial.AC009 ) {
	
											data['Export'] = financial.AC009;
	
										} else {
											
											data['Export'] = "";
	
										}
	
									} else if ( value.key == 'costOfSales' ) {
	
										if ( financial.AC010 ) {
	
											data['Cost of Sales'] = this.toCurrencyPipe.transform(financial.AC010, '', ' ', '1.0-0');
	
										} else {
											
											data['Cost of Sales'] = "";
	
										}
	
									} else if ( value.key == 'grossProfit' ) {
	
										if ( financial.AC011 ) {
	
											data['Gross Profit'] = this.toCurrencyPipe.transform(financial.AC011, '', ' ', '1.0-0');
	
										} else {
											
											data['Gross Profit'] = "";
	
										}
	
									} else if ( value.key == 'wagesAndSalaries' ) {
	
										if ( financial.AC012 ) {
	
											data['Wages and Salaries'] =this.toCurrencyPipe.transform(financial.AC012, '', ' ', '1.0-0');
	
										} else {
											
											data['Wages and Salaries'] = "";
	
										}
	
									} else if ( value.key == 'directorsRemuneration' ) {
	
										if ( financial.AC013 ) {
	
											data['Directors Remuneration'] = financial.AC013;
	
										} else {
											
											data['Directors Remuneration'] = "";
	
										}
	
									} else if ( value.key == 'operatingProfit' ) {
	
										if ( financial.AC014 ) {
	
											data['Operating Profit'] = this.toCurrencyPipe.transform(financial.AC014, '', ' ', '1.0-0');
	
										} else {
											
											data['Operating Profit'] = "";
	
										}
	
									} else if ( value.key == 'depreciation' ) {
	
										if ( financial.AC015 ) {
	
											data['Depreciation'] = this.toCurrencyPipe.transform(financial.AC015, '', ' ', '1.0-0');
	
										} else {
											
											data['Depreciation'] = "";
	
										}
	
									} else if ( value.key == 'auditFees' ) {
	
										if ( financial.AC016 ) {
	
											data['Audit Fees'] = this.toCurrencyPipe.transform(financial.AC016, '', ' ', '1.0-0');
	
										} else {
											
											data['Audit Fees'] = "";
	
										}
	
									} else if ( value.key == 'interestExpense' ) {
	
										if ( financial.AC017 ) {
	
											data['Interest Expense'] = this.toCurrencyPipe.transform(financial.AC017, '', ' ', '1.0-0');
	
										} else {
											
											data['Interest Expense'] = "";
	
										}
	
									} else if ( value.key == 'profitBeforeTax' ) {
	
										if ( financial.AC018 ) {
	
											data['Profit Before Tax'] = this.toCurrencyPipe.transform(financial.AC018, '', ' ', '1.0-0');
	
										} else {
											
											data['Profit Before Tax'] = "";
	
										}
	
									} else if ( value.key == 'taxation' ) {
	
										if ( financial.AC019 ) {
	
											data['Taxation'] = this.toCurrencyPipe.transform(financial.AC019, '', ' ', '1.0-0');
	
										} else {
											
											data['Taxation'] = "";
	
										}
	
									} else if ( value.key == 'profitAfterTax' ) {
	
										if ( financial.AC020 ) {
	
											data['Profit After Tax'] = this.toCurrencyPipe.transform(financial.AC020, '', ' ', '1.0-0');
	
										} else {
											
											data['Profit After Tax'] = "";
	
										}
	
									} else if ( value.key == 'dividends' ) {
	
										if ( financial.AC021 ) {
	
											data['Dividends'] = financial.AC021;
	
										} else {
											
											data['Dividends'] = "";
	
										}
	
									} else if ( value.key == 'retainedProfit' ) {
	
										if ( financial.AC022 ) {
	
											data['Retained Profit'] = this.toCurrencyPipe.transform(financial.AC022, '', ' ', '1.0-0');
	
										} else {
											
											data['Retained Profit'] = "";
	
										}
	
									} else if ( value.key == 'tangibleAssets' ) {
	
										if ( financial.AC023 ) {
	
											data['Tangible Assets'] = financial.AC023;
	
										} else {
											
											data['Tangible Assets'] = "";
	
										}
	
									} else if ( value.key == 'intangibleAssets' ) {
	
										if ( financial.AC024 ) {
	
											data['Intangible Assets'] = this.toCurrencyPipe.transform(financial.AC024, '', ' ', '1.0-0');
	
										} else {
											
											data['Intangible Assets'] = "";
	
										}
	
									} else if ( value.key == 'totalFixedAssets' ) {
	
										if ( financial.AC025 ) {
	
											data['Total Fixed Assets'] = this.toCurrencyPipe.transform(financial.AC025, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Fixed Assets'] = "";
	
										}
	
									} else if ( value.key == 'totalCurrentAssets' ) {
	
										if ( financial.AC026 ) {
	
											data['Total Current Assets'] = this.toCurrencyPipe.transform(financial.AC026, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Current Assets'] = "";
	
										}
	
									} else if ( value.key == 'tradeDebtors' ) {
	
										if ( financial.AC027 ) {
	
											data['Trade Debtors'] = this.toCurrencyPipe.transform(financial.AC027, '', ' ', '1.0-0');
	
										} else {
											
											data['Trade Debtors'] = "";
	
										}
	
									} else if ( value.key == 'stock' ) {
	
										if ( financial.AC028 ) {
	
											data['Stock'] = this.toCurrencyPipe.transform(financial.AC028, '', ' ', '1.0-0');
	
										} else {
											
											data['Stock'] = "";
	
										}
	
									} else if ( value.key == 'cash' ) {
	
										if ( financial.AC029 ) {
	
											data['Cash'] = this.toCurrencyPipe.transform(financial.AC029, '', ' ', '1.0-0');
	
										} else {
											
											data['Cash'] = "";
	
										}
	
									} else if ( value.key == 'otherCurrentAssets' ) {
	
										if ( financial.AC030 ) {
	
											data['Other Current Assets'] = this.toCurrencyPipe.transform(financial.AC030, '', ' ', '1.0-0');
	
										} else {
											
											data['Other Current Assets'] = "";
	
										}
	
									} else if ( value.key == 'increaseInCash' ) {
	
										if ( financial.AC031 ) {
	
											data['Increase in Cash'] = this.toCurrencyPipe.transform(financial.AC031, '', ' ', '1.0-0');
	
										} else {
											
											data['Increase in Cash'] = "";
	
										}
	
									} else if ( value.key == 'miscCurrentAssets' ) {
	
										if ( financial.AC032 ) {
	
											data['Misc Current Assets'] = this.toCurrencyPipe.transform(financial.AC032, '', ' ', '1.0-0');
	
										} else {
											
											data['Misc Current Assets'] = "";
	
										}
	
									} else if ( value.key == 'totalAssets' ) {
	
										if ( financial.AC033 ) {
	
											data['Total Assets'] = this.toCurrencyPipe.transform(financial.AC033, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Assets'] = "";
	
										}
	
									} else if ( value.key == 'totalCurrentLiabilities' ) {
	
										if ( financial.AC034 ) {
	
											data['Total Current Liabilities'] = this.toCurrencyPipe.transform(financial.AC034, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Current Liabilities'] = "";
	
										}
	
									} else if ( value.key == 'tradeCreditors' ) {
	
										if ( financial.AC035 ) {
	
											data['Trade Creditors'] = this.toCurrencyPipe.transform(financial.AC035, '', ' ', '1.0-0');
	
										} else {
											
											data['Trade Creditors'] = "";
	
										}
	
									} else if ( value.key == 'bankBorrowingsCurrent' ) {
	
										if ( financial.AC036 ) {
	
											data['Bank Borrowings Current'] = this.toCurrencyPipe.transform(financial.AC036, '', ' ', '1.0-0');
	
										} else {
											
											data['Bank Borrowings Current'] = "";
	
										}
	
									} else if ( value.key == 'otherShortTermFinance' ) {
	
										if ( financial.AC037 ) {
	
											data['Other Short Term Finance'] = this.toCurrencyPipe.transform(financial.AC037, '', ' ', '1.0-0');
	
										} else {
											
											data['Other Short Term Finance'] = "";
	
										}
	
									} else if ( value.key == 'miscCurrentLiabilities' ) {
	
										if ( financial.AC038 ) {
	
											data['Misc Current Liabilities'] = this.toCurrencyPipe.transform(financial.AC038, '', ' ', '1.0-0');
	
										} else {
											
											data['Misc Current Liabilities'] = "";
	
										}
	
									} else if ( value.key == 'otherLongTermFinance' ) {
	
										if ( financial.AC039 ) {
	
											data['Other Long Term Finance'] = this.toCurrencyPipe.transform(financial.AC039, '', ' ', '1.0-0');
	
										} else {
											
											data['Other Long Term Finance'] = "";
	
										}
	
									} else if ( value.key == 'totalLongTermLiabilities' ) {
	
										if ( financial.AC040 ) {
	
											data['Total Long Term Liabilities'] = this.toCurrencyPipe.transform(financial.AC040, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Long Term Liabilities'] = "";
	
										}
	
									} else if ( value.key == 'bankOverdraftAndLTL' ) {
	
										if ( financial.AC041 ) {
	
											data['Bank Overdraft and LTL'] = this.toCurrencyPipe.transform(financial.AC041, '', ' ', '1.0-0') ;
	
										} else {
											
											data['Bank Overdraft and LTL'] = "";
	
										}
	
									} else if ( value.key == 'totalLiabilities' ) {
	
										if ( financial.AC042 ) {
	
											data['Total Liabilities'] = this.toCurrencyPipe.transform(financial.AC042, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Liabilities'] = "";
	
										}
	
									} else if ( value.key == 'netAssets' ) {
	
										if ( financial.AC043 ) {
	
											data['Net Assets'] = this.toCurrencyPipe.transform(financial.AC043, '', ' ', '1.0-0');
	
										} else {
											
											data['Net Assets'] = "";
	
										}
	
									} else if ( value.key == 'workingCapital' ) {
	
										if ( financial.AC044 ) {
	
											data['Working Capital'] = this.toCurrencyPipe.transform(financial.AC044, '', ' ', '1.0-0');
	
										} else {
											
											data['Working Capital'] = "";
	
										}
	
									} else if ( value.key == 'issuedShareCapital' ) {
	
										if ( financial.AC045 ) {
	
											data['Issued Share Capital'] = this.toCurrencyPipe.transform(financial.AC045, '', ' ', '1.0-0');
	
										} else {
											
											data['Issued Share Capital'] = "";
	
										}
	
									} else if ( value.key == 'revenueReserves' ) {
	
										if ( financial.AC046 ) {
	
											data['Revenue Reserves'] = this.toCurrencyPipe.transform(financial.AC046, '', ' ', '1.0-0');
	
										} else {
											
											data['Revenue Reserves'] = "";
	
										}
	
									} else if ( value.key == 'otherReserves' ) {
	
										if ( financial.AC047 ) {
	
											data['Other Reserves'] = this.toCurrencyPipe.transform(financial.AC047, '', ' ', '1.0-0');
	
										} else {
											
											data['Other Reserves'] = "";
	
										}
	
									} else if ( value.key == 'revaluationReserve' ) {
	
										if ( financial.AC048 ) {
	
											data['Revaluation Reserve'] = this.toCurrencyPipe.transform(financial.AC048, '', ' ', '1.0-0');
	
										} else {
											
											data['Revaluation Reserve'] = "";
	
										}
	
									} else if ( value.key == 'totalShareholdersEquity' ) {
	
										if ( financial.AC049 ) {
	
											data['Total Shareholders Equity'] = this.toCurrencyPipe.transform(financial.AC049, '', ' ', '1.0-0');
	
										} else {
											
											data['Total Shareholders Equity'] = "";
	
										}
	
									} else if ( value.key == 'netWorth' ) {
	
										if ( financial.AC050 ) {
	
											data['Net Worth'] = this.toCurrencyPipe.transform(financial.AC050, '', ' ', '1.0-0');
	
										} else {
											
											data['Net Worth'] = "";
	
										}
	
									} else if ( value.key == 'netCashFlowFromOperations' ) {
	
										if ( financial.AC051 ) {
	
											data['Net Cash Flow from Operations'] = this.toCurrencyPipe.transform(financial.AC051, '', ' ', '1.0-0');
	
										} else {
											
											data['Net Cash Flow from Operations'] = "";
	
										}
	
									} else if ( value.key == 'netCashFlowBeforeFinancing' ) {
	
										if ( financial.AC052 ) {
	
											data['Net Cash Flow Before Financing'] = this.toCurrencyPipe.transform(financial.AC052, '', ' ', '1.0-0');
	
										} else {
											
											data['Net Cash Flow Before Financing'] = "";
	
										}
	
									} else if ( value.key == 'netCashFlowFromFinancing' ) {
	
										if ( financial.AC053 ) {
	
											data['Net Cash Flow from Financing'] = this.toCurrencyPipe.transform(financial.AC053, '', ' ', '1.0-0');
	
										} else {
											
											data['Net Cash Flow from Financing'] = "";
	
										}
	
									} else if ( value.key == 'contingentLiabilities' ) {
	
										if ( financial.AC054 ) {
	
											data['Contingent Liabilities'] = this.toCurrencyPipe.transform(financial.AC054, '', ' ', '1.0-0');
	
										} else {
											
											data['Contingent Liabilities'] = "";
	
										}
	
									} else if ( value.key == 'capitalEmployed' ) {
	
										if ( financial.AC055 ) {
	
											data['Capital Employed'] = this.toCurrencyPipe.transform(financial.AC055, '', ' ', '1.0-0');
	
										} else {
											
											data['Capital Employed'] = "";
	
										}
	
									} else if ( value.key == 'numberOfEmployees' ) {
	
										if ( financial.AC056 ) {
	
											data['Number of Employees'] = financial.AC056;
	
										} else {
											
											data['Number of Employees'] = "";
	
										}
	
									} else if ( value.key == 'estimated_turnover' ) {
										if ( financial.estimated_turnover ) {
	
											data['Estimated Turnover'] = this.toCurrencyPipe.transform(financial.estimated_turnover, '', '', '1.0-0');
	
										} else {
											
											data['Estimated Turnover'] = "";
	
										}
	
									}
		
								}
							}
						}
					}

					financialInformationData.push(data);

				}
			}
		}
		return financialInformationData;
	}

	formatChargesDataExportFile( exportData, columns ) {

		let chargesData = [];
		let data = {};

		for (let i = 0; i < exportData.length; i++) {

			if (exportData[i].chargesInformation.length > 0) {
				if (exportData[i].chargesInformation && exportData[i].chargesInformation[0].mortgagesObj && exportData[i].chargesInformation[0].mortgagesObj.length > 0) {

					let mortgages = this.formatMortgagesObj(exportData[i].chargesInformation[0].mortgagesObj);

					for (let j = 0; j < mortgages.length; j++) {

						const charge = mortgages[j];

						for (let selectedColumn of columns) {
							for (let key in selectedColumn) {
								for (let value of selectedColumn[key]) {

									data["Company Name"] = exportData[i].businessName ? exportData[i].businessName.toUpperCase() : "";
									data["Company Number"] = exportData[i].companyRegistrationNumber ? exportData[i].companyRegistrationNumber.toUpperCase() : "";
									data["Business Url"] = "https://app.datagardener.com/company-search?company=" + exportData[i].companyRegistrationNumber.toLowerCase();
									if (value.key == 'personEntitled') {
										data["Person Entitled"] = charge["persons_entitled"] && charge["persons_entitled"].length > 0 ? this.formatPersonEntitled(undefined, charge["persons_entitled"]) : "";
									} else if (value.key == 'chargeCode') {
										data["Charge Code"] = charge.charge_number ? this.titlecasePipe.transform(charge.charge_number) : "";
									} else if (value.key == 'chargeClassification') {
										data["Charge Classification"] = charge.classification ? this.titlecasePipe.transform(charge.classification) : "";
									} else if (value.key == 'chargeStatus') {
										data["Charge Status"] = charge.status ? charge.status : "";
									} else if (value.key == 'chargeCreatedOn') {
										data["Charge Created On"] = charge.created_on ? charge.created_on : "";
									} else if (value.key == 'chargeDeliveredOn') {
										data["Charge Deliverd On"] = charge.delivered_on ? charge.delivered_on : "";
									} else if (value.key == 'registered_on') {
										data["Registered On"] = charge.regDate ? charge.regDate : "";
									}

								}
							}
						}

						chargesData.push(data);
					}
				}
			}

		}
		return chargesData;
	}
	
}


