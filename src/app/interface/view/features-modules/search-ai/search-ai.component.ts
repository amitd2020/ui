import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-search-ai',
  templateUrl: './search-ai.component.html',
  styleUrls: ['./search-ai.component.scss']
})
export class SearchAiComponent implements OnInit {
  inputValue: string = '';
  directorNameSearchKey:  string = '';
  checkInputValue: string = '';
  tableCols: any[];
  data: any[];
  msgs = [];
  rows: any;
  constructor(
    private globalServerCommunication: ServerCommunicationService,
    private userAuthService: UserAuthService,
    private commonService: CommonServiceService,
    private router: Router,
		private sharedLoaderService: SharedLoaderService,
  ) { 

  }
  ngOnInit(): void {

    this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'getAiRequestPrompt').subscribe( res => {
      if( res.status == 200 ){
        this.data = res.body
      }
    })
  }

  triggredKeywordSearch() {
    this.sharedLoaderService.showLoader();
    let obj = {
        'request': this.inputValue,
    }

    this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getSearchResultsByAi', obj).subscribe( res => {
      
      let data = res.body
      if ( data.status == 404 ) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: "No Record Found" });
        setTimeout(() => {
            this.msgs = [];
        }, 3000);

      } else {
        let urlStr: string;
        urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(data) }}));
        window.open( urlStr, '_blank' );
      }

      this.sharedLoaderService.hideLoader();
    })

	}
  
  value(event){
    this.inputValue = event.key;
  }

}
