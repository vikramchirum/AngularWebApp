import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { ServicePlanUpgradeModalComponent } from 'app/authenticated/plans-and-services/my-service-plans/change-your-plan/change-your-plan-card/service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';

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
  ActiveBillingAccountDetails: BillingAccountClass;
  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;

  constructor(private billingAccount_service: BillingAccountService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }
  ngAfterViewInit() {

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

  getEndDate(startDate): Date {
    startDate = new Date(startDate);
    return new Date(new Date(startDate).setMonth(startDate.getMonth() + 12));
  }

}
