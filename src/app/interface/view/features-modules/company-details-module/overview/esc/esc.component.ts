import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-esc',
	templateUrl: './esc.component.html',
	styleUrls: ['./esc.component.scss']
})
export class EscComponent implements OnInit {

	enforcementActionColumns: any[];
	wasteOperationsColumns: any[];
	waterDischargesColumns: any[];
	industrialInstallationColumns: any[];
	wasteExemptionsColumns: any[];
	endOfLifeVehiclesColumns: any[];
	scrapMetalDealersColumns: any[];
	floodRiskExemptionsColumns: any[];
	radioactiveSubstanceColumns: any[];
	wasteCarriersBrokersColumns: any[];
	environmentComplianceScoreColumns: any[];

	enforcementActionData: any;
	wasteOperationsData: any;
	waterDischargesData: any;
	industrialInstallationData: any;
	wasteExemptionsData: any;
	endOfLifeVehiclesData: any;
	scrapMetalDealersData: any;
	floodRiskExemptionsData: any;
	radioactiveSubstanceData: any;
	wasteCarriersBrokersData: any;
	environmentComplianceScoreData: any;

	companyNumber: string = '';

	constructor(
		private dataCommunicatorService: DataCommunicatorService,
		private userAuthService: UserAuthService,
		private globalServerCommunication: ServerCommunicationService
	) { }
	
	ngOnInit() {

        this.environmentComplianceScoreColumns = [
            { field: 'site_name', header: 'Site', minwidth: '250px', maxWidth: 'none', textWlign: 'left' },
            { field: 'regulatory_sector', header: 'Sector', minwidth: '250px', maxWidth: '250px', texWAlign: 'left' },
            { field: 'regulatory_sub_sector', header: 'Sub Sector', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
            { field: 'compliance_rating', header: 'Compliance Rating', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
        ];

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
            this.environmentComplianceScoreData = res.environmentComplianceScore;
		});

		this.getEcsData();

	}

	getEcsData() {

		let reqArr = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getEcsData', reqArr ).subscribe( res => {

			let data = res.body;

			if ( data['results']['enforcementActionData'] ) {

				this.enforcementActionColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'offenderLink', header: 'Offender Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'actionDate', header: 'Action Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'offenceLink', header: 'Offence Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'offenceLegislationTitle', header: 'Offence Legislation Title', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
					{ field: 'offenceActionLink', header: 'Offence Action Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'offenceActionLabel', header: 'Offence Action Label', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'offenceAgencyFunctionLink', header: 'Offence Agency Function Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'offenceAgencyFunctionLabel', header: 'Offence Agency Function Label', minWidth: '250px', maxWidth: '250px', textAlign: 'left' }
				];

				this.enforcementActionData = data['results']['enforcementActionData'];
			}

			if ( data['results']['wasteOperationsData'] ) {

				this.wasteOperationsColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'issuedDate', header: 'Issued Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Rgistration Label', minWidth: '300px', maxWidth: '300px', textAlign: 'left' },
					{ field: 'statusComment', header: 'Status Comment', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'wasteManagementLicenceNumber', header: 'Licence Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }
				];

				this.wasteOperationsData = data['results']['wasteOperationsData'];

			}

			if ( data['results']['waterDischargesData'] ) {

				this.waterDischargesColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'effectiveDate', header: 'Effective Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'revocationDate', header: 'Revocation Date', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'effluentTypeComment', header: 'Comment', minWidth: '200px', maxWidth: '200px', textAlign: 'left' }
				];

				this.waterDischargesData = data['results']['waterDischargesData'];

			}

			if ( data['results']['industrialInstallationData'] ) {

				this.industrialInstallationColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'registrationDate', header: 'Registration Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
					{ field: 'activityComment', header: 'Activity Comment', minWidth: '350px', maxWidth: '350px', textAlign: 'left' },
					{ field: 'activity', header: 'Activity', minWidth: '350px', maxWidth: '350px', textAlign: 'left' }
				];

				this.industrialInstallationData = data['results']['industrialInstallationData'];

			}

			if ( data['results']['wasteExemptionsData'] ) {

				this.wasteExemptionsColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'exemptionExpiryDate', header: 'Exemption Expiry Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'exemptionRegistrationDate', header: 'Exemption Registered Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'exemptionRegistrationType', header: 'Exemption Registered Type', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeNotation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeCodeCategoryPrefLabel', header: 'Exemption Registration Code Label', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeprefLabel', header: 'Exemption Registration Label', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeDescription', header: 'Description', minWidth: '200px', maxWidth: '200px', textAlign: 'left' }
				];

				this.wasteExemptionsData = data['results']['wasteExemptionsData'];

			}

			if ( data['results']['endOfLifeVehiclesData'] ) {

				this.endOfLifeVehiclesColumns = [
					{ field: 'eawmlNo', header: 'EAWML No.', minWidth: '250px', maxWidth: 'none', textAlign: 'left', visible: true },
					{ field: 'eprPermitRef', header: 'Permit Reference', minWidth: '150px', maxWidth: '150px', textAlign: 'left', visible: true },
					{ field: 'dateIssued', header: 'Issued Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true },
					{ field: 'siteName', header: 'Site Name', minWidth: '230px', maxWidth: '230px', textAlign: 'left', visible: true },
					{ field: 'telephone', header: 'Telephone', minWidth: '250px', maxWidth: '250px', textAlign: 'left', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) }
				];

				this.endOfLifeVehiclesData = data['results']['endOfLifeVehiclesData'];

			}

			if ( data['results']['scrapMetalDealersData'] ) {

				this.scrapMetalDealersColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'expiryDate', header: 'Expiry Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registrationTypeLabel', header: 'Registration Type Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' }
				];

				this.scrapMetalDealersData = data['results']['scrapMetalDealersData'];

			}

			if ( data['results']['floodRiskExemptionsData'] ) {

				this.floodRiskExemptionsColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
					{ field: 'registrationTypeNotation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registrationTypePrefLabel', header: 'Registration Type Label', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }
				];

				this.floodRiskExemptionsData = data['results']['floodRiskExemptionsData'];

			}

			if ( data['results']['radioactiveSubstanceData'] ) {

				this.radioactiveSubstanceColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'effectiveDate', header: 'Effective Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'registrationTypeLabel', header: 'Registration Type Label', minWidth: '230px', maxWidth: '230px', textAlign: 'left' }
				];

				this.radioactiveSubstanceData = data['results']['radioactiveSubstanceData'];

			}

			if ( data['results']['wasteCarriersBrokersData'] ) {

				this.wasteCarriersBrokersColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'registrationDate', header: 'Registration Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'expiryDate', header: 'Expiry Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
					{ field: 'registrationTypeLabel', header: 'Registration Type Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
					{ field: 'regimePrefLabel', header: 'Regime Preference Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
					{ field: 'applicantTypeprefLabel', header: 'Application Type Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
					{ field: 'tierLabel', header: 'Tier Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' }
				];

				this.wasteCarriersBrokersData = data['results']['wasteCarriersBrokersData'];

			}

		});

	}

}
