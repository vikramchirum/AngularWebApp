import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { ServicePlanUpgradeModalComponent } from 'app/authenticated/plans-and-services/my-service-plans/change-your-plan/change-your-plan-card/service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-my-current-plan',
  templateUrl: './my-current-plan.component.html',
  styleUrls: ['./my-current-plan.component.scss']
})
export class MyCurrentPlanComponent implements OnInit, AfterViewInit, OnDestroy {
  IsInRenewalTimeFrame: boolean;
  billingAccountSubscription: Subscription;
  selectCheckBox  = false;
  enableSelect = false;

  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;

  constructor(private billingAccount_service: BillingAccountService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
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
}
