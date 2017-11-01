/**
 * Created by vikram.chirumamilla on 7/11/2017.
 */

import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { minimumValueValidator } from 'app/validators/validator';
import { environment} from 'environments/environment';
import { IBudgetBillingEstimate } from '../../../../core/models/budgetbilling/budgetbillingestimate.model';
import { ICreateBudgetBillingRequest } from '../../../../core/models/budgetbilling/createbudgetbillingrequest.model';
import { UserService } from '../../../../core/user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-budget-billing-selector',
  templateUrl: './budget-billing-selector.component.html',
  styleUrls: ['./budget-billing-selector.component.scss'],
})
export class BudgetBillingSelectorComponent implements OnInit, OnDestroy {

  budgetBillingFormGroup: FormGroup;
  createBudgetBillingRequest: ICreateBudgetBillingRequest = {} as ICreateBudgetBillingRequest;
  minimumAmount: number;
  username: string = null;
  private UserServiceSubscription: Subscription = null;

  @Output() public onBudgetBillingEvent = new EventEmitter();
  @Input() budgetBillingEstimate: IBudgetBillingEstimate;

  constructor(private decimalPipe: DecimalPipe, private formBuilder: FormBuilder, private UserService: UserService
) {
  }

  ngOnInit() {
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => {
        this.username = result.Profile.Username;
      }
    );
    this.minimumAmount = this.budgetBillingEstimate.Amount;
    this.budgetBillingFormGroup = this.formBuilder.group({
      amount: [{value: this.decimalPipe.transform(this.budgetBillingEstimate.Amount, environment.DollarAmountFormatter), disabled: false}
        , [Validators.required, minimumValueValidator(this.budgetBillingEstimate.Amount)]],
      agree: [false, [Validators.pattern('true')]]
    });
  }

  save(): void {
    // TODO
    this.createBudgetBillingRequest.User_Name = this.username;
    this.createBudgetBillingRequest.Service_Account_Id = this.budgetBillingEstimate.Service_Account_Id;
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
    if (this.UserServiceSubscription) {
      this.UserServiceSubscription.unsubscribe();
    }
  }
}
