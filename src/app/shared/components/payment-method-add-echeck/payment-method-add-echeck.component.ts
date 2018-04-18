import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { Subscription } from 'rxjs/Subscription';
import { validateCardName, validateName, validateNameOnCard } from 'app/validators/validator';

@Component({
  selector: 'mygexa-payment-method-add-echeck',
  templateUrl: './payment-method-add-echeck.component.html',
  styleUrls: ['./payment-method-add-echeck.component.scss']
})
export class PaymethodAddEcheckComponent implements OnInit, OnDestroy {

  @Input() form_horizontal: boolean = null;

  formGroup: FormGroup = null;
  formGroupSubscriber: Subscription = null;
  @Output() changed: EventEmitter<any> =  new EventEmitter<any>();
  @Output() submitted: EventEmitter<any> =  new EventEmitter<any>();

  constructor(
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Prepare the e-Check form.
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
    return this.FormBuilder.group({
      echeck_name: ['', Validators.compose([Validators.required, validateCardName, validateName, validateNameOnCard])],
      echeck_routing: ['', Validators.compose([Validators.required, Validators.minLength(9), CustomValidators.digits])],
      echeck_accounting: ['', Validators.compose([Validators.required, Validators.minLength(9), CustomValidators.digits])],
      echeck_info: ['']
    });
  }

  formGroupSubmit(): void {
    this.submitted.emit();
  }
}
