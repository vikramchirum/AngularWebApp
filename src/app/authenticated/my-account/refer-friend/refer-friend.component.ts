import { Component, OnInit } from '@angular/core';

import { CustomerAccountService } from 'app/core/CustomerAccount';

@Component({
  selector: 'mygexa-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit {

  flipButton: boolean = null;
  enrolled: boolean = null;

  constructor(
    private CustomerAccountService: CustomerAccountService
  ) {
    this.CustomerAccountService.getCurrentCustomerAccount()
      .then(data => this.enrolled = data.Enrolled_In_My_Rewards_And_Referrals);
  }

  toggleButton(): void {
    this.flipButton = !this.flipButton;
  }

  onEnroll() {
    this.CustomerAccountService
      .enrollMyRewardsAndReferrals()
      .then(() => {
        // We will not need to update the enroll variable ourselves,
        // once we utilize observables.
        this.enrolled = true;
      });
  }

  ngOnInit() { }

}
