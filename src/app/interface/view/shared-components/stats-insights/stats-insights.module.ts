import { NgModule } from '@angular/core';

import { StatsInsightsComponent } from './stats-insights.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { StatsPdfReportComponent } from './stats-pdf-report/stats-pdf-report.component';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
// import { SubFilterComponent } from './sub-filter/sub-filter.component';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedCountModule } from '../shared-count-module/shared-count-module.module';
import { SavedFilterChipsModule } from '../saved-filter-chips/saved-filter-chips.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NumberSuffixModule } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.module';
import { SubFilterModule } from './sub-filter/sub-filter.module';
import { SimilarCompanyService } from './sub-filter/similar-company.services';
import { ChartModule } from 'primeng/chart';
import { CompareStatsComponent } from './compare-stats/compare-stats.component';
import { CompareStatsPdfReportComponent } from './compare-stats-pdf-report/compare-stats-pdf-report.component';
import { CommanStatsClickService } from './comman-stats-click.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MsmePopUpSvgModule } from '../../features-modules/msme-pop-up-svg/msme-pop-up-svg.module';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
		DialogModule,
        MessagesModule,
        CardModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        InputSwitchModule,
        InputNumberModule,
        CheckboxModule,
        NumberSuffixModule,
        RadioButtonModule,
        SharedCountModule,
        SavedFilterChipsModule,
        SubFilterModule,
		ChartModule,
        OverlayPanelModule, 
        MsmePopUpSvgModule,
        TableModule 
    ],
    declarations: [
        StatsInsightsComponent,
        StatsPdfReportComponent,
        CompareStatsComponent,
        CompareStatsPdfReportComponent,
        // SubFilterComponent
    ],
    exports: [
        StatsInsightsComponent,
        StatsPdfReportComponent,
        CompareStatsComponent,
        // SubFilterComponent
    ],
    providers: [
        // NumberSuffixPipe,
        CurrencyPipe,
        DecimalPipe,
        SimilarCompanyService,
        CommanStatsClickService
    ],
})
export class StatsInsightsModule { }
