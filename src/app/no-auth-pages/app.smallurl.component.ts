import { Component, OnInit } from "@angular/core";
import CustomUtils from "../interface/custom-pipes/custom-utils/custom-utils.utils";
import { ServerCommunicationService } from "../interface/service/server-communication.service";

@Component({
	selector: 'dg-smallurl',
	templateUrl: './app.smallurl.component.html'
})

export class SmallUrlComponent implements OnInit {

	queryString = window.location.search;

	constructor(
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnInit() {
		const urlParams = new URLSearchParams(this.queryString);
		if (!CustomUtils.isNullOrUndefined(urlParams.get('url'))) {
			let urlKey = urlParams.get('url');
			this.getActualUrl(urlKey)
		}
	}

	getActualUrl(urlKey) {
		let reqObj = [ urlKey ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getsmallurl', reqObj ).subscribe(res => {
			if (res.body.status == 200) {
				let url = res.body.results[0]['postcode_5mile'].toString().replace(/\\\//g, '');
				window.location.href = url;
			}
		}
		)
	}
}