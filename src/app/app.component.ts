import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
    }

    ngAfterViewInit() {
        let splashScreenElement = document.querySelectorAll('.splash-screen-new');
        setTimeout(() => {
            if ( splashScreenElement && splashScreenElement.length ) {
                splashScreenElement[0].remove();
            }
        }, 2500);
    }

}
