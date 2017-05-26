import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RootComponent } from './root/root.component';
import { authenticated_routes } from './authenticated-routing.module';
import { ResponsiveHamburgerMenuComponent } from './root/responsive-hamburger-menu/responsive-hamburger-menu.component';

@NgModule({
  imports: [
    authenticated_routes,
    CommonModule
  ],
  declarations: [
    RootComponent,
    ResponsiveHamburgerMenuComponent
  ],
  exports: [
    RouterModule
  ]
})
export class AuthenticatedModule { }
