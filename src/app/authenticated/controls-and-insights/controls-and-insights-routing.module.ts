import { Route, RouterModule } from '@angular/router';

import { ControlsAndInsightsComponent } from './controls-and-insights.component';
import { UsageHistoryComponent } from './usage-history/usage-history.component';
import { EnergySavingsTipsComponent } from './energy-savings-tips/energy-savings-tips.component';
import { PowerUsageTrackerComponent } from './power-usage-tracker/power-usage-tracker.component';
import { SavingsComponent } from './savings/savings.component';


const routes: Route[] = [
  {
    path: '', component: ControlsAndInsightsComponent,
    children: [
       {path: 'power-usage-tracker', component: PowerUsageTrackerComponent},
       {path: 'usage-history', component: UsageHistoryComponent},
       {path: 'energy-savings-tips', component: EnergySavingsTipsComponent},
       {path: 'savings', component: SavingsComponent}
    ]
  }
];

export const controls_insights_routes = RouterModule.forChild(routes);
