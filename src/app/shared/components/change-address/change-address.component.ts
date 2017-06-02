import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { equalityCheck } from '../../../validators/validator';

@Component({
  selector: 'mygexa-change-address',
  templateUrl: './change-address.component.html',
  styleUrls: ['./change-address.component.scss']
})
export class ChangeAddressComponent implements OnInit {

  changeAddressForm: FormGroup;
  submitAttempt: boolean = false;

  @Input() addressEditing: boolean;
  @Output() toggleEventClicked: EventEmitter<any> =  new EventEmitter<any>();

  constructor(fb: FormBuilder) {

    this.changeAddressForm = fb.group({
      'streetAddress': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])],
      'state': [null, Validators.compose([Validators.required])],
      'zip': [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
  }

  submitForm(value: any, valid: boolean) {
    this.submitAttempt = true;
    // if (valid) {
    //   /** send form data to api to update in database */
    // }
  }
  toggleEvent($event) {
    $event.preventDefault();
    this.toggleEventClicked.emit();
  }

  }
