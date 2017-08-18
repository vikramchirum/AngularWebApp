import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Subscription } from 'rxjs/Subscription';
import { OfferService } from 'app/core/offer.service';
import { result, startsWith } from 'lodash';
import {RenewalService} from '../../core/renewal.service';

@Component({
  selector: 'mygexa-plans-and-services',
  templateUrl: './plans-and-services.component.html',
  styleUrls: ['./plans-and-services.component.scss']
})
export class PlansAndServicesComponent implements OnInit, OnDestroy {

  private startsWith = startsWith;
  public IsUpForRenewal: boolean = null;
  public ActiveServiceAccount: ServiceAccount = null;

  ServiceAccountServiceSubscription: Subscription = null;
  ActiveServiceAccountOfferSubscription: Subscription = null;
  ActiveServiceAccount_Renewaldetails_Subscription: Subscription = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private RenewalService: RenewalService,
    private OfferService: OfferService,
    private Router: Router
  ) { }

  ngOnInit() {
    this.ServiceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.ActiveServiceAccount_Renewaldetails_Subscription = this.RenewalService.ActiveServiceAccount_RenewalDetailsObservable.subscribe(
          result => {  this.IsUpForRenewal = result.Is_Account_Eligible_Renewal;  }
        );
        this.ActiveServiceAccountOfferSubscription = this.OfferService.ActiveServiceAccountOfferObservable.subscribe(
          all_offers => { }
        );
      }
    );
  }

  ngOnDestroy() {
    result(this.ServiceAccountServiceSubscription, 'unsubscribe');
    result(this.ActiveServiceAccount_Renewaldetails_Subscription, 'unsubscribe');
    result(this.ActiveServiceAccountOfferSubscription, 'unsubscribe');
  }
}
