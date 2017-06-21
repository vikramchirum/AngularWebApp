import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'mygexa-recover-username',
  templateUrl: './recover-username.component.html',
  styleUrls: ['./recover-username.component.scss']
})
export class RecoverUsernameComponent implements OnInit {

  IsValidEmail: boolean = false;
  recoverUsernameForm: FormGroup;
  formSubmitted: boolean;

  constructor() { }

  validateEmail() {
    this.IsValidEmail = true;
  }
  ngOnInit() {
  }

}
