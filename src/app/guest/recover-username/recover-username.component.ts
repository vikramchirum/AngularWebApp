import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-recover-username',
  templateUrl: './recover-username.component.html',
  styleUrls: ['./recover-username.component.scss']
})
export class RecoverUsernameComponent implements OnInit {

  IsValidEmail: boolean = false;

  constructor() { }

  validateEmail() {
    this.IsValidEmail = true;
  }
  ngOnInit() {
  }

}
