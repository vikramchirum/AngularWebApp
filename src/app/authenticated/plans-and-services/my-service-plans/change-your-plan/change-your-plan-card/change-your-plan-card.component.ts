import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { ServicePlanUpgradeModalComponent } from './service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
import {OfferService} from '../../../../../core/offer.service';
import {AllOffersClass, IOffers} from '../../../../../core/models/offer.model';
import { filter, forEach, clone } from 'lodash';

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() Offer: IOffers;

  @ViewChild('serviceUpgradeModal') serviceUpgradeModal: ServicePlanUpgradeModalComponent;
  selectCheckBox = false;
  public IsInRenewalTimeFrame: boolean;
  ActiveBillingAccountDetails: BillingAccountClass;
  billingAccountSubscription: Subscription;
  activebillingAccountOffersSubscription: Subscription;

  enableSelect = false;
  clicked = false;
  ngOnInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.ActiveBillingAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });

    // this.activebillingAccountOffersSubscription = this.active_billingaccount_service.ActiveBillingAccountOfferObservable.subscribe(
    //   all_offers => {
    //     console.log('HELLO', all_offers);
    //   });

  }

  constructor(private viewContainerRef: ViewContainerRef, private billingAccount_service: BillingAccountService,
              private active_billingaccount_service: OfferService) {
  }


  ngAfterViewInit() {
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
    //this.activebillingAccountOffersSubscription.unsubscribe();
  }
}
