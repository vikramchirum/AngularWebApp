import { Component , OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder , FormGroup, Validators} from '@angular/forms';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { PaymentsHistoryService } from 'app/core/payments-history.service';
import { PaymentsService } from 'app/core/payments.service';
import { PaymethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { PaymethodService } from 'app/core/Paymethod.service';
import { UserService } from 'app/core/user.service';
import { FloatToMoney } from 'app/shared/pipes/FloatToMoney.pipe';
import { validMoneyAmount } from 'app/validators/validator';
import { Subscription } from 'rxjs/Subscription';
import { assign , endsWith, get, replace, result} from 'lodash';
import { CustomerAccount } from '../../../core/models/customeraccount/customeraccount.model';
import { Paymethod } from '../../../core/models/paymethod/Paymethod.model';
import { IPaymethodRequest } from '../../../core/models/paymethod/paymethodrequest.model';
import { IPaymethodRequestEcheck } from '../../../core/models/paymethod/paymethodrequestecheck.model';
import { IPaymethodRequestCreditCard } from '../../../core/models/paymethod/paymethodrequestcreditcard.model';
import { CardBrands } from '../../../core/models/paymethod/constants';
import { ServiceAccount } from '../../../core/models/serviceaccount/serviceaccount.model';
import { IInvoice } from '../../../core/models/invoices/invoice.model';
import { PaymentsHistoryStore } from '../../../core/store/paymentsstore';
import { InvoiceStore } from '../../../core/store/invoicestore';
import { PaymentConfirmationModalComponent } from '../../../shared/components/payment-confirmation-modal/payment-confirmation-modal.component';
import { environment } from '../../../../environments/environment';

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

  totalDue: number;
  pastDue: number;
  pastDueExists: boolean = null;
  exceededDueDate: boolean = null;
  autoPay: boolean;
  paymentStatus: string = null;
  currentView: string = null;
  dueDate: Date = null;
  LatestBillAmount: number;
  LatestBillPaymentDate: Date;
  dollarAmountFormatter: string;
  processing: boolean = null;
  PaymethodSelected: Paymethod = null;

  @ViewChild(PaymethodAddCcComponent) private addCreditCardComponent: PaymethodAddCcComponent;
  @ViewChild(PaymethodAddEcheckComponent) private addEcheckComponent: PaymethodAddEcheckComponent;
  @ViewChild( 'paymentConfirmationModal' ) paymentConfirmationModal: PaymentConfirmationModalComponent;

  private UserCustomerAccountSubscription: Subscription = null;
  private CustomerAccountSubscription: Subscription = null;
  private PaymentHistorySubscription: Subscription = null;
  private LatestInvoiceDetailsSubscription: Subscription = null;
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
    if (this.ActiveServiceAccount) {
      this.formGroup.controls['payment_now'].setValue(`$${FloatToMoney(this.ActiveServiceAccount.Current_Due + this.ActiveServiceAccount.Past_Due)}`);
    }
  }

  private ActiveServiceAccountSubscription: Subscription = null;
  private _ActiveServiceAccount: ServiceAccount = null;
  get ActiveServiceAccount(): ServiceAccount {
    return this._ActiveServiceAccount;
  }

  set ActiveServiceAccount(ActiveServiceAccount: ServiceAccount) {
    this._ActiveServiceAccount = ActiveServiceAccount;
    if (ActiveServiceAccount) {
      this.InvoiceStore.LatestInvoiceDetails.subscribe(
        latestInvoice => {
          if (!latestInvoice) {
            return;
          }
          this.LatestInvoice = latestInvoice;
        });
    }
  }

  constructor(private CustomerAccountService: CustomerAccountService,
              private PaymentsHistoryService: PaymentsHistoryService,
              private PaymentsHistoryStore: PaymentsHistoryStore,
              private PaymentsService: PaymentsService,
              private PaymethodService: PaymethodService,
              private FormBuilder: FormBuilder,
              private ServiceAccountService: ServiceAccountService,
              private InvoiceService: InvoiceService,
              private InvoiceStore: InvoiceStore,
              private UserService: UserService) {
    this.formGroup = FormBuilder.group({
      payment_now: ['', Validators.compose([Validators.required, validMoneyAmount])],
      payment_save: ['']
    });
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.CustomerAccountSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      CustomerAccount => this.CustomerAccount = CustomerAccount
    );
    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => { this.Paymethods = Paymethods; }
    );
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => { this.ActiveServiceAccount = ActiveServiceAccount;
                                this.pastDue = ActiveServiceAccount.Past_Due;
                                this.pastDueExists = this.pastDue > 0 ? true : false;
                                this.totalDue = ActiveServiceAccount.Past_Due + ActiveServiceAccount.Current_Due;
                                this.autoPay = ActiveServiceAccount.Is_Auto_Bill_Pay;
              if (this.ActiveServiceAccount) {
                this.LatestInvoiceDetailsSubscription = this.InvoiceStore.LatestInvoiceDetails.subscribe(
                  latestInvoice => {
                    if (!latestInvoice) {
                      return;
                    }
                    this.dueDate = new Date(latestInvoice.Due_Date);
                    this.dueDate.setDate(this.dueDate.getDate() + 1);
                    this.exceededDueDate = (this.dueDate < new Date()) ? true : false;
                    this.PaymentHistorySubscription = this.PaymentsHistoryStore.PaymentHistory.subscribe(
                      PaymentsHistoryItems => {
                        if (PaymentsHistoryItems && PaymentsHistoryItems.length > 0) {
                          this.paymentStatus = PaymentsHistoryItems[0].PaymentStatus;
                          if (this.paymentStatus === 'In Progress') {
                            this.LatestBillAmount = PaymentsHistoryItems[0].PaymentAmount;
                            this.LatestBillPaymentDate = PaymentsHistoryItems[0].PaymentDate;
                          }
                        }
                        this.setFlags();
                      });
                  }
                );
                            }});
    this.UserCustomerAccountSubscription = this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => this.CustomerAccountId = CustomerAccountId
    );
  }

  setFlags() {
    if (this.ActiveServiceAccount) {
      if (this.pastDueExists) {
        this.currentView = 'PastDuePayNow';
      } else {
        if (!this.autoPay) {
          if (this.paymentStatus === 'In Progress') {
            this.currentView = 'PaymentPending';
          } else {
            this.currentView = 'MakePayment';
          }
        } else {
          this.currentView = 'AutoPay';
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.CustomerAccountSubscription) {
      this.CustomerAccountSubscription.unsubscribe();
    }
    if (this.PaymethodSubscription) {
      this.PaymethodSubscription.unsubscribe();
    }
    if (this.ActiveServiceAccountSubscription) {
      this.ActiveServiceAccountSubscription.unsubscribe();
    }
    if (this.UserCustomerAccountSubscription) {
      this.UserCustomerAccountSubscription.unsubscribe();
    }
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

  onSelection(event: boolean) {
    if (event) {
      this.paymentConfirmationModal.hideConfirmationMessageModal();
      this.paymentSubmit();
    } else {
      this.paymentConfirmationModal.hideConfirmationMessageModal();
      this.formGroup.controls['payment_now'].setValue('');
    }
  }

  checkAmountBeforeSubmit() {
    this.processing = true;
    let payment_entered: string;     let pay_entered: number; let errorMessage: string = null;
    payment_entered = String(get(this.formGroup.value, 'payment_now'));
    if ( payment_entered.substring(0, 1)  === '$') {
      pay_entered = Number(payment_entered.slice(1));
    } else {
      pay_entered = Number(payment_entered);
    }
    console.log('payment', pay_entered);
    // console.log('first char', payment_entered.substring(0, 1) );
    // console.log('payment_entered', pay_entered);
    // pay_entered = Number((String(get(this.formGroup.value, 'payment_now')).slice(1)));
    if (pay_entered !== 0) {
      if ( Number(this.totalDue) < pay_entered ) {
        errorMessage = 'This payment entered is greater than the total amount due, are you sure you want to continue?';
        this.paymentConfirmationModal.showConfirmationMessageModal(errorMessage, false);
      } else if (Number(this.totalDue) > 10 && (pay_entered < 10)) {
        errorMessage = 'Sorry you must make a minimum payment of $10.00';
        this.paymentConfirmationModal.showConfirmationMessageModal(errorMessage, true);
        // console.log('total Due', Number(this.totalDue));
        // console.log('payment_entered', pay_entered);
      } else {
        this.paymentConfirmationModal.hideConfirmationMessageModal();
        this.paymentSubmit();
      }
    } else {
      this.processing = false;
    }
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
        this.processing = false;
      })

      // Pass the Paymethod data to the Payments service.
      .then((PaymethodToCharge: Paymethod) => {

        this.paymentLoadingMessage = 'Submitting your payment...';

        const payment_now = <string>get(this.formGroup.value, 'payment_now');

        const AuthorizationAmount = Number(payment_now[0] === '$' ? payment_now.substring(1) : payment_now);

        const UserName = String(this.UserService.UserCache.Profile.Username);

        this.PaymentsService.MakePayment(
          UserName,
          AuthorizationAmount,
          this.ActiveServiceAccount,
          PaymethodToCharge
        ).subscribe(
          res => {
            this.paymentSubmittedWithoutError = true;
            console.log('The paymethod was charged!', res);
            this.paymentLoadingMessage = null;
            this.PaymentsHistoryStore.LoadPaymentsHistory(this.ActiveServiceAccount);
            this.ServiceAccountService.UpdateServiceAccounts(true);
            this.processing = false;
          },
          error => {
            this.paymentSubmittedWithoutError = false;
            console.log('An error occurred charging the paymethod!', error);
            this.paymentLoadingMessage = null;
            this.processing = false;
          },
          () => { this.PaymentsHistoryService.AddNewPaymentToHistory({
            PaymentDate: new Date,
            PaymentAmount: AuthorizationAmount,
            PaymentStatus: 'Processing',
            PaymentMethod: PaymethodToCharge.CreditCard ? 'Credit Card' : 'eCheck',
            PaymentAccount: PaymethodToCharge.CreditCard ? PaymethodToCharge.CreditCard.AccountNumber : PaymethodToCharge.BankAccount.AccountNumber
      });

          }
        );

      });

  }

}
