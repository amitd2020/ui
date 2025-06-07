import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';

@Injectable({
	providedIn: 'root'
})
export class FormatDataExportUserListService {

	constructor(
		public commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private datePipe: DatePipe,
		private toCurrencyPipe: CurrencyPipe,
	) { }

	formatDataForCSV( columns, data, thisPage, dialogBoolean ) {
		const actualVals = JSON.parse(JSON.stringify(data));
		const actualCols = JSON.parse(JSON.stringify(columns));
		let dataTemp = [];
		
		
		if (actualVals !== undefined) {
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

					if ( key == 'sicCode07' && thisPage == 'directorDetails' ) {
						tempRowData['sic_code'] = this.titlecasePipe.transform( actualVals[i][key][0] );

					} else if(key === "SICCode" || key === "sic_code" || key === 'sicCode07') {
						let tempArray = this.commonService.getSICCodeInArrayFormat(actualVals[i][key]);
						let sicCodeString = '';
						for (let data of tempArray) {
							sicCodeString += data + "\n";
						}
						sicCodeString = sicCodeString.substring(0, sicCodeString.length - 1)
						tempRowData[key] = this.titlecasePipe.transform(sicCodeString);

					} else if( ( key == 'personEntitled' || key == 'person_entitled' ) && thisPage == 'directorDetails' )  {
						if ( actualVals[i][key].length ) {
							let str = '';
							for( let item of actualVals[i][key] ) {
								str += this.titlecasePipe.transform( item ) + '\n';
							}
							tempRowData[key] = str;
						}
					} else if (key === 'companyInformation' || key === 'person_entitled') {

						let ModifyArrr = [],
							tempArrayForPersonEntitle = [];

						if ( key === 'companyInformation'){
							ModifyArrr = actualVals[i]['companyInformation'];
						} else {
							ModifyArrr = actualVals[i];
						}
						if ( key === 'person_entitled' || thisPage == 'directorDetails' ) {

							ModifyArrr['person_entitled'].filter( val => {
								tempArrayForPersonEntitle.push(this.titlecasePipe.transform(val[0]) + '(' + val[1] + ')')
							});
							
							tempRowData['person_entitled'] = tempArrayForPersonEntitle;
							
							if ( ModifyArrr.hasOwnProperty( 'internationalScoreDescription' ) ) {
								
								tempRowData['internationalScoreDesc'] = ModifyArrr[ 'internationalScoreDescription' ] == 'not scored' ? 'Not Scored / Very High Risk': this.titlecasePipe.transform(   ModifyArrr[ 'internationalScoreDescription' ] );
								
							}

						}

					} else if ( actualVals[i].hasOwnProperty('financialData') && key == 'financialData' && thisPage == 'directorDetails' ) {

						if ( actualVals[i][key].length ) {

							let tempArr = Object.keys(actualVals[i][key][0]);
							tempArr = [ tempArr[1], tempArr[2], tempArr[3], tempArr[4] ];

							for( let item of tempArr ) {
								tempRowData[item] = this.toCurrencyPipe.transform( actualVals[i][key][0][item], '', '', '1.0-0' );
							}
						}

					} else if( key == 'disqualification' ) {
						if ( actualVals[i][key] && Object.keys( actualVals[i][key] ).length ) {
							let disqualificationData = Object.keys( actualVals[i][key] ), str = '', disqualificationKeys = { 'startDate': 'Start Date', 'endDate': 'End Date', 'sectionOfAct': 'Section of Act', 'years': 'Years' };

							for( let item of disqualificationData ) {
								str += `${ disqualificationKeys[item] }: ${ actualVals[i][key][item] } \n`;
							}
							tempRowData[key] = str;
						}
					} else if (key === 'pscAddress') {
						tempRowData[key] = actualVals[i].pscAddress;

					} else if (key === 'postcode') {
						tempRowData[key] = actualVals[i][key].toUpperCase();
					} else if (key === "shareHolderName") {

						let shareholderName = actualVals[i][key]["name"] !== undefined && actualVals[i][key]["name"] !== null ? this.titlecasePipe.transform(actualVals[i][key]["name"]) : "-"
						tempRowData[key] = shareholderName;

					} else if (key == "currency") {

						tempRowData[key] = actualVals[i][key] ? actualVals[i][key].toUpperCase() : "-";

					} else if (key == 'DateFiled') {
						
						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');
						
					} else if(key === 'region_array') {
						tempRowData['region_array'] = this.titlecasePipe.transform(actualVals[i][key][0]);
						
					} else if(key == 'cpv_codes') {
						
						let tempStrCpv = '';

						for(let tempCpv of actualVals[i][key]) {
							tempStrCpv += tempCpv['code'] + ' ' + this.titlecasePipe.transform(tempCpv['desc'].replace(/.$/, "")) + ', ';
						}
						tempRowData[key] = tempStrCpv;
												
					}  else if (key === 'Mortgages') {

						tempRowData['NumMortCharges'] = actualVals[i].Mortgages[0].NumMortCharges;
						tempRowData['NumMortOutstanding'] = actualVals[i].Mortgages[0].NumMortOutstanding;
						tempRowData['NumMortPartSatisfied'] = actualVals[i].Mortgages[0].NumMortPartSatisfied;
						tempRowData['NumMortSatisfied'] = actualVals[i].Mortgages[0].NumMortSatisfied;

					} else if (key == 'fromDate') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'ccjDate' || key == 'ccjPaidDate' || key == 'registered_on' || key == 'projectStartDate' || key == 'projectEndDate') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'projectTitle') {

						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].replace(/[^\w\s]/g, ' '));

					} else if (key == 'publicDescription') {

						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key].replace(/[^\w\s]/g, ' '));

					} else if (key == 'toDate') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'latestRatingChangeDate') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'registeredDate') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'created_date') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'statusFiledDate') {

						tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyyy');

					} else if (key == 'directorName') {

						tempRowData[key] = this.titlecasePipe.transform(this.formatDirectorName(actualVals[i][key]));

						if (!(actualVals[i].hasOwnProperty('resignedOn'))) {
							tempRowData['resignedStatus'] = 'Active';
						}

						// } 
						// else if (key == 'resignedOn') {

						// 	if (actualVals[i][key] !== null) {
						// 		if (typeof (actualVals[i][key]) === 'string') {
						// 			actualVals[i][key] = actualVals[i][key];
						// 		} else {
						// 			tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd-MM-yyy');
						// 		}
						// 		tempRowData['resignedStatus'] = 'Resigned';
						// 	} else {
						// 		tempRowData['resignedStatus'] = 'Active';
						// 	}

						// } else if ((key == 'address') && !(actualVals[i].hasOwnProperty('pscAddress'))) {

						// 	if ((actualVals[i].hasOwnProperty('companyNumber')) && (!(actualVals[i].hasOwnProperty('directorName')))) {
						// 		tempRowData[key] = this.titlecasePipe.transform(this.formatCompanyAddress(actualVals[i][key]));
						// 	} else {
						// 		tempRowData[key] = actualVals[i][key];
						// 	}

					} else if (key == 'IncorporationDate' || key == 'companyRegistrationDate') {

						tempRowData[key] = actualVals[i][key];
						tempRowData['companyAge'] = this.calculateCompanyAge(actualVals[i][key]);

					} else if (key == 'persons_entitled') {

						let tempPersonEntitledString: string = '';
						for (let data of actualVals[i]['persons_entitled']) {
							tempPersonEntitledString += data + "\n";
						}
						tempRowData['persons_entitled'] = this.titlecasePipe.transform(tempPersonEntitledString.substring(0, tempPersonEntitledString.length - 1));

					} else if (key == "particulars" || key == "secured_details" || key == "classification") {

						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]);

					} else if (key == "dName" || key == "pscName") {

						if (thisPage == "relatedPersonInfo") {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]['name']['name']);
						} else if (thisPage == 'personContactInfo') {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]);
						} else {
							tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]['name']);
						}

					} else if (key == "date_of_birth") {
						tempRowData[key] = actualVals[i][key];

					} else if (key == 'title') {
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i][key]);
					} else if (key == "email_1" || key == "email_2" || key == "email_3" || key == "email_gen1" || key == "email_4" || key == "tel_1" || key == "title") {
						tempRowData[key] = actualVals[i][key] ? actualVals[i][key] : "-";

					} else if (key == "dataOfBirth") {
						if (actualVals[i][key] !== undefined && actualVals[i][key] !== null && actualVals[i][key] !== "") {
							tempRowData[key] = actualVals[i][key]["month"] + "," + actualVals[i][key]["year"];
						}
						else {
							tempRowData[key] = ""
						}
					} else if (key == "appointmentDate" || key == "created_on" || key == "delivered_on") {

						if (key == "appointmentDate" && typeof (actualVals[i][key]) === 'string') {
							tempRowData[key] = actualVals[i][key]
						} else {
							tempRowData[key] = this.datePipe.transform(actualVals[i][key], 'dd/MM/yyy');
						}

					} else if (key == "companyNumber" || key == "registrationNumber" || key == "notation") {

						tempRowData[key] = actualVals[i][key].toUpperCase();

					} else if (key == "businessName") {

						tempRowData[key] = actualVals[i][key] ? actualVals[i][key].toUpperCase() : "";

					} else if ( key == "companyRegistrationNumber" || key == "companyRegNumber" || key == "eprPermitRef" || key == "registrationTypeNotation" ) {
						
						tempRowData[key] = actualVals[i][key].toUpperCase();
						
					} else if (key == "companyStatus" || key == "companyStatusHnwi") {
						   
						tempRowData[key] = this.titlecasePipe.transform(actualVals[i]['companyStatus']);

						if ( dialogBoolean.viewHnwiShareholdingsModal == true ) {

							tempRowData['companyStatusHnwi'] = this.titlecasePipe.transform(actualVals[i]['companyStatus']);

						}

					} else if (key == "turnover" && actualVals[i]['turnover'] == 0 ) {

						tempRowData[key] = '';

					} else if (key == "estimated_turnover" && actualVals[i]['estimated_turnover'] !== 0 ) {
						
						tempRowData[key] = this.toCurrencyPipe.transform( actualVals[i]['estimated_turnover'], '', '', '1.0-0' );
						
					} else if ( key == "share_percent" ) {
						if ( actualVals[i][key] ) {
						
							tempRowData[key] = parseFloat(actualVals[i][key]).toFixed(2);
						} else {
			
							tempRowData[key] = "";
						}

					} else if ( key == "percentage_share" ) {
					
						// tempRowData[key] = this.toCurrencyPipe.transform(actualVals[i][key], '', '', '1.0-0');
						tempRowData[key] = actualVals[i][key];

					} else if (key == "netAssets" && actualVals[i]['netAssets'] == '-') {

						tempRowData[key] = '';

					} else if (key == "turnover_latest" && actualVals[i]['turnover_latest'] == '-') {

						tempRowData[key] = '';

					} else if (key == "notes") {

						tempRowData[key] = this.stripHTML(actualVals[i][key]);

					} else if (key == "deleteDate") {

						tempRowData[key] = this.stripHTML(actualVals[i][key]);

					} else if (key == "chipData") {

						tempRowData[key] = this.stripHTML(actualVals[i][key]);

					} else if (key == "controlType") {

						tempRowData[key] = this.titlecasePipe.transform(this.formatControlType(actualVals[i][key]));

					} else if (key == "phoneNumber") {

						if (typeof (actualVals[i][key]) !== 'object') {
							if (actualVals[i][key].length >= 12) {
								if (actualVals[i][key][0] == "+") {
									actualVals[i][key] = actualVals[i][key].slice(1);
								}
								let countryCode = "(+" + actualVals[i][key].toString().slice(0, 2) + ")"
								tempRowData[key] = countryCode + actualVals[i][key].toString().slice(2);
							}
							else {
								tempRowData[key] = actualVals[i][key].toString();
							}
						}

					} else if (key == "disqualifiedDirectors") {

						if (actualVals[i][key]["CD06"] !== undefined) {
							let str = "";
							let years = actualVals[i][key]['DSYR'] !== undefined && actualVals[i][key]['DSYR'] !== "" ? actualVals[i][key]['DSYR'] : " - ";
							let startDate = actualVals[i][key]['SDATE'] !== undefined && actualVals[i][key]['SDATE'] !== "" ? actualVals[i][key]['SDATE'] : " - ";
							let endDate = actualVals[i][key]['EDATE'] !== undefined && actualVals[i][key]['EDATE'] !== "" ? actualVals[i][key]['EDATE'] : " - ";
							let sectionOfAct = actualVals[i][key]['SACT'] !== undefined && actualVals[i][key]['SACT'] !== "" ? actualVals[i][key]['SACT'] : " - ";
							str = str + 'Years: ' + years.toString() + "\n";
							str = str + 'Start Date: ' + startDate.toString() + "\n";
							str = str + 'End Date: ' + endDate.toString() + "\n";
							str = str + 'Section of Act: ' + sectionOfAct;
							tempRowData[key] = str
						}

					} else if (key == "add_On") {

						tempRowData[key] = actualVals[i][key]['specialFilter'] === true ? 'Premium Filter' : '';

					} else if (key == "exceptionDirectors") {

						if (actualVals[i][key]["CD07"] !== undefined) {
							let str = "";
							let startDate = actualVals[i][key]['SDATE'] !== undefined && actualVals[i][key]['SDATE'] !== "" ? actualVals[i][key]['SDATE'] : " - ";
							let endDate = actualVals[i][key]['EDATE'] !== undefined && actualVals[i][key]['EDATE'] !== "" ? actualVals[i][key]['EDATE'] : " - ";
							str = str + 'Start Date: ' + startDate.toString() + "\n";
							str = str + 'End Date: ' + endDate.toString();
							tempRowData[key] = str;

						}
					} else if (key == "monitorBoolean") {

						tempRowData[key] = actualVals[i][key] ? 'Yes' : 'No';

					} else if (key == "Change_Indicator") {
						tempRowData[key] = actualVals[i][key] && actualVals[i][key].toLowerCase() === "a" ? "Added" : actualVals[i][key] && actualVals[i][key].toLowerCase() === "d" ? "Deleted" : "";

					} else if (key == "purchaseCompanyName1" || key == "purchaseCompanyName2" || key == "purchaseCompanyName3" || key == "purchaseCompanyName4") {
						tempRowData['purchaseCompanyName'] = this.titlecasePipe.transform(actualVals[i]['purchaseCompanyName1']) + " " + this.titlecasePipe.transform(actualVals[i]['purchaseCompanyName2']) + " " + this.titlecasePipe.transform(actualVals[i]['purchaseCompanyName3']) + " " + this.titlecasePipe.transform(actualVals[i]['purchaseCompanyName4']);

					} else if (key == "purchaseCompanyNumber1" || key == "purchaseCompanyNumber2" || key == "purchaseCompanyNumber3" || key == "purchaseCompanyNumber4") {
						tempRowData['purchaseCompanyNumber'] = actualVals[i]['purchaseCompanyNumber1'] + " " + actualVals[i]['purchaseCompanyNumber2'] + " " + actualVals[i]['purchaseCompanyNumber3'] + " " + actualVals[i]['purchaseCompanyNumber4'];

					} else if (key == "sellerCompanyName1" || key == "sellerCompanyName2" || key == "sellerCompanyName3" || key == "sellerCompanyName4") {
						tempRowData['sellerCompanyName'] = this.titlecasePipe.transform(actualVals[i]['sellerCompanyName1']) + " " + this.titlecasePipe.transform(actualVals[i]['sellerCompanyName2']) + " " + this.titlecasePipe.transform(actualVals[i]['sellerCompanyName3']) + " " + this.titlecasePipe.transform(actualVals[i]['sellerCompanyName4']);

					} else if (key == "sellerCompanyNumber1" || key == "sellerCompanyNumber2" || key == "sellerCompanyNumber3" || key == "sellerCompanyNumber4") {
						tempRowData['sellerCompanyNumber'] = actualVals[i]['sellerCompanyNumber1'] + " " + actualVals[i]['sellerCompanyNumber2'] + " " + actualVals[i]['sellerCompanyNumber3'] + " " + actualVals[i]['sellerCompanyNumber4'];

					} else if (key == "tradingCTPSFlag") {

						tempRowData[key] = actualVals[i][key] && actualVals[i][key].toLowerCase() === "y" ? "Yes" : actualVals[i][key] && actualVals[i][key].toLowerCase() === "n" ? "No" : "";

					} else if (key == "commodity_code") {

						let tempArray = [];
						for (let actualKey of actualVals[i][key]) {
							tempArray.push(this.titlecasePipe.transform(actualKey));
						}
						tempRowData[key] = tempArray;

					} else if ( key == "status" && thisPage == "personContactInfo" ) {

						tempRowData[key] = actualVals[i] && actualVals[i][key] == 'Notverified' ? 'Not Verified' : actualVals[i][key];

					} else if ( key == "competitionReference" ) {

						tempRowData[key] = actualVals[i][key].toUpperCase();

					} else if ( ['financeTurnoverData', 'financeTotalAssetsData', 'financeTotalLiabilitiesData', 'financeNetWorthData'].includes(key) && actualVals[i][key] == 0 ) {

						tempRowData[key] = '';

					} else if ( key == "epcDetails" ) {

						if ( actualVals[i][key] ) {

							tempRowData[ 'epcButtonCurrent' ] =  `Rating ${ actualVals[i][key]['asset_rating_band'] ? actualVals[i][key]['asset_rating_band'] : actualVals[i][key]['current_energy_rating'] ? actualVals[i][key]['current_energy_rating'] : '' }`;

							tempRowData[ 'epcButtonPotential' ] = actualVals[i][key]['potential_energy_rating'] ? `Rating ${ actualVals[i][key]['potential_energy_rating'] }` : '';
  
						}

					} else if ( key == "suitable_for_VCO" ) {

						let tempArray = [];
						if ( actualVals[i]['suitable_for_SME'] ) {
							tempArray.push( `Is SME: ${ actualVals[i]['suitable_for_SME'] } ` );
						}

						if ( actualVals[i]['suitable_for_VCO'] ) {
							tempArray.push( `Is VCO: ${ actualVals[i]['suitable_for_VCO'] } ` );
						}

						tempRowData['enterpriseCategory'] = tempArray + ' ';

					} else if ( ['internationalScoreDesc', 'internationalScoreDescription'].includes(key) && actualVals[i][ key ]) {

						tempRowData[key] = actualVals[i][ key ] == 'not scored' ? 'Not Scored / Very High Risk': this.titlecasePipe.transform(  actualVals[i][ key ] );
					} else {
						if (typeof (actualVals[i][key]) === "string" && ( ![ 'contactDetails', 'sourceDirector', 'sourceDirectorName', 'destinationDirectorName', 'destinationDirector' ].includes( key ) )) {
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

	formatDirectorName(name) {
		return this.commonService.formatDirectorName(name);
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

	stripHTML(str) {
		if(str) {
			return str.replace(/<[^>]*>/g, '');
		}
	}

	formatControlType(controlType) {
		controlType = controlType.toString().split('-')[0];
		return controlType;
	}
	
}


