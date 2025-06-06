import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedEchartComponent } from './shared-echart/shared-echart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NumberSuffixPipe } from '../interface/custom-pipes/number-suffix/number-suffix.pipe';
import { NumberSuffixModule } from '../interface/custom-pipes/number-suffix/number-suffix.module';
import { SharedGraphComponent } from './shared-graph/shared-graph.component';



@NgModule({
  declarations: [
    SharedEchartComponent,
    SharedGraphComponent
  ],
  imports: [
    CommonModule,
    NumberSuffixModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
  ],
  exports: [
    SharedEchartComponent,
    SharedGraphComponent
  ],
  providers:[ NumberSuffixPipe ]
})
export class EChartModule { }
