import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RootComponent} from "./authenticated/root/root.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
{path: '',
    component: RootComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
