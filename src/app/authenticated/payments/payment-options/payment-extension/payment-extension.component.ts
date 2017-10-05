import {Component, OnDestroy, OnInit} from '@angular/core';
import { ServiceAccount } from '../../../../core/models/serviceaccount/serviceaccount.model';
import { ServiceAccountService } from '../../../../core/serviceaccount.service';
import { PaymentExtensionService } from '../../../../core/payment-extension.service';
import { IPaymentExtension } from '../../../../core/models/paymentextension/payment-extension.model';
import { Subscription } from 'rxjs/Subscription';
import { ExtensionStatus } from '../../../../core/models/enums/extensionstatus';

@Component({
  selector: 'mygexa-payment-extension',
  templateUrl: './payment-extension.component.html',
  styleUrls: ['./payment-extension.component.scss']
})
export class PaymentExtensionComponent implements OnInit, OnDestroy {
  PaymentExtensionResponseStatus: ExtensionStatus;
  customer_On_Payment_Extension: boolean = null;
  paymentExtension: IPaymentExtension = null;
  paymentExtensionServiceSubscription: Subscription = null;
  serviceAccountDetailsSubscription: Subscription = null;
  serviceAccountDetails: ServiceAccount;
  pastDueAmount: number = null;
  requestedExtension: boolean = null;
  extensionSuccessfull: boolean = null;
  pastDueSet: boolean = null;
  constructor(private activeServiceAccount: ServiceAccountService,
              private paymentExtensionService: PaymentExtensionService
  ) {
    this.pastDueSet = false;
  }

  ngOnInit() {
    this.setPastDue();
  }

  setPastDue() {
    this.serviceAccountDetailsSubscription  = this.activeServiceAccount.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccountDetails => {  this.cancelExtension(); this.serviceAccountDetails = ActiveServiceAccountDetails;
        this.pastDueAmount = ActiveServiceAccountDetails.Past_Due; this.pastDueSet = true; console.log('paste due', this.pastDueAmount); }
    );
  }

  requestExtension(): void {
    this.requestedExtension = true;
    this.paymentExtensionServiceSubscription = this.paymentExtensionService.getPaymentExtensionStatus(this.serviceAccountDetails.Id).subscribe(
      paymentExtensionStatus => {
        this.paymentExtension = paymentExtensionStatus;
        if (paymentExtensionStatus.Status === String(ExtensionStatus.SUCCESSFUL)) {
          this.extensionSuccessfull = true;
        } else if (paymentExtensionStatus.Status === String(ExtensionStatus.NO_PASS_DUE_FOUND)) {
          this.cancelExtension();
        } else {
          this.extensionSuccessfull = false;
        }
      }
    );
  }
  cancelExtension() {
    console.log('hi cancelled');
    this.requestedExtension = null;
    this.paymentExtension = null;
    this.extensionSuccessfull = null;
    this.pastDueAmount = null;
    // this.pastDueSet = null;
  }

  ngOnDestroy() {
    this.serviceAccountDetailsSubscription.unsubscribe();
    if (this.paymentExtensionServiceSubscription) {
      this.paymentExtensionServiceSubscription.unsubscribe();
    }
  }

  // TODo: Add date and check if user is already on payment extension.

}
