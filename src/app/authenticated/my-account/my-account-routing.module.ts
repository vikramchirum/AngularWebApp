/**
 * Created by patrick.purcell on 5/3/2017.
 */

import {Route, RouterModule} from "@angular/router";
import {ProfileComponent} from "./profile/profile.component";
import {PlanInformationComponent} from "./plan-information/plan-information.component";


const routes: Route[] = [
  {path: 'profile', component: ProfileComponent},
  {path: 'plan-information', component: PlanInformationComponent},
  {path: '', redirectTo: 'profile'}
];

export const my_account_routes = RouterModule.forChild(routes);
