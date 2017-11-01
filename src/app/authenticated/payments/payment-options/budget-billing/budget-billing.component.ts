import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';
import { BudgetBillingService } from 'app/core/budgetbilling.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { IBudgetBillingInfo } from 'app/core/models/budgetbilling/budgetbillinginfo.model';
import { IBudgetBillingEstimate } from 'app/core/models/budgetbilling/budgetbillingestimate.model';
import { CancelBudgetBillingModalComponent } from './cancel-budget-billing-modal/cancel-budget-billing-modal.component';
import { ICancelBudgetBillingRequest } from 'app/core/models/budgetbilling/cancelbudgetbillingrequest.model';
import { UserService } from '../../../../core/user.service';

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
  username: string = null;
  @ViewChild('cancelBudgetBillingModal') cancelBudgetBillingModal: CancelBudgetBillingModalComponent;
  dollarAmountFormatter: string;
  budgetBillingInfo$: Observable<IBudgetBillingInfo>;
  budgetBillingEstimate$: Observable<IBudgetBillingEstimate>;
  cancelBudgetBillingObservable$: Observable<boolean>;

  private ActiveServiceAccountSubscription: Subscription = null;
  private UserServiceSubscription: Subscription = null;
  private serviceAccountId: number;

  constructor(private budgetBillingService: BudgetBillingService,
              private UserService: UserService,
              private serviceAccountService: ServiceAccountService) {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => {
        this.username = result.Profile.Username;
      }
    );
    this.ActiveServiceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        // always reset the budget billing screen to initial screen.
        // when there is a change in the service account from the drop down.

        this.serviceAccountId = +(result.Id);
        this.reset();
        this.cancelBudgetBillingRequest = this.getCancelBudgetBillingRequest();

        this.budgetBillingInfo$ = this.budgetBillingService.getBudgetBillingInfo(this.serviceAccountId).map((budgetBillingInfo: IBudgetBillingInfo) => {
          return budgetBillingInfo;
        }).share();
        this.budgetBillingEstimate$ = this.budgetBillingService.getBudgetBillingEstimate(this.serviceAccountId)
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
    console.log('event', event);
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
      cancelBudgetBillingRequest.Service_Account_Id = this.serviceAccountId;
      cancelBudgetBillingRequest.User_Name = this.username;
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
    cancelBudgetBillingRequest.Service_Account_Id = this.serviceAccountId;
    // TODO
    cancelBudgetBillingRequest.User_Name = 'test_vikram';
    return cancelBudgetBillingRequest;
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
