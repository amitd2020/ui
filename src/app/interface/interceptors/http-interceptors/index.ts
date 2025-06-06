import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TransferStateInterceptor } from '../transfer-state.interceptor';
import { AuthInterceptor } from './auth-interceptors';
import { GlobalHttpInterceptorService } from './erroInterceptors';
import { ApiTrackingInterceptor } from './api-tracking-interceptor';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: ApiTrackingInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: TransferStateInterceptor, multi: true }
];
