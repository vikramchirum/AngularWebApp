import { Route, RouterModule } from '@angular/router';

import { ControlsAndInsightsComponent } from './controls-and-insights.component';
import { UsageHistoryComponent } from './usage-history/usage-history.component';

const routes: Route[] = [
  {
    path: '', component: ControlsAndInsightsComponent,
    children: [
       {path: 'usage-history', component: UsageHistoryComponent}
    ]
  }
];

export const controls_insights_routes = RouterModule.forChild(routes);
