import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ServicePlanUpgradeModalComponent } from './service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy {

  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;
  selectCheckBox = false;
  public IsInRenewalTimeFrame: boolean;
  ActiveBillingAccountDetails: BillingAccountClass;
  billingAccountSubscription: Subscription;
  enableSelect = false;
  clicked = false;
  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  constructor(private viewContainerRef: ViewContainerRef, private billingAccount_service: BillingAccountService) {
  }
  showServiceUpgradeModal() {
    this.serviceUpgradeModal.show();

  }
  onSelect(event) {
    event.preventDefault();
    this.selectCheckBox = true;
  }

  toggleButton() {
    this.enableSelect = !this.enableSelect;
  }
  closeCheckBox() {
    this.selectCheckBox = false;
    this.enableSelect = false;
  }
  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
  }
}
