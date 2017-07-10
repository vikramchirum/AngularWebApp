import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ServicePlanUpgradeModalComponent } from './service-plan-upgrade-modal/service-plan-upgrade-modal.component';

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit {

  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;
  selectCheckBox = false;
  enableSelect = false;
  ngOnInit() {
  }

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
