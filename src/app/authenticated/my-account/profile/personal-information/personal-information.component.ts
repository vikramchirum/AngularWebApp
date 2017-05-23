import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateEmail, equalityCheck } from '../../../../validators/validator'

@Component({
  selector: 'mygexa-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
openEmailPanel : boolean;
  emailAddress : string;
  
  changeEmailForm: FormGroup;
  submitAttempt: boolean = false;
   constructor(fb: FormBuilder) {
    
     this.changeEmailForm = fb.group({
      'email': [null, Validators.compose([Validators.required, validateEmail])],
      'confirmEmail': [null, Validators.compose([Validators.required, validateEmail])]
   }, {validator: equalityCheck('email', 'confirmEmail')});
   }

  ngOnInit() {
    this.emailAddress = "cbrown@gmail.com";
   
  }
  toggleEmailPanel(event) {
    this.openEmailPanel = true;    

  }
 
  resetEmail() {
     this.openEmailPanel = false;
  }
   

   submitForm(value: any, valid:boolean) {
    this.submitAttempt = true;
    console.log("value", value);
     console.log("valid", valid);
     if(valid){
      this.emailAddress = value.confirmEmail;
      this.openEmailPanel = false;
     }  

  }

}
