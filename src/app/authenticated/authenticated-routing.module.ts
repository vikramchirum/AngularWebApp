
/**
 * Created by patrick.purcell on 5/3/2017.
 */

import { RouterModule, Route } from '@angular/router';

import { RootComponent } from './root/root.component';
import { UserService } from 'app/core/user.service';
import { PaymentsModule } from './payments/payments.module';
import { MyAccountModule } from './my-account/my-account.module';
import { HomeModule } from './home/home.module';
import { PlansAndServicesModule } from './plans-and-services/plans-and-services.module';
import { ControlsAndInsightsModule } from './controls-and-insights/controls-and-insights.module';
import {HomeMultiAccountsModalComponent} from './root/home-multi-accounts-modal/home-multi-accounts-modal.component';

export function loadHomeModule() { return HomeModule; }

export function loadMyAccountModule() { return MyAccountModule; }

export function loadPaymentModule() { return PaymentsModule; }

export function loadPlansAndServicesModule() { return PlansAndServicesModule; }

export function loadControlInsightsModule() { return ControlsAndInsightsModule; }

const routes: Route[] = [
  {
    path: '', component: RootComponent,
    canActivate: [
      UserService
    ],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home-multi', component: HomeMultiAccountsModalComponent },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'account', redirectTo: 'account/profile', pathMatch: 'full' },
      { path: 'account', loadChildren: './my-account/my-account.module#MyAccountModule' },
      { path: 'payments', redirectTo: 'payments/view-my-bill', pathMatch: 'full' },
      { path: 'payments', loadChildren: './payments/payments.module#PaymentsModule' },
      { path: 'plans-and-services', redirectTo: 'plans-and-services/my-services-plans', pathMatch: 'full' },
      { path: 'plans-and-services', loadChildren: './plans-and-services/plans-and-services.module#PlansAndServicesModule' },
      { path: 'controls-and-insights', redirectTo: 'controls-and-insights/power-usage-tracker', pathMatch: 'full' },
      { path: 'controls-and-insights', loadChildren: './controls-and-insights/controls-and-insights.module#ControlsAndInsightsModule' }
    ]
  }
];

export const authenticated_routes = RouterModule.forChild(routes);
