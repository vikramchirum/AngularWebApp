import { Route, RouterModule } from "@angular/router";
import { AddServicesComponent } from './add-services/add-services.component';
import { MyServicePlansComponent } from './my-service-plans/my-service-plans.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { PlansAndServicesComponent } from './plans-and-services.component';
import { MovingServiceComponent } from './moving-service/moving-service.component';

const routes: Route[] = [

  {
    path: '', component: PlansAndServicesComponent,
    children: [
      { path: 'my-services-plans', component: MyServicePlansComponent },
      { path: 'add-service-location', component: AddServicesComponent },
      { path: 'order-status', component: OrderStatusComponent },
      { path: 'moving-service', component: MovingServiceComponent}
    ]
  }
];

export const plans_services_routes = RouterModule.forChild(routes);
