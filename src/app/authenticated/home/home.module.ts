import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home.component";
import {home_routes} from "./home-routing.module";


@NgModule({
  imports: [
    CommonModule,
    home_routes
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
