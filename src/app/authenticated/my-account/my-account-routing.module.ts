/**
 * Created by patrick.purcell on 5/3/2017.
 */

import { Route, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { MyAccountComponent } from './my-account.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { ReferFriendModule } from './refer-friend/refer-friend.module';
import {OrderStatusComponent} from "./order-status/order-status.component";

export function loadReferFriendModule() { return ReferFriendModule; }

const routes: Route[] = [
  {
    path: '', component: MyAccountComponent,
    children: [
      { path: 'refer-a-friend', redirectTo: 'refer-a-friend/referral-options', pathMatch: 'full' },
      { path: 'refer-a-friend', loadChildren: loadReferFriendModule },
      { path: 'profile', component: ProfileComponent },
      { path: 'message-center', component: MessageCenterComponent },
      { path: 'order-status', component: OrderStatusComponent }
    ]
  }
];

export const my_account_routes = RouterModule.forChild(routes);
