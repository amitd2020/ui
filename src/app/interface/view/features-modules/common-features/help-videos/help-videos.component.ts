import { Component, OnInit } from '@angular/core';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-help-videos',
  templateUrl: './help-videos.component.html',
  styleUrls: ['./help-videos.component.scss']
})

export class HelpVideosComponent implements OnInit {

	title: string = '';

	constructor(
		private canonicalService: CanonicalURLService,
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {
		this.initBreadcrumbAndSeoMetaTags();
	}

	initBreadcrumbAndSeoMetaTags() {
		this.sharedLoaderService.showLoader();

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: 'Videos' }
		// 	]
		// );

		this.title = "Videos - Automate your marketing workflows";
			
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.canonicalService.setCanonicalURL();			
		this.sharedLoaderService.hideLoader();
	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 500);
	}

}

