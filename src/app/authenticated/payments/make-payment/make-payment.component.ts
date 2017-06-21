import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaymentMethodAddCcComponent } from 'app/shared/components/payment-method-add-cc/payment-method-add-cc.component';
import { PaymentMethodAddEcheckComponent } from 'app/shared/components/payment-method-add-echeck/payment-method-add-echeck.component';
import { PaymentMethod, PaymentMethodService} from 'app/core/PaymentMethod';
import { Bill, BillService } from 'app/core/Bill';
import { NumberToMoneyPipe } from 'app/shared/pipes/NumberToMoney.pipe';
import { validMoneyAmount } from 'app/validators/validator';

@Component({
  selector: 'mygexa-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  paymentOneTimeType: string = null;
  paymentOneTimeValid: boolean = null;
  formGroup: FormGroup = null;

  Bill: Bill = null;
  PaymentMethods: PaymentMethod[] = null;
  PaymentMethodSelected: PaymentMethod = null;
  @ViewChild(PaymentMethodAddCcComponent)
  private addCreditCardComponent: PaymentMethodAddCcComponent;
  @ViewChild(PaymentMethodAddEcheckComponent)
  private addEcheckComponent: PaymentMethodAddEcheckComponent;

  constructor(
    private BillService: BillService,
    private PaymentMethodService: PaymentMethodService,
    private FormBuilder: FormBuilder
  ) {
    this.formGroup = FormBuilder.group({
      payment_now: ['', Validators.compose([Validators.required, validMoneyAmount])],
      payment_save: ['']
    });
  }

  ngOnInit() {
    this.BillService.getCurrentBill()
      .then((Bill: Bill) => {
        this.Bill = Bill;
        this.formGroup.controls['payment_now'].setValue(`$${(new NumberToMoneyPipe).transform(Bill.current_charges())}`);
      });
    this.PaymentMethodService.getPaymentMethods()
      .then((PaymentMethods: PaymentMethod[]) => {
        this.PaymentMethods = PaymentMethods;
        if (this.PaymentMethods.length > 0) {
          this.paymentSelectMethod(null, this.PaymentMethods[0]);
        } else {
          this.paymentOneTime(null, 'cc');
        }
      });
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

  paymentSelectMethod($event, paymentMethod: PaymentMethod): void {
    if ($event && $event.preventDefault) {
      $event.preventDefault();
    }
    this.paymentOneTimeType = null;
    this.paymentOneTimeValid = true;
    this.PaymentMethodSelected = paymentMethod;
  }

  paymentReady(): boolean {
    return (
      this.formGroup.valid
      && this.paymentOneTimeValid === true
    );
  }

  paymentSubmit(): void {
    if (this.paymentOneTimeType === 'cc') {
      console.log(this.formGroup.value);
      console.log(this.addCreditCardComponent.formGroup.value);
    } else if (this.paymentOneTimeType === 'e-check') {
      console.log(this.formGroup.value);
      console.log(this.addEcheckComponent.formGroup.value);
    } else {
      console.log(this.formGroup.value);
      console.log(this.PaymentMethodSelected);
    }
    alert('Make a payment here now.\nCheck the console for the user\'s input.');
    this.ngOnInit();
  }

}
