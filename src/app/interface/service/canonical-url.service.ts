import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class CanonicalURLService {

	constructor( @Inject(DOCUMENT) private dom ) { }

	setCanonicalURL() {

		const link: HTMLLinkElement = this.dom.createElement('link');
		const linkAlt: HTMLLinkElement = this.dom.createElement('link');
		
		let canonicalUrl = this.dom.URL.split('/');
		
		if ( canonicalUrl.includes('test.datagardener.com') || canonicalUrl.includes('app.datagardener.com') || canonicalUrl.includes('dev.datagardener.com') ) {
			
			if ( canonicalUrl[ canonicalUrl.length - 1 ] == '' ) {
				canonicalUrl.splice( canonicalUrl.length - 1, 1 );
			}
			
			canonicalUrl = canonicalUrl.join('/');
	
			link.setAttribute('rel', 'canonical');
			
			link.setAttribute('href', canonicalUrl );
			this.dom.head.appendChild( link );
	
			linkAlt.setAttribute('rel', 'alternate');
			linkAlt.setAttribute("hreflang", 'en-GB');
			
			linkAlt.setAttribute('href', canonicalUrl );
			this.dom.head.appendChild( linkAlt );

		}

	}
}
