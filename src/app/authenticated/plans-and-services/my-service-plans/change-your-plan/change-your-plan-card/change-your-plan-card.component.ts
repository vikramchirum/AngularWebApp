import {Component, OnInit, ViewChild, OnDestroy, Input, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';


import {IOffers} from '../../../../../core/models/offers/offers.model';
import {ServiceAccountService} from 'app/core/serviceaccount.service';
import {ServiceAccount} from '../../../../../core/models/serviceaccount/serviceaccount.model';
import {OfferDetailsPopoverComponent} from '../offer-details-popover/offer-details-popover.component';

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy {

  @Input() Offer: IOffers;

  selectCheckBox = false;
  IsInRenewalTimeFrame: boolean;
  activeServiceAccountDetails: ServiceAccount;
  serviceAccountSubscription: Subscription;
  enableSelect = false;
  chev_clicked: boolean;

  constructor(private serviceAccountService: ServiceAccountService,
  private viewContainerRef: ViewContainerRef) {
    this.chev_clicked = false;
  }

  ngOnInit() {
    this.serviceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.activeServiceAccountDetails = result;
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
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
  }
  ChevClicked() {
    this.chev_clicked = !this.chev_clicked;
  }
}
