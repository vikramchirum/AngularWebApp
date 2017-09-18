import { Component, OnInit, OnDestroy, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { ModalDirective } from 'ngx-bootstrap';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IUser } from 'app/core/models/user/User.model';
import { IOffers } from 'app/core/models/offers/offers.model';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';

import { ICreateRenewalRequest } from 'app/core/models/renewals/createrenewalrequest.model';
import { ICreateUpgradeRequest } from 'app/core/models/upgrades/createupgraderequest.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { UserService } from 'app/core/user.service';
import { RenewalStore } from 'app/core/store/renewalstore';
import { UpgradeStore } from 'app/core/store/upgradestore';
import { ModalStore } from 'app/core/store/modalstore';

@Component({
  selector: 'mygexa-change-your-plan-card',
  templateUrl: './change-your-plan-card.component.html',
  styleUrls: ['./change-your-plan-card.component.scss']
})
export class ChangeYourPlanCardComponent implements OnInit, OnDestroy {

  @ViewChild('pop') public pop: ModalDirective;
  @Input('offer') offer: IOffers;
  @Input('isRenewal') isRenewal: boolean;

  renewalUpgradeFormGroup: FormGroup;

  customerDetails: CustomerAccount;
  activeServiceAccountDetails: ServiceAccount = null;
  user: IUser;

  priceAtFeaturedUsageLevel: number;
  isOfferSelected = false;
  isOfferAgreed = false;
  productFeaturesSelected = false;

  userServiceSubscription: Subscription;
  activeServiceAccountSubscription: Subscription;
  customerAccountServiceSubscription: Subscription;
  handleOfferPopOversModalSubscription: Subscription;

  constructor(private userService: UserService,
              private serviceAccount_service: ServiceAccountService,
              private customerAccountService: CustomerAccountService,
              private renewalStore: RenewalStore,
              private upgradeStore: UpgradeStore,
              private modalStore: ModalStore,
              private formBuilder: FormBuilder,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {

    this.renewalUpgradeFormGroup = this.formBuilder.group({
      accountName: ['', Validators.required],
      rewardsNumber: ['', Validators.required]
    });

   this.handleOfferPopOversModalSubscription =  this.modalStore.HandleOfferPopOversModal.subscribe(rateCode => {
      if (this.offer) {
        if (this.offer.Rate_Code !== rateCode) {
          if (this.pop) {
            this.pop.hide();
          }
          this.isOfferSelected = false;
        }
      }
    });

    this.customerAccountServiceSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(result => {
      this.customerDetails = result;
    });

    this.userServiceSubscription = this.userService.UserObservable.subscribe(result => {
      this.user = result;
    });

    this.activeServiceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.filter(activeServiceAccount => activeServiceAccount != null)
      .subscribe(result => {
        this.activeServiceAccountDetails = result;
      });
  }

  checkFeaturedUsageLevel(offer: IOffers) {
    const renewalOfferFeaturedUsageLevel = offer.Plan.Product.Featured_Usage_Level;
    if (renewalOfferFeaturedUsageLevel) {
      switch (renewalOfferFeaturedUsageLevel) {
        case  '500 kWh': {
          this.priceAtFeaturedUsageLevel = offer.Price_At_500_kwh;
          break;
        }
        case  '1000 kWh': {
          this.priceAtFeaturedUsageLevel = offer.Price_At_1000_kwh;
          break;
        }
        case  '2000 kWh': {
          this.priceAtFeaturedUsageLevel = offer.Price_At_2000_kwh;
          break;
        }
        default: {
          this.priceAtFeaturedUsageLevel = offer.Price_At_2000_kwh;
          break;
        }
      }
    }
  }

  onProductFeaturesSelected() {
    this.productFeaturesSelected = !this.productFeaturesSelected;
  }

  onSelectOffer(event) {
    event.preventDefault();
    this.isOfferSelected = true;
    this.modalStore.handleOfferPopOversModal(this.offer.Rate_Code);
  }

  toggleButton() {
    this.isOfferAgreed = !this.isOfferAgreed;
  }

  onCloseSelectOffer(event) {
    event.preventDefault();
    this.isOfferSelected = false;
  }

  selectOffer() {
    if (this.isRenewal) {
      this.createRenewal();
    } else {
      this.createUpgrade();
    }
  }

  openOfferDetailsPopOver() {
    this.modalStore.handleOfferPopOversModal(this.offer.Rate_Code);
    this.pop.show();
  }

  isCreateOfferEnabled() {
    if (this.offer.Has_Partner) {
      if (!this.isOfferAgreed) {
        return true;
      }
      if (!this.renewalUpgradeFormGroup.valid) {
        return true;
      }
    } else if (!this.isOfferAgreed) {
      return true;
    }
  }

  private createRenewal() {

    const request = {} as ICreateRenewalRequest;
    request.Service_Account_Id = this.activeServiceAccountDetails.Id;
    request.Offering_Name = this.offer.Rate_Code;
    request.User_Name = this.user.Profile.Username;
    if (this.offer.Has_Partner) {
      request.Partner_Name_On_Account = this.renewalUpgradeFormGroup.get('accountName').value;
      request.Partner_Account_Number = this.renewalUpgradeFormGroup.get('rewardsNumber').value;
    }

    this.modalStore.showPlanConfirmationModal({
      isRenewalPlan: this.isRenewal,
      customerDetails: this.customerDetails
    });

    this.renewalStore.createRenewal(request).subscribe(result => {
      if (result) {
        console.log('done');
      }
    });
  }

  private createUpgrade() {
    const request = {} as ICreateUpgradeRequest;
    request.Service_Account_Id = this.activeServiceAccountDetails.Id;
    request.Offering_Name = this.offer.Rate_Code;
    request.User_Name = this.user.Profile.Username;
    if (this.offer.Has_Partner) {
      request.Partner_Name_On_Account = this.renewalUpgradeFormGroup.get('accountName').value;
      request.Partner_Account_Number = this.renewalUpgradeFormGroup.get('rewardsNumber').value;
    }
    this.upgradeStore.createUpgrade(request).subscribe(result => {
      if (result) {
        this.modalStore.showPlanConfirmationModal({
          isRenewalPlan: this.isRenewal,
          customerDetails: this.customerDetails
        });
      }
    });
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.activeServiceAccountSubscription.unsubscribe();
    this.customerAccountServiceSubscription.unsubscribe();
    this.handleOfferPopOversModalSubscription.unsubscribe();
  }
}
