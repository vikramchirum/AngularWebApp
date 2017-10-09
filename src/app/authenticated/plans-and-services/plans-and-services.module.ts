import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule, PopoverModule  } from 'ngx-bootstrap';
import { MdCardModule, MaterialModule } from '@angular/material';
import { ToolTipModule } from 'angular2-tooltip';
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
import { CreditCheckComponent } from './add-services/credit-check/credit-check.component';
import { MovingComponent} from './moving/moving.component';
import { SelectPlanModalDialogComponent } from './moving-center-form/select-plan-modal-dialog/select-plan-modal-dialog.component';
import { MovingCenterFormComponent } from './moving-center-form/moving-center-form.component';
import { TooltipModule } from 'ngx-bootstrap';
import { PlanConfirmationPopoverComponent } from './my-service-plans/plan-confirmation-popover/plan-confirmation-popover.component';
import { PlanConfirmationModalComponent } from './my-service-plans/plan-confirmation-modal/plan-confirmation-modal.component';
import { PlansAgreementModalComponent } from './plans-agreement-modal/plans-agreement-modal.component';

@NgModule({
  imports: [
    plans_services_routes,
    CommonModule,
    MdCardModule,
    MaterialModule,
    ToolTipModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    DatePickerModule,
    MyDatePickerModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
      PlansAndServicesComponent,
      OrderStatusComponent,
      AddServicesComponent,
      MyServicePlansComponent,
      MyCurrentPlanComponent,
      DocumentsComponent,
      ChangeYourPlanComponent,
      CreditCheckComponent,
      MovingComponent,
      SelectPlanModalDialogComponent,
      MovingCenterFormComponent,
      RenewalGaugeComponent,
      PlanConfirmationPopoverComponent,
      PlanConfirmationModalComponent,
      PlansAgreementModalComponent
      ],
  exports: [
    PlanConfirmationModalComponent
  ]
})
export class PlansAndServicesModule { }
