import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdCardModule, MaterialModule } from '@angular/material';

import { ModalModule } from 'ngx-bootstrap';
import { DatePickerModule } from 'ng2-datepicker';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from 'app/shared/shared.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AddServicesComponent } from './add-services/add-services.component';
import { MyServicePlansComponent } from './my-service-plans/my-service-plans.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { PlansAndServicesComponent } from './plans-and-services.component';
import { plans_services_routes } from './plans-and-services-routing.module';
import { MyCurrentPlanComponent } from './my-service-plans/my-current-plan/my-current-plan.component';
import { DocumentsComponent } from './my-service-plans/documents/documents.component';
import { RenewalGaugeComponent } from './my-service-plans/renewal-gauge/renewal-gauge.component';
import { ChangeYourPlanComponent } from './my-service-plans/change-your-plan/change-your-plan.component';
import { ChangeYourPlanCardComponent } from './my-service-plans/change-your-plan/change-your-plan-card/change-your-plan-card.component';
import { ServicePlanUpgradeModalComponent } from './my-service-plans/change-your-plan/change-your-plan-card/service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import { SelectPlanComponent } from './add-services/select-plan/select-plan.component';
import { CreditCheckComponent } from './add-services/credit-check/credit-check.component';
import { MovingComponent} from './moving/moving.component';
import { SelectPlanModalDialogComponent } from './moving-center-form/select-plan-modal-dialog/select-plan-modal-dialog.component';
import { MovingCenterFormComponent } from './moving-center-form/moving-center-form.component';

@NgModule({
  imports: [
    plans_services_routes,
    CommonModule,
    MdCardModule,
    MaterialModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    DatePickerModule,
    MyDatePickerModule
  ],
  declarations: [
    PlansAndServicesComponent,
    OrderStatusComponent,
    AddServicesComponent,
    MyServicePlansComponent,
    MyCurrentPlanComponent,
    DocumentsComponent,
    RenewalGaugeComponent,
    ChangeYourPlanComponent,
    ChangeYourPlanCardComponent,
    ServicePlanUpgradeModalComponent,
    SelectPlanComponent,
    CreditCheckComponent,
    MovingComponent,
    SelectPlanModalDialogComponent,
    MovingCenterFormComponent
  ]
})
export class PlansAndServicesModule { }
