import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { CommonCardArray } from './common-cards.index';

@Component({
	selector: 'dg-export-common-cards',
	templateUrl: './export-common-cards.component.html',
	styleUrls: ['./export-common-cards.component.scss']
})
export class ExportCommonCardsComponent implements OnInit, OnChanges {

	@Input() thisPage: string;
	@Input() editTemplateData: any;
	@Input() successMessage: any;
	@Input() deleteSuccessMessage: any;
	@Input() savedListArray: any;
	@Input() resetCheckbox: any;
	@Input() selectAllCheckBoxCard: any;

	@Output() selectedCardForExport = new EventEmitter<any>();
	@Output() selectedSavedListForExport = new EventEmitter<any>();
	@Output() selectedSheetTypeForExport = new EventEmitter<any>();

	completeSelectAll: boolean = false;
	saveTemplateButton: boolean = false;
	selectedDirectorsDataSelectAll: boolean = false;
	selectedConatctInformationDataSelectAll: boolean = false;
	selectedPSCsDataSelectAll: boolean = false;
	selectedShareholdersDataSelectAll: boolean = false;
	selectedTradingAddressDataSelectAll: boolean = false;
	selectedFinancialDataSelectAll: boolean = false;
	selectedChargesDataSelectAll: boolean = false;
	editCardFields: boolean = false;
	excludeListModel: boolean = false;
	selectListCountBool: boolean = false;
	qualifiedData: boolean = false;

	selectedExportData: Object = {
		personContactInformation:[],
		companyInformation: [],
		directorsInformation: [],
		contactInformation: [],
		pscInformation: [],
		shareholderInformation: [],
		tradingAddressInformation: [],
		financialInformation: [],
		chargesInformation: [],
		diversityAndInclusionInformation: [],
		corporateLandInformation: []
	};
	
	noSpecialCharacterAndNumber: RegExp =  /^[A-Za-z\_\s]+$/;

	savedListOptions: Array<{ listName: string, listId: string }>;

	selectSheetTypeOptions: any[] = [
		{ label: 'Extended', value: 'extended', accessType:[ 'uk', 'ie' ]},
		{ label: 'Compressed', value: 'compressed', accessType:[ 'uk' ]},
		{ label: 'Extended & Qualified Contacts', value: 'qualifiedData', accessType:[ 'uk' ]}
	]

	hideContactInfrmtnField = [ 'directorsEmail', 'directorsLinkedIn', 'telephoneNumber', 'contactCompanyEmail', 'contactCompanyLinkedIn', 'phone', 'ctps', 'ctpsRegistered', 'contactPersonEmail', 'contactPersonLinkedIn' ]

	selectedListCount: any;
	selectedSheetType: any;

	selectedSavedList: any;

	selectAllCheckBox: Object = {
		personContactInformation: false,
		companyInformation: false,
		directorsInformation: false,
		contactInformation: false,
		pscInformation: false,
		shareholderInformation: false,
		tradingAddressInformation: false,
		financialInformation: false,
		chargesInformation: false,
		diversityAndInclusionInformation: false,
		corporateLandInformation: false
	}

	selectedDirectorsData: string[] = [];
	selectedContactInformationData: string[] = [];
	selectedPSCsData: string[] = [];
	selectedShareholdersData: string[] = [];
	selectedChargesData: string[] = [];
	selectedTradingAddressData: string[] = [];
	selectedFinancialData: string[] = [];

	allCheckBoxesForExport: any;
	checkBoxesData: any;
	checkBoxToShow: Array<any>;
	allCheckBoxesData: Array<any> = [];
	allNgModelData: any;
	showInputfield: boolean;
	selectSheetTypeValue: any;
	displayCardColumnArray: Array<any> = [];
	selectedGlobalCountry: string = 'uk';

	/* Variable for export card ----- Start here  */
	selectedItemForExport: object = {};
	showCardDetail: CardParentItemTypes[];
	selectAllCheckBoxForOneCard: object = {};
	selectAllCheckBoxInAllCard: boolean;
	/*-----> End here <---------- */

	constructor(
		public commonService: CommonServiceService,
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private activeRoute: ActivatedRoute

	) { }

	ngOnChanges(changes: SimpleChanges) {
		
		if ( changes.editTemplateData && changes.editTemplateData.currentValue !== undefined && Object.keys( changes.editTemplateData.currentValue ).length ) {

			this.selectedEditField();
		}

		if ( changes.successMessage && changes.successMessage.currentValue && changes.successMessage.currentValue.length && changes.successMessage.currentValue[0].severity == 'success' ||  changes.resetCheckbox && changes.resetCheckbox.currentValue && changes.resetCheckbox.currentValue == true  ) {

			// this.resetSelectedFields();
			this.exportCardItemRender( this.selectedSheetType.value );

		}

		if ( changes.deleteSuccessMessage && changes.deleteSuccessMessage.currentValue && changes.deleteSuccessMessage.currentValue.length && changes.deleteSuccessMessage.currentValue[0].summary == 'Template deleted successfully' ) {

			// this.resetSelectedFields();
			this.exportCardItemRender( this.selectedSheetType.value );

		}
		this.selectAllCheckBoxInAllCard = this.selectAllCheckBoxCard;

	}
	
	ngOnInit() {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		// this.getAllCheckBoxes( [ 'companyInformation', 'contactInformation' ] );

		if ( this.excludeListModel == false ) {
			this.selectedSavedListForExport.emit(this.selectedSavedList);
		}
		
		this.selectedSheetType = this.selectSheetTypeOptions[0];
		this.exportCardItemRender( this.selectedSheetType.value );
		this.selectedSheetTypeForExport.emit(this.selectedSheetType); 
	}

	/*👉__>>>>>>>>>>>>>>>>>>>>CODE START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

	//👉 Triggre:- when change the sheet type
	exportCardItemRender( screenView: SheetType, selectedAll: boolean = false ) {

		this.showCardDetail = [];
		let accountType = JSON.parse( localStorage.getItem('types') )[0];
		let allCardItemArray: CardParentItemTypes[] = JSON.parse(JSON.stringify( CommonCardArray ));

		allCardItemArray = allCardItemArray.filter(item => item.countryAccess.some(country => this.selectedGlobalCountry.includes(country)));

		allCardItemArray = allCardItemArray.filter( ( cardItem ): any  => {
			if ( cardItem.accountAccess.includes( accountType ) || this.userAuthService.hasAddOnPermission( cardItem.addonType ) ) {
				return cardItem;
			}
		});

		allCardItemArray = allCardItemArray.filter( cardItem => cardItem.screenAccess.includes( this.thisPage as pageType ) );

		this.selectedItemForExport = {};
		this.selectAllCheckBoxForOneCard = {};

		for ( let val of allCardItemArray ) {
			
			if ( val.view.includes( screenView ) ) {
				let valItem = val.cardItem.filter(item => item.countryAccess.some(country => this.selectedGlobalCountry.includes(country)));
				val['cardItem']  = this.checkSelectedItem( valItem, screenView );
		
				if (  !val['cardItem'].length ) {
					continue;
				}

				if ( selectedAll ) {

					if ( val?.connectedItem ) {
						this.checkDisableInCaseOfSelection( val?.connectedItem, val['cardItem'], selectedAll );
					}
					this.selectedItemForExport[ val.cardKey ] = val['cardItem'];
					this.selectAllCheckBoxForOneCard[ val.cardKey ] = true;
				}

				this.showCardDetail.push( val );

			}	
			
		}

		this.selectedCardForExport.emit( this.selectedItemForExport );

	}

	//👉check by default condition of checkboxes 
	checkSelectedItem( cardItemsArray: Array<CardChildItemTypes>, screenView: SheetType ) {

		let filteredCardItemsArray: Array<CardChildItemTypes> = [];
		
		// cardItemsArray.filter( res => {
		// 	if ( res?.view.includes( screenView ) ) {

		// 		if ( this.thisPage == 'showContactScreen' ) {
		// 			if ( ['status', 'contactDirectorsName', 'contactPersonEmail'].includes(res.key) ) {
		// 				res.defaultSelected = true;
		// 				res.disabled = true;
		// 			}

		// 		}

		// 		if ( res?.defaultSelected ) {

		// 			if ( this.selectedItemForExport.hasOwnProperty( res.cardName ) ) {
		// 				this.selectedItemForExport[ res.cardName ].push( res );
		// 			} else {
		// 				this.selectedItemForExport[ res.cardName ] = [ res ];
		// 			}

		// 		}

		// 		filteredCardItemsArray.push(res);
		// 	}

		// } );

		for ( let res of cardItemsArray ) {
			if ( res?.view.includes( screenView ) ) {

				if ( this.thisPage == 'showContactScreen' ) {
					if ( ['status', 'contactDirectorsName', 'contactPersonEmail'].includes(res.key) ) {
						res.defaultSelected = true;
						res.disabled = true;
					}

					if ( res.key == 'contactRole' ) {
						continue;
					}
				}

				if ( res?.defaultSelected ) {

					if ( this.selectedItemForExport.hasOwnProperty( res.cardName ) ) {
						this.selectedItemForExport[ res.cardName ].push( res );
					} else {
						this.selectedItemForExport[ res.cardName ] = [ res ];
					}

				}

			    filteredCardItemsArray.push(res);
			}
		}

		return filteredCardItemsArray;

	}

	//👉 Trigger:- when we select/unselect one iten from card
	onSelectedItemFromCard( cardArray: CardParentItemTypes, selectedItem?: CardChildItemTypes ) {

		const { cardKey, connectedItem, cardItem } = cardArray;

		for ( let key in this.selectedItemForExport ) {
			if ( !this.selectedItemForExport[ key ].length ){
				delete this.selectedItemForExport[ key ];
			}
		}

		if ( selectedItem?.childItem ) {

			let checkDependentItem = this.selectedItemForExport[ cardKey ]?.map( val => val.key ).includes( selectedItem?.childItem[ 'key' ] ) || false;

			let contactNameField = cardItem.find( val => val.key = selectedItem?.childItem[ 'key' ] );

			if ( !checkDependentItem ) {
				contactNameField.disabled = true;
				this.selectedItemForExport[ cardKey ].push( contactNameField )
			}
			
			// >>>>>> Don't remove this code <<<<<<<<<<<<<<<<<<<<
			
			if ( checkDependentItem ) {
				let chekParentItem = this.selectedItemForExport[ cardKey ]?.filter( res => connectedItem[ selectedItem?.childItem[ 'key' ] ].includes( res.key ) );
				if ( !chekParentItem.length ) {
					contactNameField.disabled = false;
					this.selectedItemForExport[ cardKey ] = this.selectedItemForExport[ cardKey ]?.filter( val => val.key != selectedItem?.childItem[ 'key' ] );
				} else {
					contactNameField.disabled = true;
				}
			}

			this.selectedCardForExport.emit( this.selectedItemForExport );

		}
		this.selectedCardForExport.emit( this.selectedItemForExport );
		
		//check the all the card items selected if selected then checked all button checked otherwise unchecked
		if ( this.selectedItemForExport[ cardKey ] && ( this.selectedItemForExport[ cardKey ].length ==  cardItem.length ) ) {
			this.selectAllCheckBoxForOneCard[ cardKey ] = true;
		} else {
			this.selectAllCheckBoxForOneCard[ cardKey ] = false;
		}

		if ( !this.selectAllCheckBoxForOneCard[ cardKey ] ) {
			delete this.selectAllCheckBoxForOneCard[ cardKey ];
		}


		//check all the card selected or not
		this.checkAllItemsSelection( Object.keys( this.selectAllCheckBoxForOneCard ).length );
	}

	//👉 Triggre:- Select/unselect All Items in one card by one click
	selectAllItemInCard( columnData, cardKey ) {

		const { cardItem, connectedItem } = columnData;

		
		if ( connectedItem ) {
			this.checkDisableInCaseOfSelection( connectedItem, cardItem, this.selectAllCheckBoxForOneCard[ cardKey ] );
		}

		if ( this.selectAllCheckBoxForOneCard[ cardKey ] ) {
			this.selectedItemForExport[ cardKey ] = cardItem;
		} else {
			this.selectedItemForExport[ cardKey ] = [];
			delete this.selectAllCheckBoxForOneCard[ cardKey ];
			this.checkSelectedItem( cardItem, this.selectedSheetType.value )
		}

		//when no item selected in card then delete the key from object
		if ( !this.selectedItemForExport[ cardKey ].length ) {
			delete this.selectedItemForExport[ cardKey ];
		}
		
		this.selectedCardForExport.emit( this.selectedItemForExport );
	
		this.checkAllItemsSelection( Object.keys( this.selectAllCheckBoxForOneCard ).length );

	}

	//👉 Triggre:- Select/Unselect all the items by one click in all cards.
	selectAllCardsItems() {
		this.exportCardItemRender( this.selectedSheetType.value, this.selectAllCheckBoxInAllCard );
	}

	//Check All items selected or not;
	checkAllItemsSelection( selectionLength ) {
		if ( selectionLength == Object.keys( this.showCardDetail ).length ) {
			this.selectAllCheckBoxInAllCard = true;
		} else {
			this.selectAllCheckBoxInAllCard = false;
		}
	}

	checkDisableInCaseOfSelection( connectedItem, cardItem, disableCheck ) {
		let keyForDisabled = Object.keys( connectedItem )[0];
		let contactNameField = cardItem.find( val => val.key == keyForDisabled );
		if ( contactNameField ) {
			contactNameField.disabled = disableCheck;
		}
	}

	/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>CODE END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */
	
	selectedEditField() {
		// this.resetSelectedFields()
		this.exportCardItemRender( this.selectedSheetType.value );	

	}

	getInputField( field, inputbool ) {
		
		if( inputbool == true ) {
			field.editInput = false;
		} else {
			field.editInput = true;
		}

	}

	getSelectedList() {
		
		this.selectedSavedListForExport.emit(this.selectedSavedList);

		if( this.selectedSavedList && this.selectedSavedList.length == 0 ) {
			this.excludeListModel = false;
			// this.selectListCountBool = false;
		}
		if( this.selectedSavedList && this.selectedSavedList.length > 0 ) {
			this.excludeListModel = true;
			// this.selectListCountBool = false;
		}

	}

	getListCount() {
		
		this.selectedSavedList = [];
		this.savedListOptions = [];

		if (!this.excludeListModel){
			this.selectListCountBool = false;
		} else {
			this.selectListCountBool = true;
			if (this.savedListArray) {
	
				for (let savedList of this.savedListArray) {

					this.savedListOptions.push({ listName: savedList.listName, listId: savedList._id });

					if ( savedList.listName == 'Exported Bucket' ) {

						this.selectedSavedList.push({ listName: savedList.listName, listId: savedList._id });

						this.selectedSavedListForExport.emit(this.selectedSavedList);
					}

				}

				this.savedListOptions = this.savedListOptions.filter( val => val.listId != this.activeRoute.snapshot.queryParams.cListId );

			} 
		}	
	}

	getSelectedSheetTypeValue(item) {

		this.exportCardItemRender( item.value );
		this.selectedSheetTypeForExport.emit(this.selectedSheetType); 
		this.selectAllCheckBoxInAllCard = false;
	}

}
