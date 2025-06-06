import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'dg-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  
  AUTHORIZE_URL = 'https://app-eu1.hubspot.com/oauth/authorize';
  private TOKEN_URI = "https://api.hubapi.com/oauth/v1/token";

  // client id for app
  private CLIENT_ID = 'f0c68772-0422-43d8-aa12-e234eba762b7';

  // client id for preprod testing
  // private CLIENT_ID = '7fd7d874-7511-46f3-a104-7aa81c7458a9';

  // client secret for app
  private CLIENT_SECRET = '491c662e-c4e1-4e45-a0fe-58fc2a4d87fe';

  // client secret for preprod testing
  // private CLIENT_SECRET = '87516317-db83-4c80-afd2-f1d77633018b';

  // Previous used scopes
  // private SCOPES = 'crm.objects.contacts.read,crm.objects.contacts.write,crm.objects.companies.write,crm.objects.companies.read,crm.objects.owners.read,crm.lists.read,crm.lists.write,crm.schemas.contacts.read,crm.schemas.contacts.write,crm.objects.custom.read,crm.objects.custom.write,crm.schemas.companies.read,crm.schemas.companies.write,integration-sync,oauth';

  private SCOPES = 'crm.schemas.companies.read,crm.schemas.companies.write,crm.objects.companies.write,crm.objects.companies.read,oauth';
  private REDIRECT_URI = `${ window.location.origin }/hubspot-ui/dg-authenticate`;
  authCode: string;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private authService: AuthService
  ) {
      this.SCOPES = ( this.SCOPES.split(/ |, ?|%20/) ).join(' ');

      this.AUTHORIZE_URL = this.AUTHORIZE_URL + 
          `?client_id=${encodeURIComponent(this.CLIENT_ID)}` +
          `&scope=${encodeURIComponent(this.SCOPES)}` +
          `&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}`;
  }
  
  ngOnInit(): void {
    
    const { code, companyId } = this.activatedRoute.snapshot.queryParams;
    
	  this.authCode = code;
    
    if (companyId) {
      sessionStorage.setItem('companyId', companyId);
    }

    const hubsportAuthCheckURI = `code=${this.authCode}&redirect_uri=${ window.location.origin }/hubspot-ui/dg-authenticate`;

    if( this.authCode ) {
      this.authService.checkAuth(hubsportAuthCheckURI).subscribe((res) =>{
        if(res.status == 200) {
          if (res.results['isAuthenticatedWithHubspot'] == true) {
            this.router.navigate(['hubspot-ui/update']);
          }
        }
      });
    }
  }

}
