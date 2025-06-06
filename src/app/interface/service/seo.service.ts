import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class SeoService {

	constructor(
		private titleService: Title,
		private metaService: Meta
	) { }

	setPageTitle( title ) {
		this.titleService.setTitle( title );
	}

	setMetaTitle( title ) {
		this.metaService.updateTag({
			name: "title",
			content: title
		});
	}

	setDescription( description ) {
		this.metaService.updateTag({
			name: 'description',
			content: description
		})
	}

	setkeywords( keywords ) {
		this.metaService.updateTag({
			name: 'keywords',
			content: keywords
		})
	}

	setRobots( robots ) {
		this.metaService.updateTag({
			name: 'robots',
			content: robots
		})
	}
}
