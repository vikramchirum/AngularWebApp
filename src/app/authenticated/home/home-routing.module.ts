/**
 * Created by geetha.ramu on 5/5/2017.
 */

import {Route, RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";

const routes: Route[] = [

  {path: '', component: HomeComponent,
  children: [
   // {path: '', component: ''}
    
    ]}
];

export const home_routes = RouterModule.forChild(routes);
