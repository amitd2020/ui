import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataCommunicatorService {

	private dataCommunicatorVar = new BehaviorSubject('');
	$dataCommunicatorVar = this.dataCommunicatorVar.asObservable();

	private childComponentDataCommunicator = new BehaviorSubject('');
	$childComponentDataCommunicator = this.childComponentDataCommunicator.asObservable();

	updateData( incomingData: any ) {
		this.dataCommunicatorVar.next( incomingData );
	}

	childComponentUpdateData( incomingData: any ) {
		this.childComponentDataCommunicator.next( incomingData );
	}

}