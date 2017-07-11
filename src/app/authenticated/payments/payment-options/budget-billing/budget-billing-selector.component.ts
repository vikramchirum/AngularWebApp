/**
 * Created by vikram.chirumamilla on 7/11/2017.
 */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { minimumMoneyAmount } from 'app/validators/validator';
import { NumberToMoney } from 'app/shared/pipes/NumberToMoney.pipe';
import * as $ from 'jquery';

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
