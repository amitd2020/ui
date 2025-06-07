import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-psc',
	templateUrl: './psc.component.html',
	styleUrls: ['./psc.component.scss']
})
export class PscComponent implements OnInit {

	companyData: any;

	pscDataColumn: any[];
	pscSuperSecurePersonDataColumn: any[];
	personWithSignificantControls: any = [];
	pscStatementControlPersonDataColumn: any[];

	countryCodemap = new Map();
	countryNameMap = new Map();

	constructor(
		private commonService: CommonServiceService,
		private dataCommunicatorService: DataCommunicatorService,
		private titlecasePipe: TitleCasePipe,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.sharedLoaderService.showLoader();
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => this.companyData = res);

		this.getCountryCode();

		this.pscDataColumn = [
			{ field: 'pscName', header: 'Name', minWidth: '280px', maxWidth: '280px', textAlign: 'left', visible: true },
			{ field: 'natures_of_control', header: 'Nature of Control', minWidth: '200px', maxWidth: '200px', textAlign: 'left', visible: true },
			{ field: 'stat', header: 'Status', minWidth: '170px', maxWidth: '170px', textAlign: 'center', visible: true },
			{ field: 'ceasedDate', header: 'Ceased Date', minWidth: '170px', maxWidth: '300px', textAlign: 'center', visible: true },
			{ field: 'controlType', header: 'Kind', minWidth: '300px', maxWidth: '300px', textAlign: 'left', visible: true },
			{ field: 'nationality', header: 'Nationality', minWidth: '170px', maxWidth: '170px', textAlign: 'left', visible: true },
			{ field: 'dataOfBirth', header: 'Date of Birth', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true },
			{ field: 'countryOfResidence', header: 'Residence Country', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true },
			{ field: 'pscAddress', header: 'Address', minWidth: '400px', maxWidth: 'none', textAlign: 'left', visible: true },
		];

		this.pscStatementControlPersonDataColumn = [
			{ field: 'description', header: 'Description', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'controlType', header: 'Kind', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'psc_statement_status', header: 'Status', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'psc_statement_notified_date', header: 'Notified Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'psc_statement_ceased_date', header: 'Ceased Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
		];

		this.pscSuperSecurePersonDataColumn = [
			{ field: 'description', header: 'Description', minWidth: '280px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'controlType', header: 'Kind', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'psc_protected_status', header: 'Status', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
		];
		
	}
	
	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	getPSCDataForAllTable() {

		if ( this.companyData.pscDetails && this.companyData.pscDetails.length ) {
			
			let temppscDetails = this.companyData.pscDetails;
			this.companyData.pscDetails.map( val => {
				if ( val.stat == 'current' || val.stat == 'active' ){
					val.ceasedDate = '-';
				}
				return val;
			})

			setTimeout(() => {
				this.companyData.pscDetails.sort( ( a, b ) => (a.stat).localeCompare(b.stat));
			}, 1000);
			
			temppscDetails.filter(element => {
	
				if ( element.pscName ) {
					let data = element?.pscName
					if ( data?.['name'] || data?.['name']?.['name'] ) {
						element.pscName = data?.['name'];
					}

					this.companyData['pscName'] = data?.['name'] ? data?.['name'] : data ;
					
				}
			});

			for (let i = 0; i < this.companyData.pscDetails.length; i++) {
				if (this.companyData.pscDetails[i]['pscName'] !== undefined || this.companyData.pscDetails[i]['pscName'] !== null || this.companyData.pscDetails[i]['pscName'] !== "") {

					this.personWithSignificantControls[i] = this.companyData.pscDetails[i];
				}
			}

			for (var i = 0; i < this.personWithSignificantControls.length; i++) {

				if (this.personWithSignificantControls[i].nationality !== undefined && this.personWithSignificantControls[i].nationality !== null) {
					if (this.personWithSignificantControls[i].nationality == 'english') {
						if (this.countryCodemap.has('british')) {
							this.personWithSignificantControls[i]['countryCode'] = this.countryCodemap.get('british');
						}
					} else {
						if (this.countryCodemap.has(this.personWithSignificantControls[i].nationality.toLowerCase())) {
							this.personWithSignificantControls[i]['countryCode'] = this.countryCodemap.get(this.personWithSignificantControls[i].nationality.toLowerCase());
						}
					}
				}


				if (this.personWithSignificantControls[i].countryOfResidence !== undefined) {
					if (this.personWithSignificantControls[i].countryOfResidence !== null) {
						if (this.countryNameMap.has(this.personWithSignificantControls[i].countryOfResidence.toLowerCase())) {
							this.personWithSignificantControls[i]['countryResidenceCode'] = this.countryNameMap.get(this.personWithSignificantControls[i].countryOfResidence.toLowerCase());
						}
					}
				}
				let natureofcontrols = [];

				natureofcontrols = this.companyData.pscDetails[i].natureOfControl.split(',');

				this.companyData.pscDetails[i]['natures_of_control'] = natureofcontrols;

				if (natureofcontrols !== undefined && natureofcontrols !== null) {

					for (var j = 0; j < natureofcontrols.length; j++) {
						if (
							this.personWithSignificantControls[i].natures_of_control[
								j
							].indexOf("percent") > -1
						) {
							var ownership = this.personWithSignificantControls[i]
								.natures_of_control[j];
							ownership = ownership.replace(/-/g, " ");
							let newOwnership =
								ownership.substring(0, ownership.lastIndexOf(" ")) + " %";
							let newowner1 = newOwnership.replace(/to/g, "-");
							this.personWithSignificantControls[i].natures_of_control[
								j
							] = newowner1;
						} else {
							var ownership = this.personWithSignificantControls[i]
								.natures_of_control[j];
							ownership = ownership.replace(/-/g, " ");
							this.personWithSignificantControls[i].natures_of_control[
								j
							] = ownership;
						}
					}

				}

				let tempDateOfBirth = this.companyData.pscDetails[i].dataOfBirth;

				if (tempDateOfBirth !== undefined && tempDateOfBirth !== null && tempDateOfBirth !== "") {
					if (typeof (tempDateOfBirth) == 'string') {
						let date_of_birth = {
							month: `${Month[parseInt(tempDateOfBirth.split('/')[0])]}`,
							year: `${tempDateOfBirth.split('/')[1]}`
						}
						this.personWithSignificantControls[i].dataOfBirth = date_of_birth;
					}
				}

				let address = this.pscAddress(this.personWithSignificantControls[i])
				this.personWithSignificantControls[i]['pscAddress'] = address;
				
				let pscNameObj = {
					name: this.personWithSignificantControls[i].pscName,
					link: this.personWithSignificantControls[i].links,
				}

				this.personWithSignificantControls[i]['pscName'] = pscNameObj;
			}

			if (this.companyData?.pscStatementControlPersonDetails?.length > 0) {
				for (var i = 0; i < this.companyData.pscStatementControlPersonDetails.length; i++) {
					this.companyData.pscStatementControlPersonDetails[i]['description'] = 'The company knows or has reasonable cause to believe that there is a registrable person in relation to the company but it has not identified the registrable person.';
					this.companyData.pscStatementControlPersonDetails[i]['psc_statement_notified_date'] = this.companyData.pscStatementControlPersonDetails[i].notifiedDate;
					this.companyData.pscStatementControlPersonDetails[i]['psc_statement_status'] = this.companyData.pscStatementControlPersonDetails[i].stat;
					if (this.companyData.pscStatementControlPersonDetails[i].stat == 'ceased') {
						this.companyData.pscStatementControlPersonDetails[i]['psc_statement_ceased_date'] = this.companyData.pscStatementControlPersonDetails[i].ceasedDate;
					} else {
						this.companyData.pscStatementControlPersonDetails[i]['psc_statement_ceased_date'] = '-';
					}
				}
			}
			if (this.companyData?.pscSuperSecurePersonDetails?.length > 0) {
				for (var i = 0; i < this.companyData.pscSuperSecurePersonDetails.length; i++) {
					this.companyData.pscSuperSecurePersonDetails[i]['description'] = "The person with significant control's details are not shown because restrictions on using or disclosing any of the individual’s particulars are in force under regulations under section 790ZG in relation to this company.";
					this.companyData.pscSuperSecurePersonDetails[i]['psc_protected_status'] = this.companyData.pscSuperSecurePersonDetails[i].stat;
				}
			}
		}

	}

	pscAddress(data: any) {
		return this.commonService.pscAddress(data);
	}

	getCountryCode() {
		
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'countryName').subscribe(res => {
			if (res.status === 200) {
				
                // for (let i = 0; i < res.body['body']['result'].length; i++) {
                //     this.countryCodemap.set(res.body['body']['result'][i].Nationality.toLowerCase(), res.body['body']['result'][i].Code.toLowerCase());
                //     this.countryNameMap.set(res.body['body']['result'][i].Country.toLowerCase(), res.body['body']['result'][i].Code.toLowerCase());
                // }

				this.getPSCDataForAllTable();

            }
        })
    }

	updateTableForPsc(event) {
		if(event.requestFor == "pscDataForTable") {
			
			this.getCountryCode();

		}
	}

}
