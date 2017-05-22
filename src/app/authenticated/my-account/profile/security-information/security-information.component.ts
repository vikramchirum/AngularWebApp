import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { equalityCheck } from '../../../../validators/validator'

@Component({
  selector: 'mygexa-security-information',
  templateUrl: './security-information.component.html',
  styleUrls: ['./security-information.component.scss']
})
export class SecurityInformationComponent implements OnInit {

openUserNamePanel : boolean;
openPasswordPanel : boolean;
  userName : string;
  
  changeUserNameForm: FormGroup;
  changePasswordForm: FormGroup;
  submitAttempt: boolean = false;
   constructor(fb: FormBuilder) {
    
     this.changeUserNameForm = fb.group({
      'userName': [null, Validators.required],
      'confirmUserName': [null, Validators.required]
   }, {validator: equalityCheck('userName', 'confirmUserName')});

   
     this.changePasswordForm = fb.group({
      'currentPassword': [null, Validators.required],
      'password': [null, Validators.required],
      'confirmPassword': [null, Validators.required]
   }, {validator: equalityCheck('password', 'confirmPassword')});
   }

  ngOnInit() {
    this.userName = "cbrown_2371";
   
  }
  togglePanel(event) {
    this.openPasswordPanel = false; 
    this.openUserNamePanel = true;    

  }
   togglePasswordPanel(event) {
    this.openUserNamePanel = false;
    this.openPasswordPanel = true;    

  }
  closePasswordPanel() {
     this.openPasswordPanel = false;    
  }
 
  closePanel() {
     this.openUserNamePanel = false;
  }
   

   submitForm(value: any, valid:boolean) {
    this.submitAttempt = true;
    console.log("value", value);
     console.log("valid", valid);
     if(valid){
      this.userName = value.confirmUserName;
      this.openUserNamePanel = false;
     }  

  }

}
