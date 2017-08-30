import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { PaginationModule } from 'ngx-bootstrap/pagination';


import { SharedModule } from '../../shared/shared.module';
import { ControlsAndInsightsComponent } from './controls-and-insights.component';
import { controls_insights_routes } from './controls-and-insights-routing.module';
import { UsageHistoryComponent } from './usage-history/usage-history.component';
import { EnergySavingsTipsComponent } from './energy-savings-tips/energy-savings-tips.component';



@NgModule({
  imports: [
    CommonModule,
    controls_insights_routes,
    SharedModule,
    ChartsModule,
    PaginationModule.forRoot()
  ],
  declarations: [
    ControlsAndInsightsComponent,
    UsageHistoryComponent,
    EnergySavingsTipsComponent
  ]
})
export class ControlsAndInsightsModule { }
