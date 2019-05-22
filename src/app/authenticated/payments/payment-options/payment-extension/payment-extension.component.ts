import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';

import * as moment from 'moment';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { IPaymentExtension } from 'app/core/models/paymentextension/payment-extension.model';
import { IPaymentExtensionV1 } from 'app/core/models/paymentextension/payment-extension-v1.model';
import { ExtensionStatus } from 'app/core/models/enums/extensionstatus';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import {CustomerAccountService} from 'app/core/CustomerAccount.service';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { PaymentExtensionService } from 'app/core/payment-extension.service';
import { IPaymentExtensionGrantRequest } from '../../../../core/models/paymentextension/payment-extention-grant-request.model';
import { IPaymentExtensionGrantResponse } from '../../../../core/models/paymentextension/payment-extention-grant-response.model';
import { IPaymentExtensionIneligibleNote } from 'app/core/models/paymentextension/payment-extension-ineligible-note.model';

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
  paymentExtensionIneligibleSubscription: Subscription = null;

  paymentExtensionStatus: boolean = null;
  paymentExtension: IPaymentExtensionGrantResponse = null;
  paymentExtensionRequired: boolean = null;

  paymentExtensionEligibilityResult: string = null;

  paymentExtensionScript: string = null;
  newDueDate: any = null;

  customerDetails: CustomerAccount = null;
  CustomerAccountServiceSubscription: Subscription = null;

  serviceAccountDetails: ServiceAccount;
  pastDueAmount: number = null;
  requestedExtension: boolean = null;
  extensionSuccessfull: boolean = null;
  pastDueSet = false;
  followupDate: Date = null;

  constructor(private activeServiceAccount: ServiceAccountService,
              private paymentExtensionService: PaymentExtensionService,
              private CustomerAccountService: CustomerAccountService) {
  }

  ngOnInit() {
    this.setPastDue();

    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => { this.customerDetails = result;
      }
    );
  }

  setPastDue() {

    this.serviceAccountDetailsObservable = this.activeServiceAccount.ActiveServiceAccountObservable;
    this.serviceAccountDetailsObservable.subscribe(serviceAccount => {
      this.serviceAccountDetails = serviceAccount;
      this.paymentExtensionServiceObservable = this.paymentExtensionService.checkPaymentExtensionStatus(this.serviceAccountDetails.Id);
      this.pastDueObservable = this.activeServiceAccount.getPastDue(this.serviceAccountDetails.Id);
      this.paymentExtensionSubscription = forkJoin(this.paymentExtensionServiceObservable, this.pastDueObservable).subscribe(results => {
        this.resetExtension();
        this.paymentExtensionEligibilityResult = results[0].EligibilityResult;
        this.setPaymentExtensionScript(results[0] as IPaymentExtensionV1);
        if (results[0].Status !== ExtensionStatus[ExtensionStatus.SUCCESSFUL]){
          const ineligibleNote: IPaymentExtensionIneligibleNote = {
            ServiceAccountId: this.serviceAccountDetails.Id,
            CSRName: "MyGexa",
            Notes: this.paymentExtensionScript
          };
          this.sendIneligibilityNote(ineligibleNote);
        }
        this.paymentExtensionStatus = (results[0] && results[0].Status === ExtensionStatus[ExtensionStatus.ALREADY_APPROED]);
        if (this.paymentExtensionStatus) {
          this.followupDate = results[0].FollowupDate;
        }
        this.pastDueAmount = results[1];
        this.paymentExtensionRequired = (!this.paymentExtensionStatus && this.pastDueAmount <= 0) ? false : true;
        this.pastDueSet = true;
      });
    });
  }

  requestExtension(): void {
    this.requestedExtension = true;

    let grantRequest: IPaymentExtensionGrantRequest = {
      ServiceAccountId: this.serviceAccountDetails.Id,
      CSRName: "MyGexa",
      paymentExtensionDate: this.newDueDate
    };

    this.paymentExtensionServiceSubscription = this.paymentExtensionService.getPaymentExtensionStatus(grantRequest).subscribe(
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

  setPaymentExtensionScript(result: IPaymentExtensionV1) {
    const customerName = `${this.customerDetails.First_Name.charAt(0).toUpperCase()}${this.customerDetails.First_Name.slice(1).toLowerCase()} ${this.customerDetails.Last_Name.charAt(0).toUpperCase()}${this.customerDetails.Last_Name.slice(1).toLowerCase()}`;
    if(result.DisconnectletterInfo != null)
    {
        this.newDueDate = moment(new Date(result.DisconnectletterInfo.DisconnectActionDate), "MM/DD/YYYY").add(environment.payment_extension_days, "days").format("MM/DD/YYYY");
    }

    if(result.EligibilityResult === 'SOFT_STOP') {
      this.paymentExtensionScript = `An Extension Payment Arrangement has been granted for the account. If this arrangement is not satisfied as agreed upon by paying $${result.PastDue.toString()} by ${this.newDueDate}, it will be deemed as a broken and voided payment arrangement. If this occurs, the account can be subject to Suspension activity and will not be eligible for another extension for the next 6 months.`;
    } else {
      switch(result.Status) {
        case ExtensionStatus[ExtensionStatus.CSP_NOT_ACTIVE]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time. Your Gexa Energy account is not active.`;
            break;
        case ExtensionStatus[ExtensionStatus.NO_PASS_DUE_FOUND]:
            this.paymentExtensionScript = `There is currently no past due amount on this account at this time.`;
            break;
        case ExtensionStatus[ExtensionStatus.CSP_STOP_REQUEST_FOUND]:
          this.paymentExtensionScript = `A Payment Extension is not available on this account. A Service Stop Date exist. Payments can be made by selecting “Make a Payment” here in your MyGexa online account.`;
          break;
        case ExtensionStatus[ExtensionStatus.ALREADY_APPROED]:
            this.paymentExtensionScript = `A Payment Extension has already been placed on this account. Another Extension is not available at this time.`;
            break;
        case ExtensionStatus[ExtensionStatus.NO_SUSPENSION_LETTER_ISSUED]:
            this.paymentExtensionScript = `At this time, a Payment Extension is not available. A Disconnection Letter has not generated for this account. You may resubmit this request in the future.`;
            break;
        case ExtensionStatus[ExtensionStatus.NO_ACTION_DATE_FOUND]:
            this.paymentExtensionScript = `At this time, a Payment Extension is not available. A Disconnection Letter has not generated for this account. You may resubmit this request in the future.`;
            break;
        case ExtensionStatus[ExtensionStatus.EXPIRED_DISCONNECT_DATE]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time. The Disconnection Letter has expired. Please make your payment immediately by selecting “Make a Payment” here in your MyGexa online account.`;
            break;
        case ExtensionStatus[ExtensionStatus.SUSPENSION_ORDER_ISSUED]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time. The Disconnection Letter has expired. Please make your payment immediately by selecting “Make a Payment” here in your MyGexa online account.`;
            break;
        case ExtensionStatus[ExtensionStatus.DEPOSIT_CHARGE_FOUND]:
            this.paymentExtensionScript = `The account is not eligible for a Payment Extension. The deposit requirement of $${result.DepositBalance.toString()} has not been satisfied. This option may be available in the future after the deposit is satisfied and payment history is established. Payments can be made by selecting “Make a Payment” here in your MyGexa online account.`;
            break;
        case ExtensionStatus[ExtensionStatus.FEWER_BILL_COUNT_FOUND]:
            this.paymentExtensionScript = `A Payment Extension is not available on the first bill. Payment history must be established for this account. Payments can be made by selecting “Make a Payment” here in your MyGexa online account.`;
            break;
        case ExtensionStatus[ExtensionStatus.BALANCE_TRANSFER_FOUND]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time due to an outstanding balance from a previous account. This option may be available in the future after the Balance Tranfer amount is satisfied. Payments can be made by selecting “Make a Payment” here in your MyGexa online account.`;
            break;
        case ExtensionStatus[ExtensionStatus.NFS_FOUND]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time due to multiple insufficient funds (NSF) payments. This option may be available in the future after satisfactory payment history has been established.`;
            break;
        case ExtensionStatus[ExtensionStatus.BROKEN_ARRANGEMENT_FOUND]:
        case ExtensionStatus[ExtensionStatus.UNPAID_ARRANGEMENT_DUE]:
        case ExtensionStatus[ExtensionStatus.UNPAID_PASS_DUE]:
        case ExtensionStatus[ExtensionStatus.NONE_PAID_UNTIL_FOLLOWUPDATE]:
        case ExtensionStatus[ExtensionStatus.EXCESSIVE_BROKEN_ARRANGEMENT_FOUND]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time due to a previous broken Payment Extension arrangement found on the account. This option may be available in the future after satisfactory payment history has been established.`;
            break;
        case ExtensionStatus[ExtensionStatus.NON_PAYMENT_ORDER_FOUND_IN_LAST_SIX_MONTHS]:
            this.paymentExtensionScript = `A Payment Extension is not available at this time. This option may be available in the future after satisfactory payment history has been established.`;
            break;
        case ExtensionStatus[ExtensionStatus.SUCCESSFUL]:
            this.paymentExtensionScript = `An Extension Payment Arrangement has been granted for the account. If this arrangement is not satisfied as agreed upon by paying $${result.PastDue.toString()} by ${this.newDueDate}, it will be deemed as a broken and voided payment arrangement. If this occurs, the account can be subject to Suspension activity and will not be eligible for another extension for the next 6 months.`;
            break;
        default:
            this.paymentExtensionScript = result.Status.toString();
            break;
      }
    }
  }

  sendIneligibilityNote(ineligibleNote: IPaymentExtensionIneligibleNote) {
    this.paymentExtensionIneligibleSubscription = this.paymentExtensionService
      .savePaymentExtensionIneligibleNote(ineligibleNote)
      .subscribe(success => console.log(success));
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
