import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SearchCompanyService } from '../search-company.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-mortgage-charges',
	templateUrl: './mortgage-charges.component.html',
	styleUrls: ['./mortgage-charges.component.scss']
})
export class MortgageChargesComponent implements OnInit, OnChanges, AfterViewInit {

	@Input() companyDataForMortgages: Array<any> = [];
	@Input() appliedFilters: Array<any> = [];
	@Input() searchTotalCount: number = 0;
	@Input() paginationObj: object = { rows: 25, first: 0 };
	@Output() tableOutputValues = new EventEmitter<any>();
	@Output() operatingTable = new EventEmitter<any>();

	selectedGlobalCountry: string = 'uk';
	userDetails: Partial< UserInfoType > = {};
	chargesDataColumnFormortgages: Array<any> = [];
	msgs: Array<any> = [];
	dataDisplayKey = 'mortgagesObj';

	constructor(
		private userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private searchCompanyService: SearchCompanyService,
		public changeDetection: ChangeDetectorRef
	) { }

	ngOnChanges(changes: SimpleChanges) {
		if (  changes?.companyDataForMortgages &&  changes.companyDataForMortgages?.currentValue ) {
			this.companyDataForMortgages = changes.companyDataForMortgages.currentValue
		}
	}

	ngOnInit(): void {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

		this.userDetails = this.userAuthService?.getUserInfo();

		this.chargesDataColumnFormortgages = [
			{ field: 'chargeCode', header: 'Charge Code', minWidth: '120px', maxWidth: '120px', textAlign: 'right', countryAccess: [ 'uk' ] },
			{ field: 'submissionNumber', header: 'Submission Number', minWidth: '120px', maxWidth: '120px', textAlign: 'right', countryAccess: [ 'ie' ] },
			{ field: 'personsEntitled', header: 'Person Entitled', minWidth: '160px', maxWidth: '160px', textAlign: 'left', countryAccess: [ 'uk' ] },
			{ field: 'personEntitledName', header: 'Person Entitled', minWidth: '160px', maxWidth: '160px', textAlign: 'left', countryAccess: [ 'ie' ] },
			{ field: 'mortgageType', header: 'Charges Description', minWidth: '160px', maxWidth: '160px', textAlign: 'left', countryAccess: [ 'uk' ] },
			{ field: 'chargeTypeDescription', header: 'Charges Description', minWidth: '160px', maxWidth: '160px', textAlign: 'left', countryAccess: [ 'ie' ] },
			{ field: 'status', header: 'Status', minWidth: '120px', maxWidth: '120px', textAlign: 'center', countryAccess: [ 'uk', 'ie' ] },
			{ field: 'createdOn', header: 'Created On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'uk' ] },
			{ field: 'createdDate', header: 'Created On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'ie' ] },
			{ field: 'registeredOn', header: 'Registered On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'uk' ] },
			{ field: 'regDate', header: 'Registered On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'ie' ] },
			{ field: 'satisfiedOn', header: 'Satisfied On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'uk' ] },
			{ field: 'satisfiedDate', header: 'Satisfied On', minWidth: '100px', maxWidth: '100px', textAlign: 'center', countryAccess: [ 'ie' ] },
			{ field: 'mortgageDetail', header: 'Short-particulars', minWidth: '550px', maxWidth: 'none', textAlign: 'left', countryAccess: [ 'uk' ] },
			{ field: 'amountSecured', header: 'Amount-secured', minWidth: '350px', maxWidth: 'none', textAlign: 'left', countryAccess: [ 'uk', 'ie' ] }
		];
		
		if ( this.selectedGlobalCountry == 'ie' ) {
			this.dataDisplayKey = 'chargesData';
		}
		
	}
	
	ngAfterViewInit() {
		this.chargesDataColumnFormortgages = this.chargesDataColumnFormortgages.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
		this.changeDetection.detectChanges();
	}

	pageChange( event ) {
		this.paginationObj['rows'] = event.rows;
		this.paginationObj['first'] = event.first;
		this.searchCompanyService.updatePayload({
			pageSize: this.paginationObj['rows'],
			startAfter: this.paginationObj['first']
			// sortOn: this.sortOn ? this.sortOn : [],
			// filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
		});
		this.tableOutputValues.emit('charges')
	}

	resetListOfCharges(){
		this.paginationObj['rows'] = 25;
		this.paginationObj['first'] = 0;
		this.pageChange( this.paginationObj )
	}

	formatCompanyNameForUrl(companyName) {
		if (companyName !== undefined) {
			return this.commonService.formatCompanyNameForUrl(companyName);
		}
	}

	showCompanySideDetailsPanel(e: Event, compNumber, compName, rowData) {
		e.stopPropagation();
		e.preventDefault();
		this.operatingTable.emit({ requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData });
	}

	successMessageForExport( event ) {
		if ( event.severity == 'success' ) {

			this.msgs = [];
			this.msgs.push({ severity: event.severity, summary: event.message });
			
			setTimeout(() => {
				this.msgs = [];
			}, 3000);

		}
	}

}