/**
 * Created by patrick.purcell on 5/3/2017.
 */

import { Route, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { PlanInformationComponent } from "./plan-information/plan-information.component";
import { MyAccountComponent } from './my-account.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { TransferServiceComponent } from './transfer-service/transfer-service.component';
import { MessageCenterComponent } from './message-center/message-center.component';

const routes: Route[] = [

  {
    path: '', component: MyAccountComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'plan-information', component: PlanInformationComponent },
      { path: 'refer-a-friend', component: ReferFriendComponent },
      { path: 'order-status', component: OrderStatusComponent },
      { path: 'transfer-service', component: TransferServiceComponent },
      { path: 'message-center', component: MessageCenterComponent }
    ]
  }
];

export const my_account_routes = RouterModule.forChild(routes);
