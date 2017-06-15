import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module'
import { ControlsAndInsightsComponent } from './controls-and-insights.component';
import { controls_insights_routes } from './controls-and-insights-routing.module';
import { UsageHistoryComponent } from './usage-history/usage-history.component';

@NgModule({
  imports: [
    CommonModule,
    controls_insights_routes,
    SharedModule
  ],
  declarations: [
    ControlsAndInsightsComponent,
    UsageHistoryComponent
  ]
})
export class ControlsAndInsightsModule { }
