/**
 * Created by vikram.chirumamilla on 7/13/2017.
 */
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';
import { environment } from 'environments/environment';

import { IBudgetBillingInfo } from 'app/core/models/budgetbilling/budgetbillinginfo.model';

@Component({
  selector: 'mygexa-cancel-budget-billing-modal',
  templateUrl: './cancel-budget-billing-modal.component.html',
  styleUrls: ['./cancel-budget-billing-modal.component.scss']
})
export class CancelBudgetBillingModalComponent implements OnInit {

  @Output() public onCancelBudgetBillingEvent = new EventEmitter();
  @ViewChild('cancelBudgetBillingModal') public cancelBudgetBillingModal: ModalDirective;

  dollarAmountFormatter: string;
  budgetBillingInfo: IBudgetBillingInfo;

  constructor() {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
  }

  public show(budgetBillingInfo: IBudgetBillingInfo): void {
    this.budgetBillingInfo = budgetBillingInfo;
    this.cancelBudgetBillingModal.show();
  }

  public hideViewMyBillModal(): void {
    this.cancelBudgetBillingModal.hide();
  }

  public cancelBudgetBilling(): void {
    this.cancelBudgetBillingModal.hide();
    this.onCancelBudgetBillingEvent.emit({
      IsCancel: true,
    });
  }
}
