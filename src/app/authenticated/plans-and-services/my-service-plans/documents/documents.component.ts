import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { get, result } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IOffers } from '../../../../core/models/offers/offers.model';
import { AllOffersClass } from '../../../../core/models/offers/alloffers.model';
import { OfferService } from '../../../../core/offer.service';
import { DocumentsService } from '../../../../core/documents.service';
import { RenewalStore } from '../../../../core/store/RenewalStore';
import {OffersStore} from '../../../../core/store/OffersStore';
import {ServiceAccountService} from '../../../../core/serviceaccount.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  ActiveServiceAccount: ServiceAccount = null;
  renewalStoreSubscription: Subscription;
  OffersServiceSubscription: Subscription;
  plansServicesSubscription: Subscription;
  public eflLink;
  public tosLink;
  public yraacLink;
  public AllOffers: AllOffersClass[];
  public FeaturedOffers: AllOffersClass[];
  public RenewalOffers: IOffers;
  IsOffersReady: boolean = null;
  public IsUpForRenewal: boolean = null;
  public IsRenewalPending: boolean = null;

  constructor(private serviceAccountService: ServiceAccountService,
              private renewalStore: RenewalStore,
              private OfferStore: OffersStore,
              private documentsService: DocumentsService) {
    this.IsUpForRenewal = this.IsRenewalPending = null;
    this.RenewalOffers = null;
  }

  ngOnInit() {
    const activeServiceAccount$ = this.serviceAccountService.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    const renewalDetails$ = this.renewalStore.RenewalDetails;
    this.plansServicesSubscription = Observable.combineLatest(activeServiceAccount$, renewalDetails$).distinct(x => x[1].Service_Account_Id).subscribe(result => {
      this.ActiveServiceAccount = result[0];
      this.IsUpForRenewal = result[1].Is_Account_Eligible_Renewal;
      this.IsRenewalPending = result[1].Is_Pending_Renewal;
      if (this.IsUpForRenewal) {
        this.OffersServiceSubscription = this.OfferStore.ServiceAccount_RenewalOffers.subscribe(
          All_Offers => {
            if (All_Offers != null) {
              this.FeaturedOffers = All_Offers.filter(item => item.Type === 'Featured_Offers');
              this.RenewalOffers = get(this, 'FeaturedOffers[0].Offers[0]', null);
            }
          });
      }
      let docId = '';
      if (this.ActiveServiceAccount.Current_Offer.IsLegacyOffer) {
        docId = this.ActiveServiceAccount.Current_Offer.Rate_Code;
      } else {
        docId = this.ActiveServiceAccount.Current_Offer.Client_Key;
      }

      this.eflLink = this.documentsService.getEFLLink(docId);
      this.tosLink = this.documentsService.getTOSLink(this.ActiveServiceAccount.Current_Offer.IsFixed);
      this.yraacLink = this.documentsService.getYRAACLink();
    });
  }

  ngOnDestroy() {
    this.plansServicesSubscription.unsubscribe();
    if (this.IsUpForRenewal) {
      result(this.OffersServiceSubscription, 'unsubscribe');
    }
  }
}
