import { InputRecordType } from "./range-input-type";

export const InputRangeRecord: InputRecordType = {
	'Key Financials': { mode: 'currency', numOfFinacialField : [
		{ key: "turnover", keyLabel: "Turnover", byPass: true, canBeNegative: true, estimatedToggle: true },
		{ key: "grossProfit", keyLabel: "Gross Profit", byPass: true, canBeNegative: true },
		{ key: "netWorth", keyLabel: "Net Worth", byPass: true, canBeNegative: true }
	] },
	'Turnover': { mode: 'currency', numOfFinacialField : [
		{ key: "turnover", keyLabel: "Turnover", byPass: true, canBeNegative: true, estimatedToggle: true }
	] },
	'Trade Debtors': { mode: 'currency', minValue: null },
	'Price': { mode: 'currency', minValue: null, minPlaceholder: 'Minimum Cost', maxPlaceholder: 'Maximum Cost' },
	'Financials': { dropdown: true, andOrInputSwitch: true },
	'Advanced Key Financials': { dropdown: true, andOrInputSwitch: true, mode: 'currency' },
	'1 Year Growth': { dropdown: true, prefix: '% ' },
	'3 Years Growth': { dropdown: true, prefix: '% ' },
	'5 Years Growth': { dropdown: true, prefix: '% ' },
	'Financial Ratio': { dropdown: true, minFractionDigits: 2, maxFractionDigits: 2, andOrInputSwitch: true },
	'Director Age': { minValue: 1, dirAgeToggle: true },
	'Total Directorships': { minValue: 1, minPlaceholder: 'Minimum', maxPlaceholder: 'Maximum' },
	'Active Directorships': { minValue: 1 },
	'Active Directors': { minValue: 1 },
	'Number of Shareholders': { minValue: 1 },
	'Number of Shareholdings': { minValue: 1 },
	'Accounts Submission Overdue': { minValue: 1, maxValue: 24, minPlaceholder:'Enter Number Of Months' },
	'Count': { minValue: 1, minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'CCJ Amount': { minValue: null, mode: 'currency', minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Grant Offered': { minValue: null, mode: 'currency', minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Transaction Price': { minValue: null, mode: 'currency', minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Property Count': { minValue: 1, maxValue: 200, minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Properties Owned': { minValue: 1, minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Flats Owned': { minValue: 1, minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Houses Owned': { minValue: 1, minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Write-off Amount': { minValue: null, mode: 'currency', minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'Export Amount (in £)': { minValue: null, mode: 'currency' },
	'Exchange Rate Effect': { minValue: null, mode: 'currency' },
	'Outstanding Charges Count': { minValue: 1, minPlaceholder:'Minimum', maxPlaceholder: 'Maximum' },
	'M & A': { dropdown: true, mode: 'decimal', minFractionDigits: 1, maxFractionDigits: 2 },
	'Account Revenue': { mode: 'currency'},
	'Turnover**':  { mode: 'currency', numOfFinacialField : [
		{ key: "turnover", keyLabel: "Turnover", byPass: true, canBeNegative: true, estimatedToggle: true }
	] },
}