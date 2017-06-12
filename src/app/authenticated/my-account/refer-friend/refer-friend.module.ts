import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { refer_friend_routes } from './refer-friend-routing.module';
import { ReferralOptionsComponent } from './referral-options/referral-options.component';
import { MyRewardsComponent } from './my-rewards/my-rewards.component';
import { ReferFriendComponent } from './refer-friend.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    refer_friend_routes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ReferFriendComponent,
    ReferralOptionsComponent,
    MyRewardsComponent
  ],
  exports: [
    RouterModule
  ]
})
export class ReferFriendModule { }
