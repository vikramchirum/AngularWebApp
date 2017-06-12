import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdCardModule, MaterialModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { AddServicesComponent } from './add-services/add-services.component';
import { MyServicePlansComponent } from './my-service-plans/my-service-plans.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { PlansAndServicesComponent } from './plans-and-services.component';
import { plans_services_routes } from './plans-and-services-routing.module';
import { ServiceEnrollmentStatusComponent } from './order-status/service-enrollment-status/service-enrollment-status.component';
import { MyCurrentPlanComponent } from './my-service-plans/my-current-plan/my-current-plan.component';
import { DocumentsComponent } from './my-service-plans/documents/documents.component';
import { ChangeYourPlanComponent } from './my-service-plans/change-your-plan/change-your-plan.component';
import { ChangeYourPlanCardComponent } from './my-service-plans/change-your-plan/change-your-plan-card/change-your-plan-card.component';
import { MovingServiceComponent } from './moving-service/moving-service.component';
import { ModalModule } from 'ngx-bootstrap';
import { ServicePlanUpgradeModalComponent } from './my-service-plans/change-your-plan/change-your-plan-card/service-plan-upgrade-modal/service-plan-upgrade-modal.component';
import { TransferServiceInfoComponent } from './order-status/service-enrollment-status/transfer-service-info/transfer-service-info.component';
import { SelectPlanComponent } from './add-services/select-plan/select-plan.component';
import { CreditCheckComponent } from './add-services/credit-check/credit-check.component';
import { DatePickerModule } from 'ng2-datepicker';
import { MovingServiceModalDialogComponent } from './moving-service/moving-service-modal-dialog/moving-service-modal-dialog.component';

@NgModule({
  imports: [
    plans_services_routes,
    CommonModule,
    MdCardModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    DatePickerModule
  ],
  declarations: [
      PlansAndServicesComponent,
      OrderStatusComponent, 
      AddServicesComponent,
      MyServicePlansComponent,
      ServiceEnrollmentStatusComponent,
      MyCurrentPlanComponent,
      DocumentsComponent,
      ChangeYourPlanComponent,
      ChangeYourPlanCardComponent,
      MovingServiceComponent,
      ServicePlanUpgradeModalComponent,
      TransferServiceInfoComponent,
      SelectPlanComponent,
      CreditCheckComponent,
      MovingServiceModalDialogComponent
      ]
})
export class PlansAndServicesModule { }
