import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaymethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { PaymethodService } from 'app/core/Paymethod.service';
import { PaymethodClass } from 'app/core/models/Paymethod.model';
import { Bill, BillService } from 'app/core/Bill';
import { NumberToMoneyPipe } from 'app/shared/pipes/NumberToMoney.pipe';
import { validMoneyAmount } from 'app/validators/validator';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit, OnDestroy {

  paymentOneTimeType: string = null;
  paymentOneTimeValid: boolean = null;
  formGroup: FormGroup = null;

  Bill: Bill = null;
  PaymethodSelected: PaymethodClass = null;

  @ViewChild(PaymethodAddCcComponent)
  private addCreditCardComponent: PaymethodAddCcComponent;
  @ViewChild(PaymethodAddEcheckComponent)
  private addEcheckComponent: PaymethodAddEcheckComponent;
  private PaymethodSubscription: Subscription = null;
  private _Paymethods: PaymethodClass[] = null;

  constructor(
    private BillService: BillService,
    private PaymethodService: PaymethodService,
    private FormBuilder: FormBuilder
  ) {
    this.formGroup = FormBuilder.group({
      payment_now: ['', Validators.compose([Validators.required, validMoneyAmount])],
      payment_save: ['']
    });

    this.PaymethodSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );

  }

  get Paymethods(): PaymethodClass[] {
    return this._Paymethods;
  }
  set Paymethods(Paymethods: PaymethodClass[]) {
    this._Paymethods = Paymethods;
    if (Paymethods.length > 0) {
      this.paymentSelectMethod(null, Paymethods[0]);
    } else {
      this.paymentOneTime(null, 'CreditCard');
    }
  }

  ngOnInit() {
    this.BillService.getCurrentBill()
      .then((Bill: Bill) => {
        this.Bill = Bill;
        this.formGroup.controls['payment_now'].setValue(`$${(new NumberToMoneyPipe).transform(Bill.current_charges())}`);
      });
  }

  ngOnDestroy() {
    this.PaymethodSubscription.unsubscribe();
  }

  paymentOneTime($event, type): void {
    if ($event && $event.preventDefault) {
      $event.preventDefault();
    }
    this.paymentOneTimeType = type || null;
    this.paymentOneTimeValid = false;
    this.formGroup.controls['payment_save'].setValue('');
  }

  paymentOneTimeChanged($event: string): void {
    this.paymentOneTimeValid = $event === 'valid';
  }

  paymentSelectMethod($event, paymentMethod: PaymethodClass): void {
    if ($event && $event.preventDefault) {
      $event.preventDefault();
    }
    this.paymentOneTimeType = null;
    this.paymentOneTimeValid = true;
    this.PaymethodSelected = paymentMethod;
  }

  paymentReady(): boolean {
    return (
      this.formGroup.valid
      && this.paymentOneTimeValid === true
    );
  }

  paymentSubmit(): void {
    if (this.paymentOneTimeType === 'CreditCard') {
      console.log(this.formGroup.value);
      console.log(this.addCreditCardComponent.formGroup.value);
    } else if (this.paymentOneTimeType === 'eCheck') {
      console.log(this.formGroup.value);
      console.log(this.addEcheckComponent.formGroup.value);
    } else {
      console.log(this.formGroup.value);
      console.log(this.PaymethodSelected);
    }
    alert('Make a payment here now.\nCheck the console for the user\'s input.');
    this.ngOnInit();
  }

}
