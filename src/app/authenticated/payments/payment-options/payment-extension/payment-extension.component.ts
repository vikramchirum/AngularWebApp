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
  constructor(private activeServiceAccount: ServiceAccountService,
              private paymentExtensionService: PaymentExtensionService
  ) {}

  ngOnInit() {
    this.serviceAccountDetailsSubscription  = this.activeServiceAccount.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccountDetails => { this.serviceAccountDetails = ActiveServiceAccountDetails;
      this.pastDueAmount = ActiveServiceAccountDetails.Past_Due;  console.log('paste due', this.pastDueAmount); }
    );
  }

  requestExtension(): void {
    this.requestedExtension = true;
    this.paymentExtensionServiceSubscription = this.paymentExtensionService.getPaymentExtensionStatus(this.serviceAccountDetails.Id).subscribe(
      paymentExtensionStatus => {
        this.paymentExtension = paymentExtensionStatus;
        if (paymentExtensionStatus.Status === String(ExtensionStatus.SUCCESSFUL)) {
          this.extensionSuccessfull = true;
        } else {
          this.extensionSuccessfull = false;
        }
      }
    );
  }
  cancelExtension() {
    console.log('hi cancelled');
    this.requestedExtension = false;
    this.paymentExtension = null;
    this.extensionSuccessfull = false;
  }

  ngOnDestroy() {
    this.serviceAccountDetailsSubscription.unsubscribe();
    if (this.paymentExtensionServiceSubscription) {
      this.paymentExtensionServiceSubscription.unsubscribe();
    }
  }

}
