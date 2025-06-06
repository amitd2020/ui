import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { NoAuthPagesModule } from './no-auth-pages/no-auth-pages.module';
import { FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule } from '@abacritt/angularx-social-login';
import { googleCredentials } from './interface/social-login-credentials/google-constatant';
import { environment } from 'src/environments/environment';
import { facebookCredentials } from './interface/social-login-credentials/facebook-constant';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { httpInterceptorProviders } from './interface/interceptors/http-interceptors';
import { AppNotfoundComponent } from './no-auth-pages/app.notfound.component';
import { ButtonModule } from 'primeng/button';
import { AppAccessdeniedComponent } from './no-auth-pages/app.accessdenied.component';

@NgModule({
    declarations: [
        AppComponent,
        AppNotfoundComponent,
        AppAccessdeniedComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        NoAuthPagesModule,
        ButtonModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy }, httpInterceptorProviders,
        {
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider( googleCredentials.clientId )
					},
					{
						id: FacebookLoginProvider.PROVIDER_ID,
						provider: new FacebookLoginProvider(
                            environment.server == 'https://main.datagardener.com' ? facebookCredentials.productionClientId : environment.server == 'https://preprodapi.datagardener.com' ? facebookCredentials.preprodClientId : environment.server == 'https://devapi.datagardener.com' ? facebookCredentials.devClientId : facebookCredentials.localClientId
                        )
					}
				]
			}
		}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
