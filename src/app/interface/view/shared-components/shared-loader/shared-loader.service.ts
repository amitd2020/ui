import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedLoaderService {

	private globalLoaderBoolean = new BehaviorSubject<boolean>(false);
	accessGlobalLoader$: Observable<boolean> = this.globalLoaderBoolean.asObservable();

	constructor() { }

	showLoader() {
		if ( !this.globalLoaderBoolean.getValue() ) {
			return this.globalLoaderBoolean.next( true );
		}
		return;
	}
	
	hideLoader() {
		if ( this.globalLoaderBoolean.getValue() ) {
			return this.globalLoaderBoolean.next( false );
		}
		return;
	}
	
}
