import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mygexa-left-nav-panel',
  templateUrl: './left-nav-panel.component.html',
  styleUrls: ['./left-nav-panel.component.scss']
})
export class LeftNavPanelComponent implements OnInit {
  
@Input() sideNavData;

  constructor() { }

  ngOnInit() {
  }

}
