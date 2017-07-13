/**
 * Created by vikram.chirumamilla on 7/11/2017.
 */

import {Component, EventEmitter, Input, Output, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { minimumValueValidator } from 'app/validators/validator';
import { environment} from 'environments/environment';
import { IBudgetBillingEstimate } from '../../../../core/models/budgetbilling/budgetbillingestimate.model';
import { ICreateBudgetBillingRequest } from '../../../../core/models/budgetbilling/createbudgetbillingrequest.model';

@Component({
  selector: 'mygexa-budget-billing-selector',
  templateUrl: './budget-billing-selector.component.html',
  styleUrls: ['./budget-billing-selector.component.scss'],
})
export class BudgetBillingSelectorComponent implements OnInit, OnDestroy {

  budgetBillingFormGroup: FormGroup;
  createBudgetBillingRequest: ICreateBudgetBillingRequest = {} as ICreateBudgetBillingRequest;
  minimumAmount: number;

  @Output() public onBudgetBillingEvent = new EventEmitter();
  @Input() budgetBillingEstimate: IBudgetBillingEstimate;

  constructor(private decimalPipe: DecimalPipe, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.minimumAmount = this.budgetBillingEstimate.Amount;
    this.budgetBillingFormGroup = this.formBuilder.group({
      amount: [{value: this.decimalPipe.transform(this.budgetBillingEstimate.Amount, environment.DollarAmountFormatter), disabled: false}
        , [Validators.required, minimumValueValidator(this.budgetBillingEstimate.Amount)]],
      agree: [false, [Validators.pattern('true')]]
    });
  }

  save(): void {
    // TODO
    this.createBudgetBillingRequest.User_Name = 'test-vikram';
    this.createBudgetBillingRequest.Billing_Account_Id = this.budgetBillingEstimate.Billing_Account_Id;
    this.createBudgetBillingRequest.Amount = this.budgetBillingFormGroup.get('amount').value;

    this.onBudgetBillingEvent.emit({
      IsCancel: false,
      CreateBudgetBillingRequest: this.createBudgetBillingRequest
    });
  }

  cancel(): void {
    this.onBudgetBillingEvent.emit({
      IsCancel: true,
      CreateBudgetBillingRequest: null
    });
  }

  ngOnDestroy() {
  }
}
