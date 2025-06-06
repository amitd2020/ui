import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable()

export class ApiTrackingInterceptor implements HttpInterceptor {

    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

        const id = Math.random().toString(36).substring(7);
       
		console.log(`[${id}] Intercepted Request: ${req.url}`);
        return next.handle(req)
    }

    
    
}