import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-multi-factor-authentication',
  templateUrl: './multi-factor-authentication.component.html',
  styleUrls: ['./multi-factor-authentication.component.scss']
})
export class MultiFactorAuthenticationComponent implements OnInit {

	is2FAEnabled: boolean = false;
	primaryModeForApp: boolean = false;
	primaryModeForEmail: boolean = false;
	activeStatusForApp: boolean = false;
	activeStatusForEmail: boolean = false;
	verifyStatusForApp: boolean = false;

	QRCode: string;
	emailAddress: string;

	msgs: any[] = [];
	otp: string[] = new Array(6).fill('');
	otpDigits: number[] = new Array(6).fill(0);

	@ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

	constructor( private globalServerCommunicate: ServerCommunicationService, private userAuthService: UserAuthService, private sharedLoaderService: SharedLoaderService ) { }

	ngOnInit() {

		this.is2FAEnabled = JSON.parse(localStorage.getItem('is2FAEnabled'));
		this.emailAddress = this.userAuthService.getUserInfo('email') as string;
		
		setTimeout(() => {
			this.getPrimaryMode();
			if ( !this.activeStatusForApp && this.is2FAEnabled ) this.generateQRCode();
		}, 5000);
	}

	onToggle2FA() {

		this.sharedLoaderService.showLoader();

		let payload = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			is2FAEnabled: !this.is2FAEnabled	
		};

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'isMFAEnabled', payload ).subscribe( res => {
			if (res.body.status == 200) {
				this.is2FAEnabled = !this.is2FAEnabled;
				localStorage.setItem( "is2FAEnabled", JSON.stringify(this.is2FAEnabled) );

				this.showMessage( res.body.message );
				this.sharedLoaderService.hideLoader();
			}
		});

		setTimeout(() => {
			this.getPrimaryMode();
			if ( !this.activeStatusForApp && this.is2FAEnabled ) this.generateQRCode();
		}, 5000);
	}

	generateQRCode() {

		this.sharedLoaderService.showLoader();
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LOGIN', 'generateQR' ).subscribe( {
			next: (res) => {
				if ( res.status == 200 ) {
					this.QRCode = res.body.qr;
					this.sharedLoaderService.hideLoader();
				}
			}, 
			error: (err) => {
				console.error(err);
				this.sharedLoaderService.hideLoader();
			}
		});
	}

	makePrimaryMode( type ) {
		
		this.sharedLoaderService.showLoader();
		let payload = {
			modeType: type,
			isPrimary: true
		};

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'makePrimary', payload ).subscribe( {
			next: (res) => {
				this.sharedLoaderService.hideLoader();
				this.showMessage( res.body.message );
			}, 
			error: (err) => {
				console.error(err);
				this.sharedLoaderService.hideLoader();	
			}
		});

		setTimeout(() => {
			this.getPrimaryMode();
		}, 5000);
	}

	verifyOTPFromAuthenticator() {

		this.sharedLoaderService.showLoader();
		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'verifyTOTP', { code: this.otp.join('') } ).subscribe( {
			next: (res) => {
				this.sharedLoaderService.hideLoader();
				this.showMessage( res.body.message );
			}, 
			error: (err) => {
				console.error(err);
				this.sharedLoaderService.hideLoader();
			}
		});	

		setTimeout(() => {
			this.getPrimaryMode();
		}, 5000);
	}

	getPrimaryMode() {

		this.sharedLoaderService.showLoader();

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'userEnableMfa' ).subscribe( {
			next: ( res ) => {

				this.sharedLoaderService.hideLoader();

				for( let item of res.body ) {
					if ( item.modeType == 'emailOTP' ) {
						this.primaryModeForEmail = item.isPrimary;
						this.activeStatusForEmail = item.isactive;
					}

					if ( item.modeType == 'app2FA' ) {
						this.primaryModeForApp = item.isPrimary;
						this.activeStatusForApp = item.isactive;
						this.verifyStatusForApp = item.isApp2FAVerified;
					}
				}
			}, 
			error: ( err ) => {
				console.error(err);
				this.sharedLoaderService.hideLoader();
			}
		});
	}

	deleteMFA( modeType ) {

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'deleteMfa', { modeType: modeType } ).subscribe( {
			next: (res) => {
				console.log(res);
				this.showMessage( res.body.message );
			}, 
			error: (err) => {
				console.error(err);
			}
		});	

		setTimeout(() => {
			this.getPrimaryMode();
		    this.generateQRCode();
			this.otp = new Array(6).fill('');
		}, 5000);
	}

	showMessage( message ) {
		this.msgs = [];
		this.msgs.push( { severity: 'success', summary: message } );
		setTimeout(() => {
			this.msgs = [];
		}, 2000);
	}

	onInput(event: any, index: number) {
		const input = event.target;
		const value = input.value;

		if (value.length > 1) {
		input.value = value.charAt(0);
		}

		if (value && index < 5) {
		this.focusInput(index + 1);
		}
	}

	onKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
		this.focusInput(index - 1);
		}
	}

	focusInput(index: number) {
		const input = this.otpInputs.toArray()[index];
		input?.nativeElement.focus();
	}

	onPaste(event: ClipboardEvent) {
		event.preventDefault();
		const pasteData = event.clipboardData?.getData('text') || '';
		const digits = pasteData.replace(/\D/g, '').slice(0, this.otpDigits.length);
	
		for (let i = 0; i < digits.length; i++) {
		this.otp[i] = digits[i];
		}

		setTimeout(() => {
			const nextInput = document.getElementsByName(`otp${digits.length - 1}`)[0] as HTMLInputElement;
			nextInput?.focus();
		}, 0);

	}
}
