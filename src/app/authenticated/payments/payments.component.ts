import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  accounts;
  account_active;

  constructor() { }

  ngOnInit() {
    // Get all the accounts:
    this.accounts = [];
    if (Math.round(Math.random()) === 1) { this.accounts.push() }
    // Get the active account:
    this.account_active = 'account_id';
  }

}
