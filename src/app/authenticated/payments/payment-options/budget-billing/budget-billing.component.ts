import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {environment} from 'environments/environment';
import {BudgetBillingService} from '../../../../core/budgetbilling.service';
import {BillingAccountService} from '../../../../core/BillingAccount.service';
import {IBudgetBillingInfo} from '../../../../core/models/budgetbilling/budgetbillinginfo.model';
import {IBudgetBillingEstimate} from '../../../../core/models/budgetbilling/budgetbillingestimate.model';
import {CancelBudgetBillingModalComponent} from './cancel-budget-billing-modal/cancel-budget-billing-modal.component';
import {ICancelBudgetBillingRequest} from '../../../../core/models/budgetbilling/cancelbudgetbillingrequest.model';

@Component({
  selector: 'mygexa-budget-billing',
  templateUrl: './budget-billing.component.html',
  styleUrls: ['./budget-billing.component.scss'],
  providers: [BudgetBillingService]
})
export class BudgetBillingComponent implements OnInit, OnDestroy {

  isEnrolled = false;
  isEnrollError = false;
  isCancelled = false;
  isCancelError = true;
  signingUpToBudgetBilling = false;
  cancelBudgetBillingRequest: ICancelBudgetBillingRequest;
  budgetBillingInfo: IBudgetBillingInfo;

  @ViewChild('cancelBudgetBillingModal') cancelBudgetBillingModal: CancelBudgetBillingModalComponent;
  dollarAmountFormatter: string;

  budgetBillingInfo$: Observable<IBudgetBillingInfo>;
  budgetBillingEstimate$: Observable<IBudgetBillingEstimate>;
  cancelBudgetBillingObservable$: Observable<boolean>;

  private ActiveBillingAccountSubscription: Subscription = null;
  private billingAccountId: number;

  constructor(private budgetBillingService: BudgetBillingService
    , private billingAccountService: BillingAccountService) {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.ActiveBillingAccountSubscription = this.billingAccountService.ActiveBillingAccountObservable.subscribe(
      result => {
        // always reset the budget billing screen to initial screen.
        // when there is a change in the billing account from the drop down.

        this.billingAccountId = +(result.Id);
        this.reset();
        this.cancelBudgetBillingRequest = this.getCancelBudgetBillingRequest();

        this.budgetBillingInfo$ = this.budgetBillingService.getBudgetBillingInfo(this.billingAccountId).map((budgetBillingInfo: IBudgetBillingInfo) => {
          return budgetBillingInfo;
        }).share();
        this.budgetBillingEstimate$ = this.budgetBillingService.getBudgetBillingEstimate(this.billingAccountId)
          .map((budgetBillingEstimate: IBudgetBillingEstimate) => {
            return budgetBillingEstimate;
          }).share();
        this.cancelBudgetBillingObservable$ = this.budgetBillingService.cancelBudgetBilling(this.cancelBudgetBillingRequest).share();
       this.budgetBillingInfo$.subscribe(res => {
          this.budgetBillingInfo = res;
        });
      }
    );
  }

  getBudgetBillingEligibility(budgetBillingEstimate: IBudgetBillingEstimate): boolean {
    return !(budgetBillingEstimate.Check_Past_Due || (budgetBillingEstimate.Variance > 0) || !budgetBillingEstimate.IsVarianceBillGenerated
    || budgetBillingEstimate.Amount <= 0);
  }

  handleBudgetBillingEvent(event) {
    if (!event.IsCancel) {
      this.budgetBillingService.createBudgetBilling(event.CreateBudgetBillingRequest).subscribe(response => {
        if (response) {
          this.isEnrolled = true;
        } else {
          this.isEnrollError = true;
        }
      });
    } else {
      this.signingUpToBudgetBilling = false;
    }
  }

  handleCancelBudgetBillingEvent(event) {
    if (event.IsCancel) {
      const cancelBudgetBillingRequest = {} as ICancelBudgetBillingRequest;
      cancelBudgetBillingRequest.Billing_Account_Id = this.billingAccountId;
      cancelBudgetBillingRequest.User_Name = 'test_vikram';
      this.cancelBudgetBillingObservable$.subscribe(response => {
        if (response) {
          this.isCancelled = true;
        } else {
          this.isCancelError = true;
        }
      });
    }
  }

  budgetBillingCancel() {
    this.cancelBudgetBillingModal.show(this.budgetBillingInfo);
  }

  private reset() {
    this.isEnrolled = false;
    this.isEnrollError = false;
    this.isCancelError = false;
    this.isCancelled = false;
    this.signingUpToBudgetBilling = false;
  }

  private getCancelBudgetBillingRequest(): ICancelBudgetBillingRequest {
    const cancelBudgetBillingRequest = {} as ICancelBudgetBillingRequest;
    cancelBudgetBillingRequest.Billing_Account_Id = this.billingAccountId;
    // TODO
    cancelBudgetBillingRequest.User_Name = 'test_vikram';
    return cancelBudgetBillingRequest;
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
  }
}
