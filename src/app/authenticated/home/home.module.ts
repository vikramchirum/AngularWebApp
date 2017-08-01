import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { HomeComponent } from './home.component';
import { home_routes } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UsageSummaryComponent } from './usage-summary/usage-summary.component';
import { ReferFriendProgramComponent } from './refer-friend-program/refer-friend-program.component';
import { AutoPaySignupComponent } from './auto-pay-signup/auto-pay-signup.component';
import { HomeCarouselComponent } from './home-carousel/home-carousel.component';
import {MyBillComponent} from './my-bill/my-bill.component';

@NgModule({
  imports: [
    CommonModule,
    home_routes,
    SharedModule,
    CarouselModule,
    ChartsModule
  ],
  declarations: [
    HomeComponent,
    UsageSummaryComponent,
    ReferFriendProgramComponent,
    AutoPaySignupComponent,
    MyBillComponent,
    HomeCarouselComponent]
})
export class HomeModule { }
