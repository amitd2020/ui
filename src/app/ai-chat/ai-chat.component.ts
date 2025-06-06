import { Component } from '@angular/core';
import { ServerCommunicationService } from '../interface/service/server-communication.service';

@Component({
    selector: 'dg-ai-chat',
    templateUrl: './ai-chat.component.html',
    styleUrls: ['./ai-chat.component.scss'],
})
export class AiChatComponent {
    response: Array<any> = [];
    showCompanies = false;
    chatId: string = '';
    chatHistory: {
        user: string;
        aiFullLines: string[];
        aiVisibleLines: string[];
        companyStore?: object
    }[] = [];
    searchTotalCount: any = 0;
	companyDataHandler: object = {};
    visible: boolean = false;
	queryId: string;

    recordTableCols = [
        { field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '350px', maxWidth: '350px', textAlign: 'left', value: true, sortOrder: 1, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: true },
        { field: 'sicCode07', header: 'SIC Code', colunName: 'SIC Code', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true, sortOrder: 14, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false },
        { field: 'industryTag', header: 'Industry', colunName: 'Industry', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true, sortOrder: 15, visible: true, countryAccess: [ 'uk' ], isSortable: false }
    ];

    constructor(
		private globalServerCommunication: ServerCommunicationService
    ) {}

    async onPromptSubmit(prompt: string) {
        let payload = {
            userQuery: prompt,
            chatId: this.chatId,
        };

        this.globalServerCommunication.globalServerRequestCall('post', 'DG-PROMPT-AI', 'DG_PROMPT_QUERY', payload ).subscribe( async res => {
        	if ( res['status'] == 200 || res['body']['status'] == 200 ) {

        		const conversationHistory = res['body']['converstaionHistory'];
        		this.chatId = res['body']['chatId'];
                this.queryId = res['body']?.['queryId'];

        		if (conversationHistory?.length) {
        			const latest = conversationHistory[conversationHistory.length - 1];

        			const aiText = latest.ai;
        			const lines = aiText.split('\n').filter(line => line.trim() !== '');

                    let storeData = res['body']?.['results']?.['hits'].map( item => {
						return item._source
					} );

                    this.searchTotalCount = res['body']?.['results']?.['total']?.['value'];

        			const newChat = {
        				user: prompt,
        				aiFullLines: lines,
        				aiVisibleLines: [],
                        companyStore: {
                            companyData: this.formatData(storeData),
                            searchTotalCount: this.searchTotalCount,
                            chatId: this.chatId,
                            queryId: this.queryId
                        }
        			};

        			this.chatHistory.push(newChat);

        			await this.animateLines(this.chatHistory.length - 1);
        			this.response = [...this.chatHistory];
        		}
        	}

        }, err => {
        	console.log('>>>', err)
        })



        // const aiText = `Hi there!\nYou've successfully tracked companies.\nTotal results: 245\nCity: Edinburgh\nStatus: Large Enterprise`;

        // const lines = aiText.split('\n').filter((line) => line.trim() !== '');

        // const newChat = {
        //     user: prompt,
        //     aiFullLines: lines,
        //     aiVisibleLines: [],
        //     companyData: []
        // };

        // this.chatHistory.push(newChat);
        // await this.animateLines(this.chatHistory.length - 1);

        // this.response = [...this.chatHistory];
    }

    updateTableAfterPagination( event ) {
		this.fetchTableResults( event.pageSize, event.startAfter, event.page );
	}
	
	fetchTableResults( pageSize, startAfter, page ) {

		let payloadForTableResponse = {
			queryId: this.queryId,
			from: startAfter ? startAfter : 0,
			size: pageSize ? pageSize : 10
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG-PROMPT-AI', 'fetchMore', payloadForTableResponse ).subscribe( {
			next: ( res ) => {
				if ( res['status'] == 200 || res['body']['status'] == 200 ) {
					let tempStoreData = res['body']?.['results']?.['hits'].map( item => {
						return item._source;
					} );

                    this.companyDataHandler['companyData'] = this.formatData(tempStoreData);
				}
			},
			error: ( err ) => {
				console.log('Error in fetching table results', err);
			}
		})
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

    async animateLines(chatIndex: number) {
        const chat = this.chatHistory[chatIndex];
        let lineIndex = 0;

        const showNextLine = () => {
            if (lineIndex >= chat.aiFullLines.length) return;

            const fullLine = chat.aiFullLines[lineIndex];
            let currentText = '';
            let charIndex = 0;

            const typingInterval = setInterval(() => {
                if (charIndex < fullLine.length) {
                    currentText += fullLine[charIndex++];
                    chat.aiVisibleLines[lineIndex] = currentText;
                } else {
                    clearInterval(typingInterval);
                    lineIndex++;
                    chat.aiVisibleLines.push('');
                    showNextLine();
                }
            }, 30);
        };

        chat.aiVisibleLines.push('');
        showNextLine();
    }

    openDialogToShowCompany( data ) {
        this.visible = true;
        this.companyDataHandler = data;
    }
}
