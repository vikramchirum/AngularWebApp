import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SharedModule } from '../../shared/shared.module';
import { ControlsAndInsightsComponent } from './controls-and-insights.component';
import { controls_insights_routes } from './controls-and-insights-routing.module';
import { UsageHistoryComponent } from './usage-history/usage-history.component';
import { EnergySavingsTipsComponent } from './energy-savings-tips/energy-savings-tips.component';
import { PowerUsageTrackerComponent } from './power-usage-tracker/power-usage-tracker.component';
import { DailyUsageTrackerComponent } from './power-usage-tracker/daily-usage-tracker/daily-usage-tracker.component';
import { RtpUsageTrackerComponent } from './power-usage-tracker/rtp-usage-tracker/rtp-usage-tracker.component';
import { EnergyUsageTableComponent } from './usage-history/energy-usage-table/energy-usage-table.component';



@NgModule({
  imports: [
    CommonModule,
    controls_insights_routes,
    SharedModule,
    ChartsModule,
    PaginationModule.forRoot(),
    NgxChartsModule
  ],
  declarations: [
    ControlsAndInsightsComponent,
    UsageHistoryComponent,
    EnergySavingsTipsComponent,
    PowerUsageTrackerComponent,
    DailyUsageTrackerComponent,
    RtpUsageTrackerComponent,
    EnergyUsageTableComponent
  ]
})
export class ControlsAndInsightsModule { }
