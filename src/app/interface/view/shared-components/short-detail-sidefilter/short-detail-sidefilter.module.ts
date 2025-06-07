import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyDetailsViewModule } from '../../features-modules/company-details-module/company-details-view.module';
import { ShortDetailSidefilterComponent } from './short-detail-sidefilter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        CompanyDetailsViewModule
    ],
    declarations: [
        ShortDetailSidefilterComponent
    ],
    exports: [
        ShortDetailSidefilterComponent
    ],
})
export class ShortDetailSidefilterModule { }
