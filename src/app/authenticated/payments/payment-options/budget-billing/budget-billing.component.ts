import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { minimumMoneyAmount } from 'app/validators/validator';
import { NumberToMoney } from 'app/shared/pipes/NumberToMoney.pipe';
import * as $ from 'jquery';

let temporary_budget_billing: any = null;
declare const jQuery: $;

@Component({
  selector: 'mygexa-budget-billing-selector',
  templateUrl: './budget-billing-selector.component.html',
  styleUrls: ['./budget-billing-selector.component.scss']
})
export class BudgetBillingSelectorComponent implements OnInit {

  formGroup: FormGroup = null;

  @Input() amountInitial: string = null;
  @Input() amountMinimum: number = null;
  @Input() editing: boolean = null;
  @Input() onCancel: any = null;
  @Input() onSubmit: any = null;

  constructor(
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.FormBuilder.group({
      amount: ['', Validators.compose([Validators.required, minimumMoneyAmount(this.amountMinimum)])],
      agree: ['', Validators.required]
    });
    if (this.amountInitial) {
      this.formGroup.controls['amount'].patchValue(this.amountInitial);
    } else if (this.amountMinimum) {
      this.formGroup.controls['amount'].patchValue(`$${NumberToMoney(this.amountMinimum)}`);
    }
  }

  formGroupSubmit(): void {
    if (typeof this.onSubmit === 'function') {
      this.onSubmit(this.formGroup);
    }
  }

  formGroupCancel(): void {
    if (typeof this.onCancel === 'function') {
      this.onCancel();
    }
  }

}

@Component({
  selector: 'mygexa-budget-billing',
  templateUrl: './budget-billing.component.html',
  styleUrls: ['./budget-billing.component.scss']
})
export class BudgetBillingComponent implements OnInit, OnDestroy {
  @ViewChild('confirmation_modal') confirmation_modal;

  amountInitial: string = null;
  amountMinimum: number = null;
  signedUpToBudgetBilling: boolean = null;
  signedUpToBudgetBillingEditing: boolean = null;
  signedUpToBudgetBillingRecently: boolean = null;
  signingUpToBudgetBilling: boolean = null;
  nextPaymentDate: Date = null;
  temporary_budget_billing = temporary_budget_billing;

  constructor() {}

  ngOnInit() {
    this.cancelSubmit = this.cancelSubmit.bind(this);
    this.startSubmit = this.startSubmit.bind(this);
    // TODO: get the user's current budget billing information
    this.amountInitial = temporary_budget_billing || null;
    this.amountMinimum = 20000;
    this.signedUpToBudgetBilling = temporary_budget_billing !== null;
  }

  ngOnDestroy() {
    // Hide the modal when the user navigates away (the backdrop can get stuck!)
    try {
      jQuery(this.confirmation_modal.nativeElement).modal('hide');
    } catch (err) {
      // The modal was never opened or there is nothing to close.
    }
  }

  startSubmit(formGroup: FormGroup): void {
    // TODO: Call to the API.
    this.amountInitial = formGroup.value.amount[0] === '$' ? formGroup.value.amount : `$${formGroup.value.amount}`;
    this.temporary_budget_billing = temporary_budget_billing = this.amountInitial;
    this.signedUpToBudgetBilling = this.signedUpToBudgetBillingRecently = true;
    this.signingUpToBudgetBilling = null;
    this.nextPaymentDate = new Date;
    this.nextPaymentDate.setMonth(this.nextPaymentDate.getMonth() + 1);
  }

  cancelSubmit(): void {
    this.signedUpToBudgetBillingEditing = false;
    this.signedUpToBudgetBilling = true;
    this.signingUpToBudgetBilling = false;
  }

  budgetBillingEdit(): void {
    this.signedUpToBudgetBillingEditing = true;
    this.signedUpToBudgetBillingRecently = false;
    this.signedUpToBudgetBilling = false;
    this.signingUpToBudgetBilling = true;
  }

  budgetBillingCancel(confirm: boolean): void {
    const $modal = jQuery(this.confirmation_modal.nativeElement);
    if (!confirm) {
      $modal.modal('show');
    } else {
      // TODO: Call to the API.
      this.signedUpToBudgetBilling =
        this.signedUpToBudgetBillingEditing =
        this.signingUpToBudgetBilling =
        this.amountInitial =
        temporary_budget_billing = null;
      $modal.modal('hide');
    }
  }

}
