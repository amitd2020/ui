import { Component, ElementRef, ViewChild } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'dg-prompt-search-ai',
	templateUrl: './prompt-search-ai.component.html',
	styleUrls: ['./prompt-search-ai.component.scss']
})

export class PromptSearchAiComponent {

	inputValue: string = '';
	companyData: any[] = [];
	recordTableCols: any[];
    searchTotalCount: any = 0;
	inputToken: number;
	outputToken: number;
	userPrompt: string;
	generatedElasticQuery: any;
	visible: boolean = false;
	msgs: any[] = [];
	typeForQuery: string;
	inputPrompt: any;
	visibleInputToken: boolean = false;
	paginatedArray: any[] = [];
	queryId: string;
	chatId: string;
	responseAI: any;


	chatHistory: { user: string; aiFullLines: string[]; aiVisibleLines: string[] }[] = [];
	userInput: string = '';
	@ViewChild('scrollContainer') scrollContainer!: ElementRef;
	
	constructor(
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private activatedRoute: ActivatedRoute,
		private commonServiceService: CommonServiceService,

		private http: HttpClient
	) {}

	ngOnInit() {

		this.recordTableCols = [
			// { field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', minWidth: '200px', maxWidth: 'none', textAlign: 'left', value: true, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: true},
            { field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '350px', maxWidth: '350px', textAlign: 'left', value: true, sortOrder: 1, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: true },
            // { field: 'otherFeatures', header: 'Features', colunName: 'Features', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true, sortOrder: 3, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
            // { field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', minWidth: '160px', maxWidth: '160px', textAlign: 'center', value: true, sortOrder: 5, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
            // { field: 'internationalScoreDescription', header: 'Risk Band', colunName: 'Risk Band', minWidth: '260px', maxWidth: '260px', textAlign: 'center', value: true, sortOrder: 9, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
            // { field: 'numberOfEmployees', header: 'No. of Employees', colunName: 'No. of Employees', minWidth: '160px', maxWidth: '160px', textAlign: 'right', value: false, sortOrder: 19, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
            // { field: 'numLandCorporate', header: 'Property Owned Count', colunName: 'Property Owned Count', minWidth: '200px', maxWidth: '200px', value: true, textAlign: 'right', visible: true, countryAccess: [ 'uk'  ], isSortable: false },
            // { field: 'latestFinancialYear', header: 'Latest Financial Year', colunName: 'Latest Financial Year', minWidth: '160px', maxWidth: '160px', value: true, textAlign: 'right', visible: true, countryAccess: [ 'uk'  ], isSortable: false },
            // { field: 'companyAge', header: 'Company Age', colunName: 'Age', minWidth: '160px', maxWidth: '160px', textAlign: 'right', value: true, sortOrder: 11, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
            { field: 'sicCode07', header: 'SIC Code', colunName: 'SIC Code', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true, sortOrder: 14, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
            { field: 'industryTag', header: 'Industry', colunName: 'Industry', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true, sortOrder: 15, visible: true, countryAccess: [ 'uk' ], isSortable: false }
        ];

		const { searchedPrompt } = this.activatedRoute?.snapshot?.queryParams;
		if ( searchedPrompt ) {
			this.inputValue = searchedPrompt;
			this.triggredKeywordSearch();
		};
	}

	triggredKeywordSearch() {
		this.sharedLoaderService.showLoader();

		let payload = {
			"userQuery": this.inputValue,
			"chatId": this.chatId
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG-PROMPT-AI', 'DG_PROMPT_QUERY', payload ).subscribe(res => {
			if ( res['status'] == 200 || res['body']['status'] == 200 ) {				
				
				if ( res['body']['results'] && Object.keys(res['body']['results']).length ) {
					let storeData = res['body']?.['results']?.['hits'].map( item => {
						return item._source
					} );
					this.searchTotalCount = res['body']?.['results']?.['total']?.['value'];

					this.companyData = this.formatData(storeData)



				} else {
					this.companyData = [];
					this.searchTotalCount = 0;
				}
				
				this.userPrompt = res['body']?.['userPrompt'];
				this.generatedElasticQuery = res['body']?.['generatedElasticQuery'];
				this.typeForQuery = typeof this.generatedElasticQuery;
				this.inputToken = res['body']?.['inputTokens'];
				this.outputToken = res['body']?.['outputTokens'];
				this.inputPrompt = res['body']?.['inputPrompt'];
				this.paginatedArray = res['body']?.['pagination'];
				this.queryId = res['body']?.['queryId'];
				this.chatId = res['body']['chatId'];
				this.responseAI = (res['body']?.['converstaionHistory']).sort();
				this.sharedLoaderService.hideLoader();
			}
			
		}, err => {
			this.companyData = [];
			this.searchTotalCount = 0;
			this.userPrompt = '';
			this.generatedElasticQuery = '';
			this.inputToken = 0;
			this.outputToken = 0;
			this.sharedLoaderService.hideLoader();
		})
		this.inputValue = '';
	}

	formatData( companiesData ) {

        let tempCompaniesData = [];
        companiesData?.forEach( companyData => {

            companyData["latestFinancialYear"] = '';

            if ( companyData["statutoryAccounts"] ) {

                companyData["latestFinancialYear"] =  companyData.statutoryAccounts[0]?.['yearEndDate'] && companyData.statutoryAccounts[0]?.['yearEndDate'].split("/").pop() || '';

            }

			if (companyData.statutoryAccounts && companyData.statutoryAccounts?.[0].numberOfEmployees) {
				companyData['numberOfEmployees'] = parseInt(companyData.statutoryAccounts[0].numberOfEmployees);
			}

			tempCompaniesData.push(companyData)

        });

        return (tempCompaniesData);

    }
	
	updateTableAfterPagination( event ) {
		this.fetchTableResults( event.pageSize, event.startAfter, event.page );
	}
	
	fetchTableResults( pageSize, startAfter, page ) {
		this.sharedLoaderService.showLoader();

		let payloadForTableResponse = {
			queryId: this.queryId,
			from: startAfter ? startAfter : 0,
			size: pageSize ? pageSize : 25
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG-PROMPT-AI', 'fetchMore', payloadForTableResponse ).subscribe( {
			next: ( res ) => {
				if ( res['status'] == 200 || res['body']['status'] == 200 ) {
					let tempStoreData = res['body']?.['results']?.['hits'].map( item => {
						return item._source;
					} );

					this.companyData = this.formatData(tempStoreData)

					this.sharedLoaderService.hideLoader();
				}
			},
			error: ( err ) => {
				this.companyData = [];
				this.msgs = [ { severity: 'error', detail: 'Error in fetching table results' } ];

					setTimeout(() => {
						this.msgs = [];
					}, 1000);
				console.log('Error in fetching table results', err);
				this.sharedLoaderService.hideLoader();
			}
		})
	}

	async copyResponseData() {

		let response, responseString, regex, match;
		response = this.generatedElasticQuery;

		if ( this.typeForQuery == 'object' ) {
			responseString = JSON.stringify(response);
			regex = /\{.*\}/s;
			match = responseString.match(regex);

		} else {
			regex = /\`\`\`([\s\S]*?)\`\`\`/;
			match = response.match(regex);
		}

		if ( match ) {
			const jsonString = this.typeForQuery == 'object' ? match[0] : match[1].trim(); 
			const query = JSON.parse(jsonString);

			await navigator.clipboard.writeText( JSON.stringify(query, null, 2) );
			this.msgs = [ { severity: 'success', detail: 'Query copied' } ];

			setTimeout(() => {
				this.msgs = [];
			}, 1000);

		} else {

			this.msgs = [ { severity: 'error', detail: 'No valid JSON found in the response' } ];
			setTimeout(() => {
				this.msgs = [];
			}, 1000);
		} 
    }

}
