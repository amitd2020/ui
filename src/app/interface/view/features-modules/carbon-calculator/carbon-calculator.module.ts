import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CarbonCalculatorDashboardComponent } from './carbon-calculator-dashboard/carbon-calculator-dashboard.component';
import { CarbonCalculatorFormComponent } from './carbon-calculator-form/carbon-calculator-form.component';
import { CarbonCalculatorService } from './carbon-calculator.service';

const CarbonCalculatorRoutes: Routes = [
	{ path: 'dashboard', component: CarbonCalculatorDashboardComponent },
	{ path: 'calculate', component: CarbonCalculatorFormComponent }
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild( CarbonCalculatorRoutes ),
		FormsModule,
		HttpClientModule,
		ButtonModule,
		InputTextModule,
		InputNumberModule,
		RadioButtonModule,
		DropdownModule,
		ChartModule,
		ProgressSpinnerModule
	],
	declarations: [
		CarbonCalculatorDashboardComponent,
		CarbonCalculatorFormComponent
	],
	exports: [
		CarbonCalculatorDashboardComponent
	],
	providers: [
		CarbonCalculatorService
	]
})
export class CarbonCalculatorModule {
	constructor(
		private router: Router
	) {

		let additionalDelay = 1;

		
		this.router.events.subscribe( res => {
			if ( res instanceof NavigationStart ) {
				additionalDelay = 0;

				this.addAnimationDelayOnCard( additionalDelay );
			}
			if ( res instanceof NavigationEnd ) {
				
				if ( this.router.url.includes('/carbon-calculator') || this.router.url.includes('/sustainability') ) {
					document.body.classList.add('carbonCalculatorEnabled');
				} else {
					document.body.classList.remove('carbonCalculatorEnabled');
				}

				setTimeout(() => {
					this.addAnimationDelayOnCard( additionalDelay );
				}, 300);
			}

		});

	}

	addAnimationDelayOnCard( delayTime ) {

		let cardsOnThePage: any = document.querySelectorAll('.carbonCalculatorModuleContainer .card');

		for ( let cardIndx in cardsOnThePage ) {
			if ( !isNaN( +cardIndx ) ) {
				cardsOnThePage[ cardIndx ].classList.add( 'appearCardFadeInUp' );
				cardsOnThePage[ cardIndx ].setAttribute( 'style', `animation-delay: ${ ( +cardIndx * 0.1 ) + delayTime }s`);
			}
		}

	}
}
