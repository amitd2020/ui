import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryParamResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    // Access query parameters using the ActivatedRouteSnapshot
    const queryParams = route.queryParams;

    // You can extract specific parameters like this
    const companyId = queryParams['companyId'];

    // Do something with the parameters or return them
    return { companyId };
  }
}
