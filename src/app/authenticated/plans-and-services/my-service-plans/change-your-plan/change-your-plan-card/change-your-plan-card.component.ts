import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { ServicePlanUpgradeModalComponent } from './service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
import {OfferService} from '../../../../../core/offer.service';
import { filter, forEach, clone } from 'lodash';
import {IOffers} from '../../../../../core/models/offers/offers.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy {


  @Input() Offer: IOffers;

  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;
  selectCheckBox = false;
  public IsInRenewalTimeFrame: boolean;
  ActiveBillingAccountDetails: BillingAccountClass;
  billingAccountSubscription: Subscription;
  activebillingAccountOffersSubscription: Subscription;
  clicked: boolean;
  enableSelect = false;
  chev_clicked: boolean;
  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  constructor(private viewContainerRef: ViewContainerRef, private billingAccount_service: BillingAccountService,
              private active_billingaccount_service: OfferService) {
    this.chev_clicked = false;
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
  ChevClicked() {
    this.chev_clicked = !this.chev_clicked;
  }
}
