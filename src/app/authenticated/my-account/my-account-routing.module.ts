/**
 * Created by patrick.purcell on 5/3/2017.
 */

import { Route, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { MyAccountComponent } from './my-account.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { ReferFriendModule } from "./refer-friend/refer-friend.module";
import { MyRewardsComponent } from './refer-friend/my-rewards/my-rewards.component';
import { ReferralOptionsComponent } from './refer-friend/referral-options/referral-options.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';

export function loadReferFriendModule() {
 return ReferFriendModule;
};

const routes: Route[] = [

  {
    path: '', component: MyAccountComponent,
    children: [
      { path: 'refer-a-friend', loadChildren: loadReferFriendModule },
      // { path: 'refer-a-friend', component: ReferFriendComponent },
      // { path: 'refer-a-friend/referral-options', component: ReferralOptionsComponent },
      // { path: 'refer-a-friend/my-rewards', component: MyRewardsComponent  },
      { path: 'profile', component: ProfileComponent },
      { path: 'message-center', component: MessageCenterComponent },

    ]
  }
];

export const my_account_routes = RouterModule.forChild(routes);
