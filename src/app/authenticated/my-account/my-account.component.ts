import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { startsWith } from 'lodash';
import { ReferralStore } from '../../core/store/referralstore';
import { CustomerAccountService } from '../../core/CustomerAccount.service';

@Component({
  selector: 'mygexa-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  private startsWith = startsWith;

  constructor(private customerAccountService: CustomerAccountService,
              private referralStore: ReferralStore,
              private Router: Router) {
  }

  ngOnInit() {
    this.customerAccountService.CustomerAccountObservable.subscribe(result => {
      this.referralStore.loadReferral(result.Id);
    });
  }
}
