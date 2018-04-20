import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IPaymentExtension } from 'app/core/models/paymentextension/payment-extension.model';
import { ExtensionStatus } from 'app/core/models/enums/extensionstatus';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { PaymentExtensionService } from 'app/core/payment-extension.service';

@Component({
  selector: 'mygexa-payment-extension',
  templateUrl: './payment-extension.component.html',
  styleUrls: ['./payment-extension.component.scss']
})
export class PaymentExtensionComponent implements OnInit, OnDestroy {

  paymentExtensionServiceObservable: Observable<any> = null;
  serviceAccountDetailsObservable: Observable<any> = null;
  pastDueObservable: Observable<any> = null;

  paymentExtensionServiceSubscription: Subscription = null;
  paymentExtensionSubscription: Subscription = null;

  paymentExtensionStatus: boolean = null;
  paymentExtension: IPaymentExtension = null;
  paymentExtensionRequired: boolean = null;

  serviceAccountDetails: ServiceAccount;
  pastDueAmount: number = null;
  requestedExtension: boolean = null;
  extensionSuccessfull: boolean = null;
  pastDueSet = false;

  constructor(private activeServiceAccount: ServiceAccountService,
              private paymentExtensionService: PaymentExtensionService) {
  }

  ngOnInit() {
    this.setPastDue();
  }

  setPastDue() {

    this.serviceAccountDetailsObservable = this.activeServiceAccount.ActiveServiceAccountObservable;
    this.serviceAccountDetailsObservable.subscribe(serviceAccount => {
      this.serviceAccountDetails = serviceAccount;
      this.paymentExtensionServiceObservable = this.paymentExtensionService.checkPaymentExtensionStatus(this.serviceAccountDetails.Id);
      this.pastDueObservable = this.activeServiceAccount.getPastDue(this.serviceAccountDetails.Id);
      this.paymentExtensionSubscription = forkJoin(this.paymentExtensionServiceObservable, this.pastDueObservable).subscribe(results => {
        this.resetExtension();
        this.paymentExtensionStatus = (results[0] && results[0].Status === ExtensionStatus[ExtensionStatus.ALREADY_APPROED]);
        this.pastDueAmount = results[1];
        this.paymentExtensionRequired = (!this.paymentExtensionStatus && this.pastDueAmount <= 0) ? false : true;
        this.pastDueSet = true;
      });
    });
  }

  requestExtension(): void {
    this.requestedExtension = true;
    this.paymentExtensionServiceSubscription = this.paymentExtensionService.getPaymentExtensionStatus(this.serviceAccountDetails.Id).subscribe(
      paymentExtensionStatus => {
        this.paymentExtension = paymentExtensionStatus;
        if (paymentExtensionStatus.Status === ExtensionStatus[ExtensionStatus.SUCCESSFUL]) {
          this.extensionSuccessfull = true;
        } else if (paymentExtensionStatus.Status === ExtensionStatus[ExtensionStatus.NO_PASS_DUE_FOUND]) {
          this.resetExtension();
        } else {
          this.extensionSuccessfull = false;
        }
      }
    );
  }

  resetExtension() {
    this.requestedExtension = null;
    this.paymentExtension = null;
    this.extensionSuccessfull = null;
    this.pastDueAmount = null;
    this.pastDueSet = null;
  }

  ngOnDestroy() {

    if (this.paymentExtensionSubscription) {
      this.paymentExtensionSubscription.unsubscribe();
    }

    if (this.paymentExtensionServiceSubscription) {
      this.paymentExtensionServiceSubscription.unsubscribe();
    }
  }
}
