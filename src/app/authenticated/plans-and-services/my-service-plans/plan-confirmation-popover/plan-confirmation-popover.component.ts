import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccountService} from '../../../../core/CustomerAccount.service';
import {CustomerAccount} from '../../../../core/models/customeraccount/customeraccount.model';
import {ServiceAccountService} from '../../../../core/serviceaccount.service';
import {ServiceAccount} from '../../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-plan-confirmation-popover',
  templateUrl: './plan-confirmation-popover.component.html',
  styleUrls: ['./plan-confirmation-popover.component.scss']
})
export class PlanConfirmationPopoverComponent implements OnInit, OnDestroy {
  @ViewChild('planPopModal') public planPopModal: ModalDirective;
  CustomerAccountServiceSubscription: Subscription = null;
  activeServiceAccountDetails: ServiceAccount;
  customerDetails: CustomerAccount = null;
  serviceAccountSubscription: Subscription;
  IsInRenewalTimeFrame: boolean;

  constructor(private CustomerAccountService: CustomerAccountService, private serviceAccountService: ServiceAccountService) { }

  ngOnInit() {
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => this.customerDetails = result
    );

    this.serviceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.activeServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });

  }

  renewedNewplan() {
    this.hidePlanPopModal();
    if (this.IsInRenewalTimeFrame) {
      this.serviceAccountService.OnUpgradeOrRenew('Renewal');
    } else {
      this.serviceAccountService.OnUpgradeOrRenew('Upgrade');
    }
    location.reload();
  }

  public showPlanPopModal(): void {
    this.planPopModal.show();
  }

  public hidePlanPopModal(): void {
    this.planPopModal.hide();
  }
  ngOnDestroy() {
    this.CustomerAccountServiceSubscription.unsubscribe();
    this.serviceAccountSubscription.unsubscribe();
  }
}
