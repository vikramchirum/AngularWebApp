import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap';

import { RootComponent } from './root/root.component';
import { authenticated_routes } from './authenticated-routing.module';
import { ResponsiveHamburgerMenuComponent } from './root/responsive-hamburger-menu/responsive-hamburger-menu.component';
import { ControlsAndInsightsComponent } from './controls-and-insights/controls-and-insights.component';
import { HomeMultiAccountsModalComponent } from './root/home-multi-accounts-modal/home-multi-accounts-modal.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  imports: [
    authenticated_routes,
    CommonModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  declarations: [
    RootComponent,
    HomeMultiAccountsModalComponent,
    ResponsiveHamburgerMenuComponent
  ],
  exports: [
    RouterModule
  ]
})
export class AuthenticatedModule { }
