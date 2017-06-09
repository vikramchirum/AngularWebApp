import { Component, OnInit } from '@angular/core';

import { BillingAccount, BillingAccountService } from 'app/core/BillingAccount';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit {

  BillingAccount: BillingAccount = null;
  addressEditing: boolean;
  serviceChangedId: string = null;

  constructor(
    private BillingAccountService: BillingAccountService
  ) {
    this.addressEditing = false;
  }

  serviceChanged(Id) {
    this.serviceChangedId = Id;
  }

  serviceUse() {
    this.BillingAccountService
      .getBillingAccount(this.serviceChangedId)
      .then(BillingAccount => this.BillingAccount = BillingAccount);
    this.addressEditing = !this.addressEditing;
  }

  ngOnInit() {
    this.BillingAccountService
      .getCurrentBillingAccount()
      .then(BillingAccount => this.BillingAccount = BillingAccount);
  }

  toggleAddressEdit($event){
    if ($event && $event.preventDefault) { $event.preventDefault(); }
    this.addressEditing = !this.addressEditing;
  }

}
