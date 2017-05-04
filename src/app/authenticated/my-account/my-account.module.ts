import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {my_account_routes} from "./my-account-routing.module";
import { ProfileComponent } from './profile/profile.component';
import { PlanInformationComponent } from './plan-information/plan-information.component';

@NgModule({
  imports: [
    my_account_routes,
    CommonModule
  ],
  declarations: [ ProfileComponent, PlanInformationComponent]
})
export class MyAccountModule { }
