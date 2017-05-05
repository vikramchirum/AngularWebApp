import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {my_account_routes} from "./my-account-routing.module";
import { ProfileComponent } from './profile/profile.component';
import { PlanInformationComponent } from './plan-information/plan-information.component';
import { MyAccountComponent } from './my-account.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { TransferServiceComponent } from './transfer-service/transfer-service.component';

@NgModule({
  imports: [
    my_account_routes,
    CommonModule
  ],
  declarations: [ ProfileComponent, PlanInformationComponent, MyAccountComponent, ReferFriendComponent, OrderStatusComponent, TransferServiceComponent]
})
export class MyAccountModule { }
