import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable()
export class SocialLoginService {

	userData: any;

	constructor(
		public afAuth: AngularFireAuth, // Inject Firebase auth service
		public router: Router,
	) {
		/* Saving user data in localstorage when 
		logged in and setting up null when logged out */
		this.afAuth.authState.subscribe((user) => {
			if (user) {
				this.userData = user;
			}
		});
	}

	// Sign in with Google
	GoogleAuth() {
		return this.AuthLogin(new auth.GoogleAuthProvider());
	}
	// Sign in with Facebook
	FaceBookAuth() {
		return this.AuthLogin(new auth.FacebookAuthProvider());
	}

	// Auth logic to run auth providers
	AuthLogin(provider: any) {
		return this.afAuth
		.signInWithPopup(provider)
		.then(result => result)
		.catch((error) => {
			// console.log( error )
		});
	}

}