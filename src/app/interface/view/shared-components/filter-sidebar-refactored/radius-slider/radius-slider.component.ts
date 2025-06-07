import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterSecondBlockComponentFeatureTypes, FilterSecondBlockComponentOutputTypes, RadiusPropTypes } from '../filter-option-types';
import { latLongModel } from 'src/app/interface/models/company-data-model';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'dg-radius-slider',
    templateUrl: './radius-slider.component.html'
})

export class RadiusSliderComponent implements OnInit {

    @Input() selectedCountry: string = 'uk';
    @Input() radiusProps: RadiusPropTypes = {
        radius: 0
    };

    @Input() filterExcludeBoolean: boolean = false;
    @Output() OutputEmitter = new EventEmitter<RadiusPropTypes>();
    
    errorMessage: string = '';

    constructor(
        private _globalServerCommService: ServerCommunicationService
    ) { }

    ngOnInit() { }

    async addRadiusLatLonValues() {
        if ( !( this.radiusProps?.postCode ) ) {
            return;
        }

        this.radiusProps.userLocation = await this.getLatLong( this.radiusProps.postCode );

        if ( this.radiusProps.userLocation ) {
            this.OutputEmitter.emit({
                chip_values: [ this.radiusProps.postCode ],
                userLocation: this.radiusProps.userLocation
            });
        }

    }

	async getLatLong( postCode: string ): Promise<latLongModel> {
		let postCodeBody = { postcode: postCode };
		const LatLongAPIRes: latLongModel = await lastValueFrom( this._globalServerCommService.globalServerRequestCall( 'post', 'DG_API', 'latLong', postCodeBody )
            .pipe(
                map( ( aggrResponse ) => {

                    if ( aggrResponse?.body?.status == 201 ) {
                        this.radiusProps.radius = 0;
                        this.errorMessage = aggrResponse?.body?.message;

                        setTimeout(() => {
                            this.errorMessage = '';
                        }, 4000);

                        return null;
                    }

                    this.errorMessage = '';
                    return aggrResponse?.body?.results
                }),
                catchError( ( err: HttpErrorResponse ) => {
                    console.log( err.message );
                    throw new Error( err.message );
                })
            )
        );
		return LatLongAPIRes;
	}
    
}