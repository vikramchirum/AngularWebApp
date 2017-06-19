import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  IsUserNameValid: boolean = false;
  IsSecurityQuestionValid: boolean = false;
  constructor() { }

  validateUsername() {
    this.IsUserNameValid = true;
  }
  validateSecurityQuestion() {
    this.IsSecurityQuestionValid = true;
  }
  ngOnInit() {
  }

}
