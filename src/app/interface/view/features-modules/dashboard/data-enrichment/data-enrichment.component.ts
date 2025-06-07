import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Config } from '@fortawesome/fontawesome-svg-core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { CommonCardArray } from '../../../shared-components/shared-tables/export-common-cards/common-cards.index';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { debounceTime, Subject } from 'rxjs';
import { Listbox } from 'primeng/listbox';

@Component({
  selector: 'dg-data-enrichment',
  templateUrl: './data-enrichment.component.html',
  styleUrls: ['./data-enrichment.component.scss']
})
export class DataEnrichmentComponent implements OnInit {
    @ViewChild('fileUploader', { static: false }) fileUpload: FileUpload;
    @ViewChild('saveInFilterForm', { static: false }) saveInFilterForm: NgForm;
    @ViewChild('listBox') listBox!: Listbox;
    
	titleHeader: string = 'Position'
    items: MenuItem[];
	targetProducts: Array<any> = [];
	selctedHeaderArray: Array<any> = [];
    emailConfirmation: boolean = true;
	selectedListName: string = '';
	selectedFile: File;
    showDialog: boolean = false;
    isToggle: boolean = false;
    showDialogPosition: boolean = false;
    displayModal: boolean = false;
    saveDialog: boolean = false;
    positionTemplateDialog: boolean = false;
	template_name: string;
	templateJsonData: Array<any> = []
	first: number = 0;
	rows: number = 25;

    selectColumnDialog: boolean = false;
    headers: Array<any> = [];
    headerDropdownNgModel: Array<any> = [];
    columnData: Array<any> = [];
    positionValues: Array<any> = [];
    listArrayData: Array<any> = [];
	selectedList: any = null;
    tableData: Array<{}> = [];
    showCardDetail: Array<{}> = [];
    cardItem: Array<{}> = [];
    filterNameData: string = '';
    active = 0
	msgs = [];
	searchTerm: string = '';
    totalSize: number;
    totalSizePercent: number;
    files: any;
    selectAllCheckBoxForOneCard: object = {};
    selectedItemForExport: object = {};
	selectedTemplate: any = undefined;
	selectAllCheckBoxInAllCard: boolean;
    selectedSheetType: any;
    // isToggle = 'false' //intentionally put false in string.
	headerMappingFormData = new FormData();
	private searchSubject = new Subject<string>();
    constructor(
            private userAuthService: UserAuthService,
			private globalServerCommunicate: ServerCommunicationService,
			
    ){
		this.searchSubject.pipe(debounceTime(800)).subscribe((searchTerm) => {
			this.getPosition(searchTerm);
		  });
	}


    dropdownOptionsArray: Array<any> = [
		{ value: 'None', label: 'None', inactive: false },
		{ value: 'Name', label: 'Name', inactive: false },
		{ value: 'Company Registration Number', label: 'Company Registration Number', inactive: false }
	];
    tableColumn = [
        { field: 'user_file_name', header: 'File Name', minWidth: '320px', maxWidth: 'none', textAlign: 'left' },
        { field: 'status', header: 'Status', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
        { field: 'fileType', header: 'File Type', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
        { field: 'action', header: 'Action', minWidth: '250px', maxWidth: '250px', textAlign: "center" },
    ]
	templateJsonCols = [
		{ field: 'downloadTemplate', header: 'Action', minWidth: '80px', maxWidth: '80px', textAlign: 'center' },
		{ field: 'templateName', header: 'Template Name', minWidth: '320px', maxWidth: '320px', textAlign: 'left' },
		{ field: 'contactPosition', header: 'Fields', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
		// { field: 'deleteTemplate', header: 'Action', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
	];

    ngOnInit() {

		this.getTableResult();

        this.items = [
            { label: 'Upload CSV / Choose List' },
            { label: 'Provide a list name' },
            { label: 'Set Position' },
            { label: 'Select Column' },
            { label: 'Submit' }
        ];
    }
    
    onSelectedFile( event ) {   
  
      this.resetDisableOptions();
      this.active = 0;
      const file = event.files[0];
  
      if (!(CustomUtils.isNullOrUndefined( file ))) {
  
        this.selectedListName = file?.name;
        this.selectedFile = file;
  
        const fileReader = new FileReader();
  
        fileReader.onload = (e) => {
  
          const holdCSV = fileReader.result as string;
          const lines = holdCSV.split('\n');
          const firstTenLines = lines.slice(0, 10).join('\n');
  
          this.preparedObjectForHeader( firstTenLines );
          this.showDialog = true;
          this.fileUpload.files = [];
  
        }
        fileReader.readAsText( file );
  
      }
  
    }

	pageChange(event){
		this.first = event.first;
		this.rows = event.rows;
	}

	uploadList(event?) {
        
		this.displayModal = true;
		this.listArrayData = [];
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getListForDataEnrichment' ).subscribe( res => {
            if( res.status == 200) {
                this.listArrayData = [];
                this.listArrayData = res.body.result;
            } else {
                this.listArrayData = []
            }
			
		});
	}

	confirmSelection() {
		if (this.selectedList) {
		  	this.displayModal = false;
		  	this.filterNameData = this.selectedList?.listName + '.csv';
			this.saveDialog = true;
			this.active = 1;	  
		} else {
		  alert('Please select a list');
		}
	}

	searchByKey(event: any){
		let searchKey = event?.target?.value
		this.searchSubject.next(searchKey);
		this.uploadList(searchKey)

	}

    updateInactivityForFinancialKeyDropdown( seletedOptionItem ) {

		if ( seletedOptionItem.ngModel == 'None' ) {
			setTimeout( () => {
				seletedOptionItem.ngModel = '';
			}, 10 )
		}
		this.selctedHeaderArray = this.headerDropdownNgModel.map( val => val.ngModel ).filter( item => item != '' && item != 'None' );

		this.resetDisableOptions( this.selctedHeaderArray );

	}

    resetDisableOptions( headerArr: Array<any> = [] ) {

		this.dropdownOptionsArray.map( item => {
			if ( headerArr.includes( item.value ) ) {
				setTimeout(() => {
					item.inactive = true;
				}, 100);
			} else {
				item.inactive = false;
			}
		} )

	}

    preparedObjectForHeader( inputString ) {

		let lines = []
		if ( inputString.includes( '\r' ) ) {
			lines = inputString.split("\r\n");
		} else {
			lines = inputString.split("\n");
		}
		this.headers = lines.shift().split(",");

		
		this.headerDropdownNgModel = [];
		this.columnData = [];

		this.headers.map( val => {
			this.headerDropdownNgModel.push( { header: val, ngModel: '' } )
		} )

		lines.slice(0,10).forEach(line => {
			const test = line.split(",").filter( val => !val.includes( '\"' ) );

			if ( test.length == this.headers.length ) {
				this.columnData.push( test )
			}

		});
    }

	positionToggle(){
		
		this.positionValues = [];
		this.searchTerm = '';
		this.targetProducts = [];
		this.getPosition();
		this.getTableResult();

	}

	createTemplate(){
		this.positionTemplateDialog = false;

		let payload = {
			"contactPosition": this.targetProducts.map(item => item.key),
			"isSeniorPosition": this.isToggle,
			"templateName": this.template_name
		}

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'saveTemplateDataEnrichment', payload ).subscribe({
			next: ( res ) => {
				if( res.status == 200 ){
					this.msgs = []
					this.msgs.push({ severity: 'success', summary: res.body.message });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
					this.exportCardItemRender();
					this.active = 3;
					this.searchTerm = '';
					this.showDialogPosition = false;
					this.selectColumnDialog = true;
					this.positionTemplateDialog = false;
					
				}
			},
			error: ( err ) => {		
				console.log(err);
				this.msgs = []
				this.msgs.push({ severity: 'error', summary: err.body.message });
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
				this.positionTemplateDialog = false;	
			}
	})
	}

	positionTemplateValue(){
		
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_API', 'fetchTemplateDataEnrichment' ).subscribe({
			next: ( res ) => {
				this.templateJsonData = res.body.data;
				
			},
			error: ( err ) => {		
			}
		});
	}

    setHeaders() {
        this.showDialog = false;
        this.filterNameData = this.selectedListName;
        this.saveDialog = true;
        this.active = 1;
	}

    saveInFile(formData: NgForm) {
		this.selectedListName = formData.form.value.filename
        this.active = 2;
        this.saveDialog = false;
        this.showDialogPosition = true;
		this.getPosition();
		this.positionTemplateValue();
    }

	getPosition( searchKey? ){
		let payload = {
			"userId": this.userAuthService?.getUserInfo('dbID'),
			"searchText": searchKey ? searchKey : '',
			"reqBy": "personLinkedIn",
			"isToggle": this.isToggle
		}
		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'searchPositionsPersonLinkedIn', payload ).subscribe({
				next: ( res ) => {
					this.positionValues = [];
					setTimeout(() => {
						this.positionValues = res.body?.aggregatedPositions || [];
						this.positionValues = this.positionValues.splice(0, 500);
					}, 100);
				},
				error: ( err ) => {		
					this.positionValues = [];
				}
		})
	}
	
    moveToTarget( event ) {
		if ( this.targetProducts.length > 12 ) {
			this.positionValues.push(event.items[0]);
			this.targetProducts.splice(this.targetProducts.indexOf(event.items[0]), 1);			
		}

		this.selectedTemplate = undefined;
	}

    dataFetchFromApi() {
		this.exportCardItemRender();
        this.active = 3;
		this.searchTerm = '';
		this.showDialogPosition = false;
		this.selectColumnDialog = true;
		this.positionTemplateDialog = false;
	}

    closeAllDilog() {
        if (this.listBox) {
            this.listBox.filterValue = '';
        };
        this.displayModal = false;
		this.active = 0;
        this.showDialog = false;
        this.saveDialog = false;
        this.showDialogPosition = false;
        this.selectColumnDialog = false;
		this.selctedHeaderArray = [];
		this.searchTerm = '';
		this.targetProducts = [];
		this.selectedItemForExport = {};
		this.isToggle = false;
		this.template_name = '';
		this.selectedTemplate = undefined;
    }

    resetTable() {
        this.closeAllDilog();
        this.getTableResult();
    }

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
			this.checkSelectedItem( cardItem )
		}
		if ( !this.selectedItemForExport[ cardKey ].length ) {
			delete this.selectedItemForExport[ cardKey ];
		}
	
		this.checkAllItemsSelection( Object.keys( this.selectAllCheckBoxForOneCard ).length );

	}

    checkDisableInCaseOfSelection( connectedItem, cardItem, disableCheck ) {
		let keyForDisabled = Object.keys( connectedItem )[0];
		let contactNameField = cardItem.find( val => val.key == keyForDisabled );
		if ( contactNameField ) {
			contactNameField.disabled = disableCheck;
		}
	}

    checkAllItemsSelection( selectionLength ) {
		if ( selectionLength == Object.keys( this.showCardDetail ).length ) {
			this.selectAllCheckBoxInAllCard = true;
		} else {
			this.selectAllCheckBoxInAllCard = false;
		}
	}

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
			
			if ( checkDependentItem ) {
				let chekParentItem = this.selectedItemForExport[ cardKey ]?.filter( res => connectedItem[ selectedItem?.childItem[ 'key' ] ].includes( res.key ) );
				if ( !chekParentItem.length ) {
					contactNameField.disabled = false;
					this.selectedItemForExport[ cardKey ] = this.selectedItemForExport[ cardKey ]?.filter( val => val.key != selectedItem?.childItem[ 'key' ] );
				} else {
					contactNameField.disabled = true;
				}
			}

		}
		if ( this.selectedItemForExport[ cardKey ] && ( this.selectedItemForExport[ cardKey ].length ==  cardItem.length ) ) {
			this.selectAllCheckBoxForOneCard[ cardKey ] = true;
		} else {
			this.selectAllCheckBoxForOneCard[ cardKey ] = false;
		}

		if ( !this.selectAllCheckBoxForOneCard[ cardKey ] ) {
			delete this.selectAllCheckBoxForOneCard[ cardKey ];
		}
		this.checkAllItemsSelection( Object.keys( this.selectAllCheckBoxForOneCard ).length );
	}

    checkSelectedItem( cardItemsArray: Array<CardChildItemTypes>) {

		let filteredCardItemsArray: Array<CardChildItemTypes> = [];
		
		for ( let res of cardItemsArray ) {

				if ( res?.defaultSelected ) {

					if ( this.selectedItemForExport.hasOwnProperty( res.cardName ) ) {
						this.selectedItemForExport[ res.cardName ].push( res );
					} else {
						this.selectedItemForExport[ res.cardName ] = [ res ];
					}

				}

			    filteredCardItemsArray.push(res);
			
		}

		return filteredCardItemsArray;

	}
    exportCardItemRender( selectedAll: boolean = false ) {

		this.showCardDetail = [];
		let allCardItemArray: CardParentItemTypes[] = JSON.parse(JSON.stringify( CommonCardArray ));
		this.cardItem = allCardItemArray.filter(val => ['Company', 'Key Financials'].includes(val.cardHeader));
		this.cardItem = this.cardItem.map(cards => ({
			...cards,
			cardItem: cards?.['cardItem'].filter(item => !['financialDatalatestYear', 'noOfEmployees'].includes(item.key))
		}));

		allCardItemArray = allCardItemArray;

		this.selectedItemForExport = {};
		this.selectAllCheckBoxForOneCard = {};

		for ( let val of allCardItemArray ) {
			
				let valItem = val.cardItem;
				val['cardItem']  = this.checkSelectedItem( valItem );
		
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

    processStart(){

		// this.isToggle = 'true';

		let obj = {}
		this.headerDropdownNgModel.forEach(item => {
			if ( item.ngModel ) {
				obj[item.header] = item.ngModel;
			}
		});
		this.targetProducts = this.targetProducts.map( a => a.key);

		if ( this.selectedTemplate ) {
			this.targetProducts = this.selectedTemplate['contactPosition'];
			this.isToggle = this.selectedTemplate['isSeniorPosition'];
		}
		
		let userId: string = this.userAuthService?.getUserInfo('dbID') as string;
		const jsonString: string  = JSON.stringify(obj, null, 2) ;

		let payload = new FormData();
		if( this.selectedList?.listId ) {
			payload.append( 'listId', this.selectedList?.listId )
		}else {
			payload.append( 'file', this.selectedFile )
		}
		payload.append( 'file_name', this.selectedListName )
		payload.append( 'directorEmailConfirmation', JSON.stringify(this.emailConfirmation) )
		payload.append( 'additionalColumns', JSON.stringify(this.transformColumns(this.selectedItemForExport)) )
		payload.append( 'contactPositions', JSON.stringify(this.targetProducts) )
		payload.append( 'mappings', jsonString )
		payload.append( 'userId', userId )
		payload.append( 'isToggle', JSON.stringify(this.isToggle) )

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'enrichData', payload ).subscribe({

			next: ( res ) => {			
				if( res.status == 200) {
					this.msgs = []
					this.msgs.push({ severity: 'success', summary: res.body.message });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				} else {
					this.msgs = []
					this.msgs.push({ severity: 'error', summary: res.body.message });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				} 
				
			},
			error: ( err ) => {		
				if ( err.status == 403 ) {
					this.msgs = []
					this.msgs.push({ severity: 'info', summary: err.error.message });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				} else {
					this.msgs = []
					this.msgs.push({ severity: 'error', summary: err.error.message });
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				}
				this.active = 4;
				this.selectColumnDialog = false;
				this.emailConfirmation= true;
				this.selectedItemForExport = {};
				this.targetProducts = [];
				this.selctedHeaderArray = [];
				this.searchTerm = '';
				this.active = 0;
				this.isToggle = false;
				this.template_name = '';
				this.selectedTemplate = undefined;
			},
			complete: () => {
				this.active = 4;
				this.selectColumnDialog = false;
				this.emailConfirmation= true;
				this.selectedItemForExport = {};
				this.targetProducts = [];
				this.selectedTemplate = undefined;
				this.selctedHeaderArray = [];
				this.searchTerm = '';
				this.isToggle = false;
				this.template_name = '';
				this.active = 0;
				setTimeout(() => {
					this.getTableResult();
				}, 5000);
			}
		})
    }

	transformColumns(data) {
		let newObject = {};
		
		for (let section in data) {
		  newObject[section] = data[section].map(item => ({
			key: item.key,
			header: item.header
		  }));
		}
		return newObject;
	}

	filterByPosition(event: any){
		const searchTerm = event.target?.value;
		this.searchSubject.next(searchTerm);
	}

	getTableResult(){
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getDataEnrichmentLists' ).subscribe({
            next: ( res ) => {
                if(res.status == 200 ){
                    this.tableData = []
                    this.tableData =  res.body.result;
                }
            },
            error: ( err ) => {		
                console.log(err);
            }
		})
	}

	downloadUserExportList(rowData, fileType) {
		var downloadURL = fileType == 'input' ? rowData?.input_file_url : rowData?.output_file_url;
		var link = document.createElement('a');
		link.href = downloadURL;
		link.download = fileType == 'input' ? rowData?.user_file_name : rowData?.output_filename;
		link.click();
	}

	onRadioSelect() {
		this.targetProducts = [];
	}

	onSubmit() {
		if ( !this.selectedTemplate ) {
			this.positionTemplateDialog = true
		} else {
			this.dataFetchFromApi();
		}

	}

}