import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { equalityCheck } from '../../../../validators/validator'

@Component({
  selector: 'mygexa-security-information',
  templateUrl: './security-information.component.html',
  styleUrls: ['./security-information.component.scss']
})
export class SecurityInformationComponent implements OnInit {

  userName: string;
  userNameEditing: boolean;
  passwordEditing: boolean;

  submitAttempt: boolean = false;
  constructor(fb: FormBuilder) {
    this.userNameEditing = false;
    this.passwordEditing = false;   
  }

  ngOnInit() {
    this.userName = "cbrown_2371";

  }

  toggleUserNameEdit($event) {
    $event.preventDefault();
    this.passwordEditing = false;
    this.userNameEditing = !this.userNameEditing;
  }
  togglePasswordEdit($event) {
    $event.preventDefault();
    this.userNameEditing = false;
    this.passwordEditing = !this.passwordEditing;
  }


}
