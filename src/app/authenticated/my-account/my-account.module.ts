import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {my_account_routes} from "./my-account-routing.module";
import { ProfileComponent } from './profile/profile.component';
import { PlanInformationComponent } from './plan-information/plan-information.component';
import { MyAccountComponent } from './my-account.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { TransferServiceComponent } from './transfer-service/transfer-service.component';
import { SecurityInformationComponent } from './profile/security-information/security-information.component';
import { PaperlessSettingsComponent } from './profile/paperless-settings/paperless-settings.component';
import { MyCurrentPlanComponent } from './plan-information/my-current-plan/my-current-plan.component';
import { DocumentsComponent } from './plan-information/documents/documents.component';
import { ChangeYourPlanComponent } from './plan-information/change-your-plan/change-your-plan.component';
import {MdCardModule,MaterialModule} from '@angular/material';
import { ChangeYourPlanCardComponent } from './plan-information/change-your-plan/change-your-plan-card/change-your-plan-card.component';
import { ServiceEnrollmentStatusComponent } from './order-status/service-enrollment-status/service-enrollment-status.component';


@NgModule({
  imports: [
    my_account_routes,
    CommonModule,
    MdCardModule,
    MaterialModule
  ],
  declarations: [ ProfileComponent, PlanInformationComponent, MyAccountComponent, ReferFriendComponent, OrderStatusComponent, TransferServiceComponent, SecurityInformationComponent, PaperlessSettingsComponent, MyCurrentPlanComponent, DocumentsComponent, ChangeYourPlanComponent, ChangeYourPlanCardComponent, ServiceEnrollmentStatusComponent]
})
export class MyAccountModule { }
