import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateEmail, equalityCheck } from '../../../../validators/validator'

@Component({
  selector: 'mygexa-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  emailAddress : string;
  emailEditing : boolean;
  phoneEditing : boolean = false;
  
  constructor() {
     this.emailEditing = false;     
   }
   
  ngOnInit() {
    this.emailAddress = "cbrown@gmail.com";
   
  }

   toggleEmailEdit($event) {
    $event.preventDefault();
    this.emailEditing = !this.emailEditing;
  }

  togglePhoneEdit($event) {
      $event.preventDefault();
    this.phoneEditing = !this.phoneEditing;

  }
 


}
