import {Component, OnDestroy, OnInit} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {environment} from 'environments/environment';
import {BudgetBillingService} from '../../../../core/budgetbilling.service';
import {BillingAccountService} from '../../../../core/BillingAccount.service';
import {IBudgetBillingInfo} from '../../../../core/models/budgetbilling/budgetbillinginfo.model';
import {IBudgetBillingEstimate} from '../../../../core/models/budgetbilling/budgetbillingestimate.model';

@Component({
  selector: 'mygexa-budget-billing',
  templateUrl: './budget-billing.component.html',
  styleUrls: ['./budget-billing.component.scss'],
  providers: [BudgetBillingService]
})
export class BudgetBillingComponent implements OnInit, OnDestroy {

  dollarAmountFormatter: string;
  budgetBillingInfo$: Observable<IBudgetBillingInfo>;
  budgetBillingEstimate$: Observable<IBudgetBillingEstimate>;
  signingUpToBudgetBilling = false;

  private ActiveBillingAccountSubscription: Subscription = null;
  private billingAccountId: number;

  constructor(private budgetBillingService: BudgetBillingService
    , private billingAccountService: BillingAccountService) {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.ActiveBillingAccountSubscription = this.billingAccountService.ActiveBillingAccountObservable.subscribe(
      result => {
        this.billingAccountId = +(result.Id);
        this.budgetBillingInfo$ = this.budgetBillingService.getBudgetBillingInfo(this.billingAccountId).share();
        this.budgetBillingEstimate$ = this.budgetBillingService.getBudgetBillingEstimate(this.billingAccountId)
          .map((budgetBillingEstimate: IBudgetBillingEstimate) => {
            return budgetBillingEstimate;
          }).share();
      }
    );
  }

  getBudgetBillingEligibility(budgetBillingEstimate: IBudgetBillingEstimate): boolean {

    return !(budgetBillingEstimate.Check_Past_Due || (budgetBillingEstimate.Variance > 0) || !budgetBillingEstimate.IsVarianceBillGenerated
    || budgetBillingEstimate.Amount <= 0);
  }

  handleBudgetBillingEvent(event) {
    if (event.IsCancel) {
      this.budgetBillingService.createBudgetBilling(event.CreateBudgetBillingRequest).subscribe(response => {
        if (response) {
          // success
        }
      });
    }
    this.signingUpToBudgetBilling = false;
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
  }
}
