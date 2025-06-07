import { Component, Input } from '@angular/core';

@Component({
  selector: 'dg-shared-procurement-bars',
  templateUrl: './shared-procurement-bars.component.html',
  styleUrls: ['./shared-procurement-bars.component.scss']
})
export class SharedProcurementBarsComponent {

  @Input() chartData;
  @Input() chartOptions;
  @Input() chartPlugin;
  @Input() chartHeight;
  
  constructor() {}
}
