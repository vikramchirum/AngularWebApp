/**
 * Created by vikram.chirumamilla on 9/15/2017.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap';

import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-plan-confirmation-modal',
  templateUrl: './plan-confirmation-modal.component.html',
  styleUrls: ['./plan-confirmation-modal.component.scss']
})
export class PlanConfirmationModalComponent implements OnInit {

  @ViewChild('planconfirmationModal') public planConfirmationModal: ModalDirective;

  isRenewalPlan: boolean;
  customerDetails: CustomerAccount = null;

  constructor() {
  }

  ngOnInit() {
  }

  public hidePlanConfirmationModal(): void {
    this.planConfirmationModal.hide();
  }

  public showPlanConfirmationModal(confirmationObject: any): void {
    this.isRenewalPlan = confirmationObject.isRenewalPlan;
    this.customerDetails = confirmationObject.customerDetails;
    this.planConfirmationModal.show();
  }
}
