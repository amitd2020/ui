import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';

@Component({
	selector: 'dg-landscape-companies-list',
	templateUrl: './landscape-companies-list.component.html',
	styleUrls: ['./landscape-companies-list.component.scss']
})
export class LandscapeCompaniesListComponent implements OnInit {

	companyData: any[];
	recordTableCols: any[];
	staticLandscapeData = [];
	selectedGlobalCurrency: string = 'GBP';

	constructor(
		private commonService: CommonServiceService,
		private toCurrencyPipe: CurrencyPipe,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {

		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

		let listForParam = this.activatedRoute.snapshot.queryParams['listFor'];
		
		this.recordTableCols = [
			{ field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '360px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'directorName', header: 'Director Name', colunName: 'Director Name', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'otherFeatures', header: 'Features', colunName: 'Features', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
			{ field: 'directorEmail', header: 'Director Email', colunName: 'Director Email', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
			{ field: 'directorLinkedIn', header: 'Director LinkedIn', colunName: 'Director LinkedIn', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
			{ field: 'occupation', header: 'Occupation', colunName: 'Occupation', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center', value: true },
			{ field: 'RegAddress_Modified', header: 'Website', colunName: 'Website', minWidth: '190px', maxWidth: '190px', textAlign: 'left', value: false },
			{ field: 'RegAddress_Modified', header: 'Phone', colunName: 'Phone', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'RegAddress_Modified', header: 'CTPS Registered', colunName: 'Phone', minWidth: '130px', maxWidth: '130px', textAlign: 'center', value: false },
			{ field: 'companyType', header: 'Company Category', colunName: 'Company Category', minWidth: '220px', maxWidth: '220px', textAlign: 'left', value: false },
			{ field: 'companyAge', header: 'Age', colunName: 'Age', minWidth: '80px', maxWidth: '80px', textAlign: 'right', value: true },
			{ field: 'companyRegistrationDate', header: 'Incorporation Date', colunName: 'Incorporation Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center', value: true },
			{ field: 'RegAddress', header: 'Registered Address', colunName: 'Registered Address', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'sicCode07', header: 'SIC Code', colunName: 'SIC Code', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'active_directors_count', header: 'Active Directors Count', colunName: 'Active Directors Count', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'NumMortCharges', header: 'Mortgages Charge', colunName: 'Mortgages Charge', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'CCJCount', header: 'CCJ Count', colunName: 'CCJ Count', minWidth: '100px', maxWidth: '100px', textAlign: 'right', value: false },
			{ field: 'numberOfEmployees', header: 'No. of Employees', colunName: 'No. of Employees', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'turnover_latest', header: 'Turnover', colunName: 'Turnover', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'estimated_turnover', header: 'Turnover (Estimate+)', colunName: 'Turnover', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'totalAssets_latest', header: 'Total Assets', colunName: 'Total Assets', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'totalLiabilities_latest', header: 'Total Liabilities', colunName: 'Total Liabilities', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'netWorth_latest', header: 'Net Worth', colunName: 'Net Worth', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'grossProfit_latest', header: 'Gross Profit', colunName: 'Gross Profit', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false }
		];


		let companyDataTemp = this.formatData(this.companyData);
		let cmpNoArray = [];
		let companyContactCmpNoArr = [];

		for (let i = 0; i < companyDataTemp.length; i++) {
			if (companyDataTemp[i].simplifiedAccounts) {
				if (companyDataTemp[i].simplifiedAccounts[0].turnover && companyDataTemp[i].simplifiedAccounts[0].turnover != "") {
					companyDataTemp[i]['turnover_latest'] = this.toCurrencyPipe.transform(companyDataTemp[i].simplifiedAccounts[0].turnover, this.selectedGlobalCurrency, 'symbol', '1.0-0');
				} else {
					companyDataTemp[i]['turnover_latest'] = "-";
				}
				if (companyDataTemp[i].simplifiedAccounts[0].estimated_turnover && companyDataTemp[i].simplifiedAccounts[0].estimated_turnover != "") {
					companyDataTemp[i]['estimated_turnover'] = this.toCurrencyPipe.transform(companyDataTemp[i].simplifiedAccounts[0].estimated_turnover, this.selectedGlobalCurrency, 'symbol', '1.0-0');
				} else {
					companyDataTemp[i]['estimated_turnover'] = "-";
				}
				if (companyDataTemp[i].simplifiedAccounts[0].totalAssets && companyDataTemp[i].simplifiedAccounts[0].totalAssets != "") {
					companyDataTemp[i]['totalAssets_latest'] = this.toCurrencyPipe.transform(companyDataTemp[i].simplifiedAccounts[0].totalAssets, this.selectedGlobalCurrency, 'symbol', '1.0-0');
				} else {
					companyDataTemp[i]['totalAssets_latest'] = "-";
				}
				if (companyDataTemp[i].simplifiedAccounts[0].totalLiabilities && companyDataTemp[i].simplifiedAccounts[0].totalLiabilities != "") {
					companyDataTemp[i]['totalLiabilities_latest'] = this.toCurrencyPipe.transform(companyDataTemp[i].simplifiedAccounts[0].totalLiabilities, this.selectedGlobalCurrency, 'symbol', '1.0-0');
				} else {
					companyDataTemp[i]['totalLiabilities_latest'] = "-";
				}
				if (companyDataTemp[i].simplifiedAccounts[0].netWorth && companyDataTemp[i].simplifiedAccounts[0].netWorth != "") {
					companyDataTemp[i]['netWorth_latest'] = this.toCurrencyPipe.transform(companyDataTemp[i].simplifiedAccounts[0].netWorth, this.selectedGlobalCurrency, 'symbol', '1.0-0');
				} else {
					companyDataTemp[i]['netWorth_latest'] = "-";
				}
				if (companyDataTemp[i].statutoryAccounts) {
					if (companyDataTemp[i].statutoryAccounts[0].grossProfit && companyDataTemp[i].statutoryAccounts[0].grossProfit != "") {
						companyDataTemp[i]['grossProfit_latest'] = this.toCurrencyPipe.transform(companyDataTemp[i].statutoryAccounts[0].grossProfit, this.selectedGlobalCurrency, 'symbol', '1.0-0');
					}
					else {
						companyDataTemp[i]['grossProfit_latest'] = '-';
					}
				} else {
					companyDataTemp[i]['grossProfit_latest'] = '-';
				}
				if (companyDataTemp[i].simplifiedAccounts[0].numberOfEmployees) {
					companyDataTemp[i]['numberOfEmployees'] = parseInt(companyDataTemp[i].simplifiedAccounts[0].numberOfEmployees);
				}
			}
			
			if (companyDataTemp[i].ccjDetails) {
				companyDataTemp[i]['CCJCount'] = companyDataTemp[i].ccjDetails.length;
			}
			else {
				companyDataTemp[i]['CCJCount'] = '-';
			}
			if (companyDataTemp[i].RegAddress_Modified.district_code) {
				companyDataTemp[i].RegAddress_Modified.district_code = companyDataTemp[i].RegAddress_Modified.district_code.toUpperCase();
			}
			if (companyDataTemp[i].hasShareHolders) {
				cmpNoArray.push(companyDataTemp[i].companyRegistrationNumber.toLowerCase());
			}
			if (companyDataTemp[i].hasCompanyLinkedinUrl || companyDataTemp[i].hasCompanyWebsite || companyDataTemp[i].hasCompanyGenericMail) {
				companyContactCmpNoArr.push(companyDataTemp[i].companyRegistrationNumber.toUpperCase());
			}
		}

		this.companyData = companyDataTemp;
	}

	formatData(companiesData) {
		let tempCompaniesData = [];
		companiesData.forEach(companyData => {

			companyData["total_directors_count"] = 0
			companyData["resigned_directors_count"] = 0;
			companyData["active_directors_count"] = 0;
			companyData["NumMortCharges"] = 0;

			if (companyData["companyRegistrationDate"] !== undefined) {
				if (companyData["companyRegistrationDate"] !== null) {
					companyData["IncorporationDate"] = this.formatDate(companyData["companyRegistrationDate"])
				}
			}

			if (companyData['RegAddress_Modified']) {
				companyData['RegAddress'] = this.commonService.formatCompanyAddress(companyData['RegAddress_Modified']);
			}

			if (companyData["directorsData"] !== undefined) {
				if (companyData["directorsData"] !== null) {
					companyData["total_directors_count"] = companyData["directorsData"].length;
					companyData["active_directors_count"] = companyData["activeDirectorsCount"];
					companyData["resigned_directors_count"] = companyData["resignedDirectorsCount"];
				}
			}

			if (companyData["mortgagesObj"] !== undefined) {
				if (companyData["mortgagesObj"] !== null) {
					companyData["NumMortCharges"] = companyData["mortgagesObj"].length;
				}
			}
			if (companyData["accountsMadeUpDate"] !== undefined) {
				if (companyData["accountsMadeUpDate"] !== null) {
					companyData["accountsMadeUpDate"] = this.formatDate(companyData["accountsMadeUpDate"])
				}
			}
			if (companyData["businessName"] !== undefined && companyData["businessName"] !== null && companyData["businessName"] !== "") {
				tempCompaniesData.push(companyData)
			}
		});

		return (tempCompaniesData);
	}

	formatDate(date) {
		return this.commonService.formatDate(date);
	}

}
