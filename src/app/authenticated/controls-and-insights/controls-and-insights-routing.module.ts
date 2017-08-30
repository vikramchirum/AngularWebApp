import { Route, RouterModule } from '@angular/router';

import { ControlsAndInsightsComponent } from './controls-and-insights.component';
import { UsageHistoryComponent } from './usage-history/usage-history.component';
import { EnergySavingsTipsComponent } from './energy-savings-tips/energy-savings-tips.component';


const routes: Route[] = [
  {
    path: '', component: ControlsAndInsightsComponent,
    children: [
       {path: 'usage-history', component: UsageHistoryComponent},
       {path: 'energy-savings-tips', component: EnergySavingsTipsComponent}

    ]
  }
];

export const controls_insights_routes = RouterModule.forChild(routes);
