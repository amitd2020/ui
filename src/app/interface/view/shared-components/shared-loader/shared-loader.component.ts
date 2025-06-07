import { Component } from '@angular/core';
import { SharedLoaderService } from './shared-loader.service';

@Component({
	selector: 'dg-shared-loader',
	templateUrl: './shared-loader.component.html',
	styleUrls: ['./shared-loader.component.scss']
})
export class SharedLoaderComponent {

	constructor(public sharedLoaderService: SharedLoaderService) { }

}
