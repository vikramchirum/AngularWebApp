import {Component, OnInit} from '@angular/core';
import {PhonePipe} from '../../../../shared/pipes/phone.pipe';
import {Contact} from './contact-form.interface';

@Component({
  selector: 'mygexa-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  public contact: Contact;
  public submitted: boolean = false;
  message: string = '';
  phoneNumber: string = '';

  constructor() {
  }

  ngOnInit() {
    this.contact = {
      phoneNumber: '',
      message: ''
    }
  }

  //submitted = false;

  onSubmit(model: Contact, isValid: boolean) {
    console.log(model, isValid);
    this.submitted = true;
  }
}
