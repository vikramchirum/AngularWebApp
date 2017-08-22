import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mygexa-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit {
@Input() featuredOffer;
  constructor() { }

  ngOnInit() {
  }

}
