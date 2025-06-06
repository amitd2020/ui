import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ForgotPasswordService {

  constructor( private http: HttpClient ) { }

  setForgotPasswordCredentials(credentials: object): Observable<any> {
    return this.http.post<any>(
        `${environment.server}/dg-userApi/sendForgotPasswordLink`, 
        credentials
    );
  }
}
