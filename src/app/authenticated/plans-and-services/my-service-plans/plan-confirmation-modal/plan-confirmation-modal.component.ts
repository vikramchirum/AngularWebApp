/**
 * Created by vikram.chirumamilla on 9/15/2017.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap';

import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { MyCurrentPlanComponent } from '../my-current-plan/my-current-plan.component';

@Component({
  providers: [ MyCurrentPlanComponent ],
  selector: 'mygexa-plan-confirmation-modal',
  templateUrl: './plan-confirmation-modal.component.html',
  styleUrls: ['./plan-confirmation-modal.component.scss']
})
export class PlanConfirmationModalComponent implements OnInit {

  @ViewChild('planConfirmationModal') public planConfirmationModal: ModalDirective;

  isRenewalPlan: boolean;
  customerDetails: CustomerAccount = null;

  constructor(private mycurrentplanComp: MyCurrentPlanComponent) {
  }

  ngOnInit() {
  }

  public hidePlanConfirmationModal(): void {
    console.log('Refresh requested.');
    this.mycurrentplanComp.getData();
    this.planConfirmationModal.hide();

  }

  public showPlanConfirmationModal(confirmationObject: any): void {

    if (!confirmationObject) {
      return;
    }
    this.isRenewalPlan = confirmationObject.isRenewalPlan;
    this.customerDetails = confirmationObject.customerDetails;
    this.mycurrentplanComp.getData();
    this.planConfirmationModal.show();
  }
}
