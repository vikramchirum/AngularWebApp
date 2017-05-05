import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RootComponent} from './root/root.component';
import {authenticated_routes} from "./authenticated-routing.module";

@NgModule({
  imports: [
    authenticated_routes,
    CommonModule
  ],
  declarations: [RootComponent],
  exports: [RouterModule]
})
export class AuthenticatedModule {
}
