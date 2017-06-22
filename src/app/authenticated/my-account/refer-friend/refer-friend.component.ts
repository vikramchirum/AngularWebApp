import { Component, OnInit } from '@angular/core';

let temp_Enrolled_In_My_Rewards_And_Referrals: boolean = null;

@Component({
  selector: 'mygexa-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit {

  flipButton: boolean = null;
  enrolled: boolean = null;

  constructor(
  ) {
    // TODO: look up from the API.
    this.enrolled = temp_Enrolled_In_My_Rewards_And_Referrals;
  }

  toggleButton(): void {
    this.flipButton = !this.flipButton;
  }

  onEnroll() {
    // TODO: post to the API.
    this.enrolled = temp_Enrolled_In_My_Rewards_And_Referrals = true;
  }

  ngOnInit() { }

}
