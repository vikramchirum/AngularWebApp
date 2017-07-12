/**
 * Created by vikram.chirumamilla on 7/11/2017.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { minimumValueValidator } from 'app/validators/validator';

import { IBudgetBillingEstimate } from '../../../../core/models/budgetbilling/budgetbillingestimate.model';
import { ICreateBudgetBillingRequest } from '../../../../core/models/budgetbilling/createbudgetbillingrequest.model';

@Component({
  selector: 'mygexa-budget-billing-selector',
  templateUrl: './budget-billing-selector.component.html',
  styleUrls: ['./budget-billing-selector.component.scss']
})
export class BudgetBillingSelectorComponent implements OnInit, OnDestroy {

  budgetBillingFormGroup: FormGroup;
  createBudgetBillingRequest: ICreateBudgetBillingRequest = {} as ICreateBudgetBillingRequest;
  @Input() budgetBillingEstimate: IBudgetBillingEstimate = null;
  @Input() editing: boolean = null;
  @Input() onCancel: any = null;
  @Input() onSubmit: any = null;
  public minimumAmount: number;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.minimumAmount = this.budgetBillingEstimate.Amount;

    alert(this.minimumAmount);

    this.budgetBillingFormGroup = this.formBuilder.group({
      amount: [{value: this.budgetBillingEstimate.Amount, disabled: false}
        , [Validators.required, minimumValueValidator(this.budgetBillingEstimate.Amount)]],
      agree: [false, [Validators.pattern('true')]]
    });
  }

  save(): void {
    if (typeof this.onSubmit === 'function') {
      this.onSubmit(this.budgetBillingFormGroup);
    }
  }

  cancel(): void {
    if (typeof this.onCancel === 'function') {
      this.onCancel();
    }
  }

  ngOnDestroy() {
  }
}
