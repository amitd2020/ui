import { Injectable } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';

/**
 * This service is of shared screenshot
 */
@Injectable({
	providedIn: 'root'
})
export class SharedScreenshotService {

	constructor(
		private	ngxCaptureService: NgxCaptureService
	) {}
	
	snapshotForRiskSummary(mainContainer?, snapshotName?) {
		this.downloadImageCaptured(mainContainer,snapshotName);
	}
	
	snapshotForStatsInsight(mainContainer?, snapshotName?) {

		let mapSVGElement: any = document.querySelectorAll('.insightsRegionalMap.leaflet-container .leaflet-overlay-pane svg.leaflet-zoom-animated')[0];
		const svgTranslateOldValues = mapSVGElement?.style?.transform,
			RegExpToGetTranslate = /translate3d\((?<x>.*?)px, (?<y>.*?)px, (?<z>.*?)px/,
			TranslateValues = RegExpToGetTranslate.exec(svgTranslateOldValues),
			svgTranslateNewValues = `translate3d( ${+TranslateValues?.groups.x / 3}px, ${+TranslateValues?.groups.y / 3}px, 0px )`;

			if ( svgTranslateOldValues ) {
				mapSVGElement.style.transform = svgTranslateNewValues;
			}
			this.downloadImageCaptured(mainContainer, snapshotName);
			if ( svgTranslateOldValues ) {
				mapSVGElement.style.transform = svgTranslateOldValues;
			}
	}

	downloadImageCaptured(mainContainer, snapshotName) {

		mainContainer.classList.add('captureSnapshotActive');

		this.ngxCaptureService.getImage(mainContainer, true).subscribe(img => {
			var a = document.createElement("a");
			a.setAttribute("download", snapshotName);
			a.setAttribute("href", img);
			document.body.appendChild(a);
			a.click();
			a.remove();
		});
		mainContainer.classList.remove('captureSnapshotActive');;

	}
}
