import {Component, OnDestroy, OnInit} from '@angular/core';
import { ServiceAccountService } from '../../core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from '../../core/models/serviceaccount/serviceaccount.model';
import { OffersStore } from '../../core/store/offersstore';
import { IOffers } from '../../core/models/offers/offers.model';

@Component({
  selector: 'mygexa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  serviceAccountServiceSubscription: Subscription = null;

  ActiveServiceAccount: ServiceAccount = null;
  Is_Auto_Bill_Pay: boolean = null;
  Paperless_Billing: boolean = null;
  Budget_Billing: boolean = null;
  ShowAutoBillPay: boolean = null;
  ShowPaperlessBilling: boolean = null;
  ShowBudgetBilling: boolean = null;
  ShowEnergySavingTips: boolean = null;


  constructor( private ServiceAccountService: ServiceAccountService,
               private OfferStore: OffersStore
  ) { }

  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        this.OfferStore.LoadLyricOfferDetails(this.ActiveServiceAccount.TDU_DUNS_Number);
        this.Is_Auto_Bill_Pay = this.ActiveServiceAccount.Is_Auto_Bill_Pay;
        this.Paperless_Billing = this.ActiveServiceAccount.Paperless_Billing;
        this.Budget_Billing = this.ActiveServiceAccount.Budget_Billing;
        this.ShowAutoBillPay = !this.Is_Auto_Bill_Pay ? true : false;
        this.ShowPaperlessBilling = (this.Is_Auto_Bill_Pay && !this.Paperless_Billing) ? true : false;
        this.ShowBudgetBilling = (this.Is_Auto_Bill_Pay && this.Paperless_Billing && !this.Budget_Billing) ? true : false;
        this.ShowEnergySavingTips = (this.Is_Auto_Bill_Pay  && this.Paperless_Billing && this.Budget_Billing) ? true : false;
      });
  }

  ngOnDestroy() {
    this.serviceAccountServiceSubscription.unsubscribe();
  }
}
