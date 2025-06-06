import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { GlobalServerComminicationService } from '../services/global-server-comminication.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';

@Component({
  selector: 'dg-company-detail',
  templateUrl: './hubspotcompany-detail.component.html',
  styleUrls: ['./hubspotcompany-detail.component.scss']
})

export class HubspotCompanyDetailComponent implements OnInit, AfterViewInit {

  responseCode: string;
  companyId: string;
  isCompanyDetails: number = 0;
  showProgressBar: boolean = false;
  showProgressSpinner: boolean = false;
  companyDetails: any;
  msgs: Array<any> = [];
  REDIRECT_URI = `${ window.location.origin }/hubspot-ui/dg-authenticate`;

  constructor(
		private router: Router,
		private authService: AuthService,
		private activatedRoute: ActivatedRoute, 
		private globalServerComminication: GlobalServerComminicationService,
		public toNumberSuffix: NumberSuffixPipe,
	) { }

  ngOnInit() { }

  ngAfterViewInit() {

    const hubsportAuthCheckURI = `redirect_uri=${ window.location.origin }/hubspot-ui/dg-authenticate`;

    this.authService.checkAuth(hubsportAuthCheckURI).subscribe( response => {

      if (response.results.isAuthenticatedWithHubspot == true) {
        this.showProgressSpinner = true;
        if ( sessionStorage.getItem('companyId') ) {
          this.globalServerComminication.getOverviewData(this.REDIRECT_URI, sessionStorage.getItem('companyId')).subscribe(res => {
            if ( res.results && res.results.length ) {
              this.showProgressSpinner = false;
              this.companyDetails = res?.results[0];
              this.isCompanyDetails = Object.keys(this.companyDetails).length;
            } else {
              // this.showProgressSpinner = false;
              // this.msgs = [];
              // this.msgs.push({
              //   severity: 'success', summary: res.message
              // });
              // setTimeout(() => {
              //   this.msgs = [];
              this.router.navigate(['hubspot-ui/filters']);
              // }, 2000);
            }
          });
        } else {
          this.showProgressSpinner = true;
          setTimeout(() => {
            this.msgs = [];
            this.showProgressSpinner = false;
            this.msgs.push({
              severity: 'error', detail: 'Company details not found!',
            });
          }, 1000);
          setTimeout(() => {
            this.msgs = [];
            this.router.navigate(['hubspot-ui/filters']);
          }, 2000);
        }
      } else {
        this.router.navigate(['hubspot-ui/dg-authenticate']);
      }
    });
    
  }
  
  syncWithHubSpot() {
    this.showProgressBar = true;
    this.globalServerComminication.syncWithHubspot(this.REDIRECT_URI, sessionStorage.getItem('companyId'), this.companyDetails['companyRegistrationNumber']).subscribe((res) => {
      if (res.status == 200) {
        this.showProgressBar = false;
        this.msgs = [];
        this.msgs.push({
          severity: 'success', summary: 'Company Updated Successfully !',
        });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      } else if (res.response_code == 498) {
        localStorage.clear();
        this.router.navigate(['hubspot-ui/dg-authenticate']);
      } 
      // else if (res.status == 400) {
      //   this.authService.checkAuth(localStorage.getItem('auth_code')).subscribe((res) => {
      //     if (res.status == 200) {
      //       localStorage.removeItem('access_token');
      //       localStorage.setItem('access_token', res.results['access_token']);
      //       this.globalServerComminication.syncWithHubspot(localStorage.getItem('access_token'), sessionStorage.getItem('companyId'), this.companyDetails['companyRegistrationNumber']).subscribe((res) => {
      //         if (res.status == 200) {
      //           this.showProgressBar = false;
      //           this.msgs = [];
      //           this.msgs.push({
      //             severity: 'success', summary: 'Company Updated Successfully !',
      //           });
      //           setTimeout(() => {
      //             this.msgs = [];
      //           }, 3000);
      //         }
      //       });
      //     }
      //   });
      // }
    }); 
  }

		// } else {
    //   this.router.navigate( ['dg-authenticate'] );
		// 	// this.authService.regenerateToken(localStorage.getItem('refresh_token')).subscribe(response => {
		// 	//   this.authService.storeHsTokens(response.result);
    //   //   this.authService.checkToken(localStorage.getItem('access_token')).subscribe(response => {
    //   //     const { success } = response;
    //   //     if (success) {
    //   //       if (sessionStorage.getItem('companyId')) {
    //   //       this.globalServerComminication.getOverviewData(localStorage.getItem('access_token'), sessionStorage.getItem('companyId')).subscribe(response =>{
    //   //       this.companyDetails = response?.results[0];
    //   //       this.isCompanyDetails = Object.keys(this.companyDetails).length;
    //   //       });
    //   //       }
    //   //     } 
    //   //   });
		// 	// });
		// }
    // });

	// 	setTimeout(() => {
	// 		this.globalServerComminication.getOverviewData(localStorage.getItem('access_token'), sessionStorage.getItem('companyId')).subscribe((res) =>{
	// 			if(res.status == 200) {
	// 				if (sessionStorage.getItem('companyId')) {
	// 					this.companyDetails = res?.results[0];
	// 					this.isCompanyDetails = Object.keys(this.companyDetails).length;
	// 				}
	// 			} else if(res.status == 400) {
	// 				this.authService.checkAuth(localStorage.getItem('auth_code')).subscribe((res) =>{
	// 					if(res.status == 200) {
	// 						localStorage.removeItem('access_token');
	// 						localStorage.setItem('access_token', res.results['access_token']);
	// 						this.globalServerComminication.getOverviewData(localStorage.getItem('access_token'), sessionStorage.getItem('companyId')).subscribe((res) =>{
	// 							if(res.status == 200) {
	// 								if (sessionStorage.getItem('companyId')) {
	// 									this.companyDetails = res?.results[0];
	// 									this.isCompanyDetails = Object.keys(this.companyDetails).length;
	// 								}
	// 							}
	// 						});
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}, 4000);
  // }

  // syncWithHubSpot() {
  //   this.showProgressBar = true;
	// 	this.globalServerComminication.syncWithHubspot(localStorage.getItem('access_token'), sessionStorage.getItem('companyId'), this.companyDetails['companyRegistrationNumber']).subscribe((res) =>{
	// 		if(res.status == 200) {
	// 			this.showProgressBar = false;
	// 			this.msgs = [];
	// 			this.msgs.push({ 
	// 				severity: 'success', summary: 'Company Updated Successfully !',
	// 			});
	// 			setTimeout(() => {
	// 				this.msgs = [];
	// 			}, 3000);
	// 		} else if(res.response_code == 498) {
	// 			localStorage.clear();
	// 			this.router.navigate(['dg-authenticate']);
	// 		} else if(res.status == 400) {
	// 			this.authService.checkAuth(localStorage.getItem('auth_code')).subscribe((res) =>{
	// 				if(res.status == 200) {
	// 					localStorage.removeItem('access_token');
	// 					localStorage.setItem('access_token', res.results['access_token']);
	// 					this.globalServerComminication.syncWithHubspot(localStorage.getItem('access_token'), sessionStorage.getItem('companyId'), this.companyDetails['companyRegistrationNumber']).subscribe((res) =>{
	// 						if(res.status == 200) {
	// 							this.showProgressBar = false;
	// 							this.msgs = [];
	// 							this.msgs.push({ 
	// 								severity: 'success', summary: 'Company Updated Successfully !',
	// 							});
	// 							setTimeout(() => {
	// 								this.msgs = [];
	// 							}, 3000);
	// 						}
	// 					});
	// 				}
	// 			});
	// 		}
	// 	});

  //   // this.authService.checkAuth().subscribe(response => {
	// 	//   console.log(response);
	// 	// 	// const { success } = response;
	// 	// 	if ( response.results.isAuthenticatedWithHubspot == true ) {			  
	// 	// 	  this.globalServerComminication.syncWithHubspot(localStorage.getItem('access_token'), sessionStorage.getItem('companyId'), this.companyDetails['companyRegistrationNumber']).subscribe(res => {
  //   //       console.log(res);
  //   //       if(res.status == 200) {
  //   //         this.showProgressBar = false;
  //   //         this.msgs = [];
  //   //         this.msgs.push({ 
  //   //           severity: 'success', summary: 'Company Updated Successfully !',
  //   //         });
  //   //         setTimeout(() => {
  //   //           this.msgs = [];
  //   //         }, 3000);
  //   //       } else if(res.response_code == 498) {
  //   //         localStorage.clear();
  //   //         this.router.navigate(['dg-authenticate']);
  //   //       }
	// 	// 	  });
	// 	// 	} else {
  //   //     this.router.navigate( ['dg-authenticate'] );
	// 	// 	  // this.authService.regenerateToken(localStorage.getItem('refresh_token')).subscribe(response => {
	// 	// 		//   this.authService.storeHsTokens(response.result);
  //   //     //   this.globalServerComminication.syncWithHubspot(localStorage.getItem('access_token'), sessionStorage.getItem('companyId'), this.companyDetails['companyRegistrationNumber']).subscribe(res => {
  //   //     //     console.log('regenerate', res);
  //   //     //     if(res.status == 200) {
  //   //     //       this.showProgressBar = false;
  //   //     //       this.msgs = [];
  //   //     //       this.msgs.push({ 
  //   //     //         severity: 'success', summary: 'Company Updated Successfully !',
  //   //     //       });
  //   //     //       setTimeout(() => {
  //   //     //         this.msgs = [];
  //   //     //       }, 3000);
  //   //     //     } else if(res.response_code == 498) {
  //   //     //       localStorage.clear();
  //   //     //       this.router.navigate(['dg-authenticate']);
  //   //     //     }
  //   //     //   });
	// 	// 	  // })
	// 	// 	}
	// 	// });
  // }
}