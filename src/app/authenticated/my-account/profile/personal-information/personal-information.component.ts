import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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
     function validateEmail(c: FormControl) {
      let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return EMAIL_REGEXP.test(c.value) ? null : {
        validateEmail: {
          valid: false
        }
      }
    }
     this.changeEmailForm = fb.group({
      'email': [null, Validators.compose([Validators.required, validateEmail])],
      'confirmEmail': [null, Validators.compose([Validators.required, validateEmail])]
   });
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
    //this.emailAddress = value.email;
    //this.openEmailPanel = false;

  }

}
