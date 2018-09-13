import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'mygexa-payment-method-edit-cc',
  templateUrl: './payment-method-edit-cc.component.html',
  styleUrls: ['./payment-method-edit-cc.component.scss']
})
export class PaymentMethodEditCcComponent implements OnInit {

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
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitted: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private FormBuilder: FormBuilder
  ) { 
    // Generate the available years to select
    const thisYear = this.now.getFullYear();
    for (let count = 0; count <= 9; this.years.push(`${thisYear + count}`), count++) {}
  }

  ngOnInit() {
    // Prepare the form
    let formGroupStatus = 'INVALID';
    this.formGroup = this.formGroupInit();
    this.formGroupSubscriber = this.formGroup.statusChanges.subscribe((data: string) => {
      if (data != formGroupStatus) {
        formGroupStatus = data;
        this.changed.emit(data.toLowerCase());
      }
    });
  }

  ngOnDestroy() {
    this.formGroupSubscriber.unsubscribe();
  }

  formGroupInit(): FormGroup {
    return this.FormBuilder.group({
      cc_month: ['', Validators.required],
      cc_year: ['', Validators.required],
      cc_ccv: ['', Validators.compose([Validators.required, CustomValidators.digits, Validators.minLength(3)])]
    });
  }

  formGroupSubmit(): void {
    this.submitted.emit();
  }

}
