import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ServiceAccountService} from 'app/core/serviceaccount.service';

import {CustomerAccountService} from 'app/core/CustomerAccount.service';


import {InvoiceService} from 'app/core/invoiceservice.service';
import {PaymentsHistoryService} from 'app/core/payments-history.service';
import {PaymentsService} from 'app/core/payments.service';
import {PaymethodAddCcComponent} from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import {PaymethodAddEcheckComponent} from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import {PaymethodService} from 'app/core/Paymethod.service';
import {UserService} from 'app/core/user.service';
import {FloatToMoney} from 'app/shared/pipes/FloatToMoney.pipe';
import {validMoneyAmount} from 'app/validators/validator';
import {Subscription} from 'rxjs/Subscription';
import {assign, endsWith, get, replace, result} from 'lodash';
import {CustomerAccount} from '../../../core/models/customeraccount/customeraccount.model';
import {Paymethod} from '../../../core/models/paymethod/Paymethod.model';
import {IPaymethodRequest} from '../../../core/models/paymethod/paymethodrequest.model';
import {IPaymethodRequestEcheck} from '../../../core/models/paymethod/paymethodrequestecheck.model';
import {IPaymethodRequestCreditCard} from '../../../core/models/paymethod/paymethodrequestcreditcard.model';
import {CardBrands} from '../../../core/models/paymethod/constants';
import {ServiceAccount} from '../../../core/models/serviceaccount/serviceaccount.model';
import {IInvoice} from '../../../core/models/invoices/invoice.model';

@Component({
  selector: 'mygexa-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit, OnDestroy {

  paymentOneTimeType: string = null;
  paymentOneTimeValid: boolean = null;
  paymentSubmittedWithoutError: boolean = null;
  formGroup: FormGroup = null;

  PaymethodSelected: Paymethod = null;

  @ViewChild(PaymethodAddCcComponent) private addCreditCardComponent: PaymethodAddCcComponent;
  @ViewChild(PaymethodAddEcheckComponent) private addEcheckComponent: PaymethodAddEcheckComponent;

  private UserCustomerAccountSubscription: Subscription = null;
  private CustomerAccountSubscription: Subscription = null;
  private CustomerAccount: CustomerAccount = null;
  private CustomerAccountId: string = null;

  private _paymentLoadingMessage: string = null;
  get paymentLoadingMessage(): string {
    return this._paymentLoadingMessage;
  }

  set paymentLoadingMessage(paymentLoadingMessage) {
    this._paymentLoadingMessage = paymentLoadingMessage;
    // If there is a loading message then disable all forms, otherwise enable them.
    const formsAction = paymentLoadingMessage ? 'disable' : 'enable';
    this.formGroup[formsAction]();
    result(this, `addEcheckComponent.formGroup.${formsAction}`);
    result(this, `addEcheckComponent.formGroup.${formsAction}`);
  }

  private PaymethodSubscription: Subscription = null;
  private _Paymethods: Paymethod[] = null;
  get Paymethods(): Paymethod[] {
    return this._Paymethods;
  }

  set Paymethods(Paymethods: Paymethod[]) {
    this._Paymethods = Paymethods;
    if (Paymethods.length > 0) {
      this.paymentSelectMethod(null, Paymethods[0]);
    } else {
      this.paymentOneTime(null, 'CreditCard');
    }
  }

  private _LatestInvoice: IInvoice = null;
  get LatestInvoice(): IInvoice {
    return this._LatestInvoice;
  }

  set LatestInvoice(LatestInvoice: IInvoice) {
    this._LatestInvoice = LatestInvoice;
    this.formGroup.controls['payment_now'].setValue(`$${FloatToMoney(LatestInvoice.Current_Charges + LatestInvoice.Balance_Forward)}`);
  }

  private ActiveServiceAccountSubscription: Subscription = null;
  private _ActiveServiceAccount: ServiceAccount = null;
  get ActiveServiceAccount(): ServiceAccount {
    return this._ActiveServiceAccount;
  }

  set ActiveServiceAccount(ActiveServiceAccount: ServiceAccount) {
    this._ActiveServiceAccount = ActiveServiceAccount;
    if (ActiveServiceAccount) {
      this.InvoiceService.getLatestInvoiceId(ActiveServiceAccount.Id).subscribe(
        resp => {
          this.InvoiceService.getInvoice(resp, ActiveServiceAccount.Id).subscribe(
            LatestInvoice => this.LatestInvoice = LatestInvoice
          );
        });
    }
  }

  constructor(private CustomerAccountService: CustomerAccountService,
              private PaymentsHistoryService: PaymentsHistoryService,
              private PaymentsService: PaymentsService,
              private PaymethodService: PaymethodService,
              private FormBuilder: FormBuilder,
              private ServiceAccountService: ServiceAccountService,
              private InvoiceService: InvoiceService,
              private UserService: UserService) {
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
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => this.ActiveServiceAccount = ActiveServiceAccount
    );
    this.UserCustomerAccountSubscription = this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => this.CustomerAccountId = CustomerAccountId
    );
  }

  ngOnDestroy() {
    this.CustomerAccountSubscription.unsubscribe();
    this.PaymethodSubscription.unsubscribe();
    this.ActiveServiceAccountSubscription.unsubscribe();
    this.UserCustomerAccountSubscription.unsubscribe();
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

  paymentSelectMethod($event, paymentMethod: Paymethod): void {
    result($event, 'preventDefault');
    this.paymentOneTimeType = null;
    this.paymentOneTimeValid = true;
    this.PaymethodSelected = paymentMethod;
  }

  get paymentReady(): boolean {
    return (this.formGroup.valid && this.paymentOneTimeValid === true);
  }

  paymentSubmit(): void {

    // Remove any previous message.
    this.paymentSubmittedWithoutError = null;

    // Determine the Paymethod Data to pass.
    new Promise((resolve, reject) => {

      // If we're selecting a saved method, use it.
      if (this.PaymethodSelected) {
        return resolve({
          PaymethodId: this.PaymethodSelected.PayMethodId,
          Paymethod_Customer: {
            Id: `${this.CustomerAccountId}${endsWith(this.CustomerAccountId, '-1') ? '' : '-1'}`,
            FirstName: this.CustomerAccount.First_Name,
            LastName: this.CustomerAccount.Last_Name
          }
        });
      }

      this.paymentLoadingMessage = 'Preparing your payment...';

      // Otherwise we're using a new paymethod.
      if (this.formGroup.value.payment_save === true) {
        // We are saving the new paymethod.
        if (this.paymentOneTimeType === 'CreditCard') {
          // Add a credit card type paymethod.
          this.PaymethodService.AddPaymethodCreditCardFromComponent(this.addCreditCardComponent).subscribe(
            newPaymethod => resolve(newPaymethod),
            error => console.log('Better handle the error', error),
            () => this.PaymethodService.UpdatePaymethods()
          );
        } else {
          // Add an eCheck type paymethod.
          this.PaymethodService.AddPaymethodEcheckFromComponent(this.addEcheckComponent).subscribe(
            newPaymethod => resolve(newPaymethod),
            error => console.log('Better handle the error', error),
            () => this.PaymethodService.UpdatePaymethods()
          );
        }
      } else {
        // This is a one-time paymethod - get a forte one-time token.
        const onetimePaymethod = this.paymentOneTimeType === 'CreditCard'
          ? {
            CreditCard: <IPaymethodRequestCreditCard> {
              card_number: this.addCreditCardComponent.formGroup.value.cc_number,
              expire_year: this.addCreditCardComponent.formGroup.value.cc_year,
              expire_month: this.addCreditCardComponent.formGroup.value.cc_month,
              cvv: this.addCreditCardComponent.formGroup.value.cc_ccv
            }
          } : {
            Echeck: <IPaymethodRequestEcheck> {
              account_number: this.addEcheckComponent.formGroup.value.echeck_accounting,
              account_type: 'c',
              routing_number: this.addEcheckComponent.formGroup.value.echeck_routing,
              other_info: this.addEcheckComponent.formGroup.value.echeck_info
            }
          };
        this.PaymethodService.GetForteOneTimeToken(<IPaymethodRequest>onetimePaymethod).subscribe(
          ForteData => resolve(assign({
              UserName: this.UserService.UserCache.Profile.Username,
              Token: ForteData.onetime_token,
              Paymethod_Customer: {
                Id: `${this.CustomerAccountId}${endsWith(this.CustomerAccountId, '-1') ? '' : '-1'}`,
                FirstName: this.CustomerAccount.First_Name,
                LastName: this.CustomerAccount.Last_Name
              },
              PaymethodName: 'TEMP: My one-time payment paymethod',
              AccountNumber: ForteData.last_4
            }, this.paymentOneTimeType === 'CreditCard'
              ? {
                PaymethodType: 'CreditCard',
                AccountHolder: this.addCreditCardComponent.formGroup.value.cc_name.toUpperCase(),
                CreditCardType: replace(get(CardBrands, ForteData.card_type, 'Unknown'), ' ', '')
              } : {
                PaymethodType: 'eCheck',
                AccountHolder: this.addEcheckComponent.formGroup.value.echeck_name.toUpperCase(),
                RoutingNumber: get(onetimePaymethod, 'Echeck.routing_number')
              }
          )),
          error => reject(error)
        );
      }

    })

    // Catch any errors from getting the Paymethod.
      .catch(error => {
        console.log('An error occurred getting the Paymethod to charge. error = ', error);
        alert('An error occurred and needs to be handled.\nPlease view the console.');
        this.paymentLoadingMessage = null;
      })

      // Pass the Paymethod data to the Payments service.
      .then((PaymethodToCharge: Paymethod) => {

        this.paymentLoadingMessage = 'Submitting your payment...';

        const payment_now = <string>get(this.formGroup.value, 'payment_now');

        const AuthorizationAmount = Number(payment_now[0] === '$' ? payment_now.substring(1) : payment_now);

        this.PaymentsService.MakePayment(
          AuthorizationAmount,
          this.ActiveServiceAccount,
          PaymethodToCharge
        ).subscribe(
          res => {
            this.paymentSubmittedWithoutError = true;
            console.log('The paymethod was charged!', res);
            this.paymentLoadingMessage = null;
          },
          error => {
            this.paymentSubmittedWithoutError = false;
            console.log('An error occurred charging the paymethod!', error);
            this.paymentLoadingMessage = null;
          },
          () => this.PaymentsHistoryService.AddNewPaymentToHistory({
            PaymentDate: new Date,
            PaymentAmount: AuthorizationAmount,
            PaymentStatus: 'Processing',
            PaymentMethod: PaymethodToCharge.CreditCard ? 'Credit Card' : 'eCheck',
            PaymentAccount: PaymethodToCharge.CreditCard ? PaymethodToCharge.CreditCard.AccountNumber : PaymethodToCharge.BankAccount.AccountNumber
          })
        );

      });

  }

}
