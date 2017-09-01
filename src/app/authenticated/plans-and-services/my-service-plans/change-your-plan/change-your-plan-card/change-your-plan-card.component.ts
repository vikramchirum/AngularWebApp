import {
  Component, OnInit, ViewChild, OnDestroy, SimpleChanges, OnChanges, Input, ViewContainerRef,
  AfterViewInit
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {IOffers} from '../../../../../core/models/offers/offers.model';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {ServiceAccount} from '../../../../../core/models/serviceaccount/serviceaccount.model';
import {OfferDetailsPopoverComponent} from '../offer-details-popover/offer-details-popover.component';
import {PlanConfirmationPopoverComponent} from '../../plan-confirmation-popover/plan-confirmation-popover.component';
import {RenewalStore} from '../../../../../core/store/RenewalStore';

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy {

  renewalStoreSubscription: Subscription;

  @Input() Offer: IOffers;
  @ViewChild('planPopModal') public planPopModal: PlanConfirmationPopoverComponent;

  selectCheckBox = false;
  IsInRenewalTimeFrame: boolean;   IsRenewalPending: boolean;
  activeServiceAccountDetails: ServiceAccount;
  serviceAccountSubscription: Subscription;
  enableSelect = false;
  chev_clicked: boolean;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  constructor(private serviceAccountService: ServiceAccountService,
  private renewalStore: RenewalStore,
  private viewContainerRef: ViewContainerRef) {
    this.chev_clicked = false;
  }

  showConfirmationPop() {
    this.planPopModal.showPlanPopModal();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['Offer'] && this.Offer) {
  //     this.checkFeaturedUsageLevel(this.Offer);
  //     this.serviceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
  //       result => {
  //         this.ActiveServiceAccountDetails = result;
  //         this.RenewalServiceSubscription = this.RenewalService.getRenewalDetails(Number(this.ActiveServiceAccountDetails.Id)).subscribe(
  //           RenewalDetails => { this.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
  //             this.IsRenewalPending = RenewalDetails.Is_Pending_Renewal; }
  //         );
  //       });
  //   }
  // }

  //checkFeaturedUsageLevel( Offer: IOffers ) {
  ngOnInit() {

    this.renewalStoreSubscription = this.renewalStore.RenewalDetails.subscribe(
      RenewalDetails => {

        if (RenewalDetails == null) {
          return;
        }

        this.IsInRenewalTimeFrame = RenewalDetails.Is_Account_Eligible_Renewal;

      });

    if (this.Offer.Plan.Product.Featured_Usage_Level != null) {
      switch (this.Offer.Plan.Product.Featured_Usage_Level) {
        case  '500 kWh': {
          this.Price_atFeatured_Usage_Level = this.Offer.Price_At_500_kwh;
          break;
        }
        case  '1000 kWh': {
          this.Price_atFeatured_Usage_Level = this.Offer.Price_At_1000_kwh;
          break;
        }
        case  '2000 kWh': {
          this.Price_atFeatured_Usage_Level = this.Offer.Price_At_2000_kwh;
          break;
        }
        default: {
          this.Offer.Plan.Product.Featured_Usage_Level = '2000 kWh';
          this.Price_atFeatured_Usage_Level = this.Offer.Price_At_2000_kwh;
          break;
        }
      }
    }

    this.serviceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.activeServiceAccountDetails = result;

      });
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
    this.serviceAccountSubscription.unsubscribe();
    this.renewalStoreSubscription.unsubscribe();
  }
  ChevClicked() {
    this.chev_clicked = !this.chev_clicked;
  }
}
