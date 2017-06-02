import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-service-plan-upgrade-modal',
  templateUrl: './service-plan-upgrade-modal.component.html',
  styleUrls: ['./service-plan-upgrade-modal.component.scss']
})
export class ServicePlanUpgradeModalComponent implements OnInit {

 

   @ViewChild('serviceUpgradeModal') public serviceUpgradeModal:ModalDirective;
  // @Input() title?:string;

  constructor() {
  }

  ngOnInit() {
  }
  public show():void {
    this.serviceUpgradeModal.show();
  }

  public hideServiceUpgradeModal():void {
    this.serviceUpgradeModal.hide();
  }

}
