import { Route, RouterModule } from '@angular/router';

import { ReferFriendComponent } from './refer-friend.component';
import { ReferralOptionsComponent } from './referral-options/referral-options.component';
import { MyRewardsComponent } from './my-rewards/my-rewards.component';

const routes: Route[] = [
  {
    path: '', component: ReferFriendComponent,
    children: [
      { path: 'my-rewards', component: MyRewardsComponent },
      { path: 'referral-options', component: ReferralOptionsComponent }
    ]
  }
];

export const refer_friend_routes = RouterModule.forChild(routes);
