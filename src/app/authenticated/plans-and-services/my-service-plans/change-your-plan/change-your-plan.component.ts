import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';

@Component({
  selector: 'mygexa-change-your-plan',
  templateUrl: './change-your-plan.component.html',
  styleUrls: ['./change-your-plan.component.scss']
})
export class ChangeYourPlanComponent implements OnInit, OnDestroy {
  public IsInRenewalTimeFrame: boolean;
  ActiveBillingAccountDetails: BillingAccountClass;
  billingAccountSubscription: Subscription;
  clicked: boolean;
  constructor(private billingAccount_service: BillingAccountService) {
    this.IsInRenewalTimeFrame = false;
    this.clicked = false;
  }

  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }
  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
  }
  ChevClicked() {
    this.clicked = !this.clicked ;
  }
}
