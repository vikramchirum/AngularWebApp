import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RenewalGaugeComponent } from './renewal-gauge/renewal-gauge.component';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IRenewalDetails } from 'app/core/models/renewals/renewaldetails.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { RenewalStore } from 'app/core/store/renewalstore';
import { ModalStore } from 'app/core/store/modalstore';

@Component({
  selector: 'mygexa-my-service-plans',
  templateUrl: './my-service-plans.component.html',
  styleUrls: ['./my-service-plans.component.scss']
})
export class MyServicePlansComponent implements OnInit, OnDestroy {

  @ViewChild(RenewalGaugeComponent) RenewalGaugeComponent;
  plansServices$: Observable<[ServiceAccount, IRenewalDetails]>;

  constructor(private serviceAccountService: ServiceAccountService, private renewalStore: RenewalStore, private modalStore: ModalStore) {
  }

  ngOnInit() {
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServices$ = Observable.combineLatest(activeServiceAccount$, renewalDetails$);

    // reset the modal popup and popover every time when my service plans component loads up.
    this.modalStore.showPlanConfirmationModal(null);
    this.modalStore.handleOfferPopOversModal(null);
  }

  hideGauge(activeServiceAccount: ServiceAccount): boolean {
    return (!activeServiceAccount.Current_Offer.IsHoldOverRate
    && ((activeServiceAccount.Contract_End_Date ? activeServiceAccount.Contract_End_Date : activeServiceAccount.Calculated_Contract_End_Date) < new Date()));
  }

  ngOnDestroy() {
  }
}
