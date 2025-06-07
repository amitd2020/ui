import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dg-sync-with-hubspot',
  templateUrl: './sync-with-hubspot.component.html',
  styleUrls: ['./sync-with-hubspot.component.scss']
})
export class SyncWithHubspotComponent implements OnInit {

  @Input() showDialog: boolean;
  @Output() resetDialog = new EventEmitter<any>();

  AUTHORIZE_URL = 'https://app-eu1.hubspot.com/oauth/authorize';
  CLIENT_ID = 'f0c68772-0422-43d8-aa12-e234eba762b7';
  CLIENT_SECRET = '491c662e-c4e1-4e45-a0fe-58fc2a4d87fe';

  // Previous used scopes 
  // SCOPES = 'crm.objects.contacts.read,crm.objects.contacts.write,crm.objects.companies.write,crm.objects.companies.read,crm.objects.owners.read,crm.lists.read,crm.lists.write,crm.schemas.contacts.read,crm.schemas.contacts.write,crm.objects.custom.read,crm.objects.custom.write,crm.schemas.companies.read,crm.schemas.companies.write,integration-sync,oauth';

  SCOPES = 'crm.objects.contacts.write,crm.schemas.companies.read,crm.schemas.companies.write,crm.objects.companies.write,crm.objects.companies.read,oauth';
  REDIRECT_URI = `${ window.location.origin }/dg-authenticate`;

  constructor( ) {  
    this.SCOPES = ( this.SCOPES.split(/ |, ?|%20/) ).join(' ');

    this.AUTHORIZE_URL = this.AUTHORIZE_URL + 
      `?client_id=${encodeURIComponent(this.CLIENT_ID)}` +
      `&scope=${encodeURIComponent(this.SCOPES)}` +
      `&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}`;
   }

  ngOnInit() {
  }

  hideDialog() {
    this.showDialog = false;
    this.resetDialog.emit(this.showDialog);
  }

}
