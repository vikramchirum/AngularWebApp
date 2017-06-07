import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ServicePlanUpgradeModalComponent } from './service-plan-upgrade-modal/service-plan-upgrade-modal.component'

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit {

  selectCheckBox: boolean = false;
  enableSelect: boolean = false;
  ngOnInit() {
  }

  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;
  constructor(private viewContainerRef: ViewContainerRef) {
  }
  showServiceUpgradeModal() {
    this.serviceUpgradeModal.show();

  }
  onSelect(event) {
    event.preventDefault();
    this.selectCheckBox = true;
  }

  toggleButton() {
    this.enableSelect = !this.enableSelect;
  }
  closeCheckBox() {
    this.selectCheckBox = false;
    this.enableSelect = false;
  }
}
