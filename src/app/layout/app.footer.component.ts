import {Component} from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({

    selector: 'app-footer',
    template: `
    <div class="card mx-3 py-3">
        <span>Copyright © 2020-2025 | DataGardener Solutions Ltd | All Rights Reserved</span>
    </div>`

})

export class AppFooterComponent {

    constructor(public layoutService: LayoutService) {}

}
