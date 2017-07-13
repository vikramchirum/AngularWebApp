import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BillingAccountService } from 'app/core/BillingAccount.service';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { IBill } from 'app/core/models/bill.model';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { PaymentsService } from 'app/core/payments.service';
import { PaymethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { PaymethodService } from 'app/core/Paymethod.service';
import { IPaymethodRequestCreditCard, IPaymethodRequestEcheck, PaymethodClass } from 'app/core/models/Paymethod.model';
import { FloatToMoney } from 'app/shared/pipes/FloatToMoney.pipe';
import { validMoneyAmount } from 'app/validators/validator';
import { Subscription } from 'rxjs/Subscription';
import { get, result } from 'lodash';
import {CustomerAccountClass} from "../../../core/models/CustomerAccount.model";

@Component({
  selector: 'mygexa-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit, OnDestroy {

  paymentOneTimeType: string = null;
  paymentOneTimeValid: boolean = null;
  formGroup: FormGroup = null;

  PaymethodSelected: PaymethodClass = null;

  @ViewChild(PaymethodAddCcComponent) private addCreditCardComponent: PaymethodAddCcComponent;
  @ViewChild(PaymethodAddEcheckComponent) private addEcheckComponent: PaymethodAddEcheckComponent;

  private CustomerAccountSubscription: Subscription = null;
  private CustomerAccount: CustomerAccountClass = null;

  private PaymethodSubscription: Subscription = null;
  private _Paymethods: PaymethodClass[] = null;
  get Paymethods(): PaymethodClass[] { return this._Paymethods; }
  set Paymethods(Paymethods: PaymethodClass[]) {
    this._Paymethods = Paymethods;
    if (Paymethods.length > 0) {
      this.paymentSelectMethod(null, Paymethods[0]);
    } else {
      this.paymentOneTime(null, 'CreditCard');
    }
  }

  private _LatestInvoice: IBill = null;
  get LatestInvoice(): IBill { return this._LatestInvoice; }
  set LatestInvoice(LatestInvoice: IBill) {
    this._LatestInvoice = LatestInvoice;
    this.formGroup.controls['payment_now'].setValue(`$${FloatToMoney(LatestInvoice.Current_Charges + LatestInvoice.Balance_Forward)}`);
  }

  private ActiveBillingAccountSubscription: Subscription = null;
  private _ActiveBillingAccount: BillingAccountClass = null;
  get ActiveBillingAccount(): BillingAccountClass { return this._ActiveBillingAccount; }
  set ActiveBillingAccount(ActiveBillingAccount: BillingAccountClass) {
    this._ActiveBillingAccount = ActiveBillingAccount;
    if (ActiveBillingAccount) {
      this.InvoiceService.getBill(ActiveBillingAccount.Latest_Invoice_Id).subscribe(
        LatestInvoice => this.LatestInvoice = LatestInvoice
      );
    }
  }

  constructor(
    private CustomerAccountService: CustomerAccountService,
    private PaymentsService: PaymentsService,
    private PaymethodService: PaymethodService,
    private FormBuilder: FormBuilder,
    private BillingAccountService: BillingAccountService,
    private InvoiceService: InvoiceService
  ) {
    this.formGroup = FormBuilder.group({
      payment_now: ['', Validators.compose([Validators.required, validMoneyAmount])],
      payment_save: ['']
    });
  }

  ngOnInit() {
    this.CustomerAccountSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      CustomerAccount => this.CustomerAccount = CustomerAccount
    );
    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      ActiveBillingAccount => this.ActiveBillingAccount = ActiveBillingAccount
    );
  }

  ngOnDestroy() {
    this.CustomerAccountSubscription.unsubscribe();
    this.PaymethodSubscription.unsubscribe();
    this.ActiveBillingAccountSubscription.unsubscribe();
  }

  paymentOneTime($event, type): void {
    result($event, 'preventDefault');
    this.paymentOneTimeType = type || null;
    this.paymentOneTimeValid = false;
    this.PaymethodSelected = null;
    this.formGroup.controls['payment_save'].setValue('');
  }

  paymentOneTimeChanged($event: string): void {
    this.paymentOneTimeValid = $event === 'valid';
  }

  paymentSelectMethod($event, paymentMethod: PaymethodClass): void {
    result($event, 'preventDefault');
    this.paymentOneTimeType = null;
    this.paymentOneTimeValid = true;
    this.PaymethodSelected = paymentMethod;
  }

  get paymentReady(): boolean {
    return (this.formGroup.valid && this.paymentOneTimeValid === true);
  }

  paymentMade(): void { }
  paymentMadeError(): void { }

  paymentSubmit(): void {

    // Determine the Paymethod Data to pass.
    new Promise((resolve, reject) => {

      // If we're selecting a saved method, use it.
      if (this.PaymethodSelected) { return resolve(this.PaymethodSelected); }

      // Otherwise we're using a new paymethod.
      if (this.formGroup.value.payment_save === true) {
        // We are saving the new paymethod.
        if (this.paymentOneTimeType === 'CreditCard') {
          // Add a credit card type paymethod.
          this.PaymethodService.AddPaymethodCreditCardFromComponent(this.addCreditCardComponent).subscribe(
            newPaymethod => {
              this.PaymethodService.UpdatePaymethods();
              resolve(newPaymethod);
            }
          );
        } else {
          // Add an eCheck type paymethod.
          this.PaymethodService.AddPaymethodEcheckFromComponent(this.addEcheckComponent).subscribe(
            newPaymethod => {
              this.PaymethodService.UpdatePaymethods();
              resolve(newPaymethod);
            }
          );
        }
      } else {
        // This is a one-time paymethod - get a forte one-time token.
        this.PaymethodService.GetForteOneTimeToken(this.paymentOneTimeType === 'CreditCard'
          ? {
            account_holder: this.addCreditCardComponent.formGroup.value.cc_name,
            CreditCard: <IPaymethodRequestCreditCard> {
              card_number: this.addCreditCardComponent.formGroup.value.cc_number,
              expire_year: this.addCreditCardComponent.formGroup.value.cc_year,
              expire_month: this.addCreditCardComponent.formGroup.value.cc_month,
              cvv: this.addCreditCardComponent.formGroup.value.cc_ccv
            }
          }
          : {
            account_holder: this.addEcheckComponent.formGroup.value.cc_name,
            Echeck: <IPaymethodRequestEcheck> {
              account_number: this.addEcheckComponent.formGroup.value.echeck_accounting,
              routing_number: this.addEcheckComponent.formGroup.value.echeck_routing,
              other_info: this.addEcheckComponent.formGroup.value.echeck_info
            }
          }
        ).subscribe(
          ForteData => {
            console.log('ForteData', ForteData);
            resolve({
              Token: ForteData.onetime_token,
              Paymethod_Customer: {
                Id: this.CustomerAccount.Id,
                FirstName: this.CustomerAccount.First_Name,
                LastName: this.CustomerAccount.Last_Name
              },
              PaymethodName: "TEMP: My one-time payment paymethod",
              PaymethodType: this.paymentOneTimeType,
              AccountHolder: "string",
              AccountNumber: ForteData.last_4
            });
            // card_type
            //   :
            //   "visa"
            // event
            //   :
            //   "success"
            // expire_month
            //   :
            //   "07"
            // expire_year
            //   :
            //   "2017"
            // last_4
            //   :
            //   "4018"
            // onetime_token
            //   :
            //   "ott_eV2rxqJBSRSt4X7SgFPT6Q"
            // request_id
            //   :
            //   "22e90d9f-1f30-4f25-9d80-5ee2c961b8ea"
            // response_code
            //   :
            //   "A01"
            // response_description
            //   :
            //   "APPROVED"
          },
          error => reject(error)
        );
      }

    })

    // Pass the Paymethod data to the Payments service.
    .then((PaymethodToCharge: PaymethodClass) => {

      const payment_now = <string>get(this.formGroup.value, 'payment_now');

      const AuthorizationAmount = Number(payment_now[0] === '$' ? payment_now.substring(1) : payment_now);

      console.log({ PaymethodToCharge });
      console.log({ AuthorizationAmount });

      // this.PaymentsService.MakePayment(
      //   AuthorizationAmount,
      //   this.ActiveBillingAccount,
      //   PaymethodToCharge
      // ).subscribe(
      //   () => this.paymentMade(),
      //   () => this.paymentMadeError()
      // );

    });

  }

}
