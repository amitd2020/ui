import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'dg-without-login-modal',
	templateUrl: './without-login-modal.component.html',
	styleUrls: ['./without-login-modal.component.scss']
})
export class WithoutLoginModalComponent implements OnInit {

	showLoginDialog: boolean = false;

	constructor() { }

	ngOnInit(): void {
	}

	checkLogin(event) {
        if( event ) {
            this.showLoginDialog = false;
            // window.location.reload();
        }
    }

}
