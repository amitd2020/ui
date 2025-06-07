import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dg-shared-toolTip',
  templateUrl: './shared-toolTip.component.html',
  styleUrls: ['./shared-toolTip.component.scss']
})
export class SharedToolTipComponent implements OnInit {

  @Input() iTagMessage: string;

  constructor() { }

  ngOnInit(): void { }

}
