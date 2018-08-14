import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import {validateCardName, validCreditCard, validateName, validateNameOnCard } from 'app/validators/validator';
import { Subscription } from 'rxjs/Subscription';
import { forEach, every } from 'lodash';


@Component({
  selector: 'mygexa-payment-method-add-cc',
  templateUrl: './payment-method-add-cc.component.html',
  styleUrls: ['./payment-method-add-cc.component.scss']
})
export class PaymethodAddCcComponent implements OnInit, OnDestroy {

  @Input() form_horizontal: boolean = null;

  now: Date = new Date;
  months: any[] = [
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
  years: string[] = [];

  formGroup: FormGroup = null;
  formGroupSubscriber: Subscription = null;
  @Output() changed: EventEmitter<any> =  new EventEmitter<any>();
  @Output() submitted: EventEmitter<any> =  new EventEmitter<any>();

  constructor(
    private FormBuilder: FormBuilder
  ) {
    // Generate the available years to select
    const thisYear = this.now.getFullYear();
    for (let count = 0; count <= 9; this.years.push(`${thisYear + count}`), count++) {}
  }

  ngOnInit() {
    // Prepare the credit card form.
    let formGroupStatus = 'INVALID';
    this.formGroup = this.formGroupInit();
    this.formGroupSubscriber = this.formGroup.statusChanges.subscribe((data: string) => {
      if (data !== formGroupStatus) {
        formGroupStatus = data;
        this.changed.emit(data.toLowerCase());
      }
    });
  }

  ngOnDestroy() {
    this.formGroupSubscriber.unsubscribe();
  }

  formGroupInit(): FormGroup {
    const thisMonth = (this.now.getMonth() + 1);
    return this.FormBuilder.group({
      cc_name: ['', Validators.compose([Validators.required, validateCardName, validateName, validateNameOnCard])],
      cc_number: ['', validCreditCard],
      cc_month: ['', Validators.required],
      cc_year: ['', Validators.required],
      // cc_month: [`${thisMonth < 10 ? '0' : ''}${thisMonth}`, Validators.required],
      // cc_year: [this.years[0], Validators.required],
      cc_ccv: ['', Validators.compose([Validators.required, CustomValidators.digits, Validators.minLength(3)])]
    });
  }

  formGroupSubmit(): void {
    this.submitted.emit();
  }

}
