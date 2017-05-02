import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyAccountComponent} from './my-account/my-account.component';
import {RouterModule, Routes} from "@angular/router";
import { RootComponent } from './root/root.component';
import {UserService} from "../shared/user.service";
import { MyUsageComponent } from './my-usage/my-usage.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivate: [UserService],
    children: [
      {path: '', component: MyAccountComponent},
      {path: 'my-account', component: MyAccountComponent},
      {path: 'my-usage', component: MyUsageComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyAccountComponent, RootComponent, MyUsageComponent],
  exports: [RouterModule]
})
export class AuthenticatedModule {
}
