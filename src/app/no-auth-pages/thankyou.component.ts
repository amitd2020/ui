import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerCommunicationService } from '../interface/service/server-communication.service';

@Component({
  selector: 'dg-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: [ './exception-pages.scss' ]

})
export class ThankyouComponent implements OnInit, AfterViewInit {

  msgs: Array<any> = [];

  constructor( 
    public router: Router,
    private activatedRoute: ActivatedRoute, 
    private globalServerCommunication: ServerCommunicationService,
   ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    const { code } = this.activatedRoute.snapshot.queryParams;
    // console.log(code);
    
    let queryParam = [
			{ key: 'code', value: code },
			{ key: 'redirect_uri', value: `${ window.location.origin }/dg-authenticate` }
		];

    this.globalServerCommunication.globalServerRequestCall('get', 'HS_EXTENSION', 'checkToken', undefined, undefined, queryParam).subscribe((res) =>{
      // console.log(res);
      
      if(res.body.status == 200) {
        if (res.body.results['isAuthenticatedWithHubspot'] == true) {
          this.msgs = [];
          this.msgs.push({ 
            severity: 'success', summary: res.body.message,
          });
          setTimeout(() => {
            this.msgs = [];
          }, 3000);

          setTimeout(() => {
            window.close();
          }, 4000);
        }
      }
    });

  }

}
