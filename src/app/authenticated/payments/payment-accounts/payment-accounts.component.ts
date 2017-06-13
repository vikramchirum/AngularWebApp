import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as $ from 'jquery';
import { PaymentMethod, PaymentMethodService } from 'app/core/PaymentMethod';
import { CustomValidators } from 'ng2-validation';
import { validCreditCard } from 'app/validators/validator';

declare const jQuery: $;

@Component({
  selector: 'mygexa-payment-accounts',
  templateUrl: './payment-accounts.component.html',
  styleUrls: ['./payment-accounts.component.scss']
})
export class PaymentAccountsComponent implements OnInit, AfterViewInit {
  @ViewChild('modal_delete') modal_delete;

  PaymentMethods: PaymentMethod[] = [];

  addingEcheck: boolean = null;
  addingEcheckForm: FormGroup = null;
  addingCreditCard: boolean = null;
  addingCreditCardNow: Date = new Date;
  addingCreditCardForm: FormGroup = null;
  addingCreditCardMonths: any[] = [
    ['01', 'January'],
    ['02', 'February'],
    ['03', 'March'],
    ['04', 'April'],
    ['05', 'May'],
    ['06', 'June'],
    ['07', 'July'],
    ['08', 'August'],
    ['09', 'September'],
    ['10', 'October'],
    ['11', 'November'],
    ['12', 'December']
  ];
  addingCreditCardYears: string[] = [];

  constructor(
    private FormBuilder: FormBuilder,
    private PaymentMethodService: PaymentMethodService
  ) {
    // Generate the available years to select.
    const thisYear = this.addingCreditCardNow.getFullYear();
    for (let count = 0; count <= 5; this.addingCreditCardYears.push(`${thisYear + count}`), count++) {}
    // Prepare the credit card form.
    this.addingCreditCardForm = this.addingCreditCardFormInit();
    // Prepare the Echeck form.
    this.addingEcheckForm = this.addingEcheckFormInit();
  }

  ngOnInit() {
    this.PaymentMethodService.getPaymentMethods()
      .then((PaymentMethods: PaymentMethod[]) => this.PaymentMethods = PaymentMethods);
  }

  ngAfterViewInit() {
    // Leave for later use.
    // this.$modal = jQuery(this.modal_delete.nativeElement);
  }

  addingCreditCardToggle(open: boolean): void {
    const doOpen = open !== false;
    if (doOpen) {
      this.addingCreditCardForm = this.addingCreditCardFormInit();
    }
    this.addingCreditCard = doOpen;
  }

  addingCreditCardFormInit(): FormGroup {
    const thisMonth = (this.addingCreditCardNow.getMonth() + 1);
    return this.FormBuilder.group({
      Card_Name: ['', Validators.required],
      Card_Number: ['', validCreditCard],
      Card_Expiration_Month: [`${thisMonth < 10 ? '0' : ''}${thisMonth}`, Validators.required],
      Card_Expiration_Year: [this.addingCreditCardYears[0], Validators.required],
      Card_CCV: ['', Validators.compose([Validators.required, CustomValidators.digits, Validators.minLength(3)])]
    });
  }

  addingCreditCardSubmit() {
    console.log('this.addingCreditCardForm.value', this.addingCreditCardForm.value);
    alert('Add card to Forte now.\nCheck the console for the user\'s input.');
    this.addingCreditCard = false;
  }

  addingEcheckToggle(open: boolean): void {
    const doOpen = open !== false;
    if (doOpen) {
      this.addingEcheckForm = this.addingEcheckFormInit();
    }
    this.addingEcheck = doOpen;
  }

  addingEcheckFormInit(): FormGroup {
    return this.FormBuilder.group({
      Check_Name: ['', Validators.required],
      Check_Routing: ['', Validators.compose([Validators.required, Validators.minLength(9), CustomValidators.digits])],
      Check_Accounting: ['', Validators.compose([Validators.required, Validators.minLength(9), CustomValidators.digits])],
      Check_Info: ['']
    });
  }

  addingEcheckSubmit() {
    console.log('this.addingEcheckForm.value', this.addingEcheckForm.value);
    alert('Add Echeck now.\nCheck the console for the user\'s input.');
    this.addingEcheck = false;
  }

}
