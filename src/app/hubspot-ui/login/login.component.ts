import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'dg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[LoginService]
})
export class LoginComponent {

  @ViewChild('loginForm', { static: false }) loginForm: NgForm;

	hide: boolean = true;
  loginConfirmation: boolean = false;
  msgs: Array<any> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService
  ) {  }

  loginUser( formData: NgForm, from? ) {

    let loginData = {};
    const { email, password } = formData.value;
    loginData['regionCode'] = 'GBR';
    loginData['platformType'] = "default";

    const EncryptD = this.loginService.set( JSON.stringify( { email, password } ) );
    loginData['data'] = EncryptD;

    if ( from == 'formComfirmation' ) {
      loginData['isAllLogout'] = true;
    }

    this.loginService.setLoginCredentials(loginData).subscribe((res) => {
      console.log(res);

      if (res.code == 200) {

        localStorage.setItem( 'isDgLoggedIn', 'true' );
        this.router.navigate(['hubspot-ui']);

      } else if ( res['code'] == 401 ) {
        
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: res['message'] });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
        setTimeout(() => {
          this.loginConfirmation = true;
        }, 4000);

    } else if (res.status == 498) {
        this.loginConfirmation = true;

      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: res.msg || res.message });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    });
    
  }

  loginConfirm() {
    this.loginUser( this.loginForm, 'formComfirmation' );
    this.loginConfirmation = false;
  }
  
}
