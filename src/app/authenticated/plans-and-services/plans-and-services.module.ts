import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule, PopoverModule  } from 'ngx-bootstrap';
import { MdCardModule, MaterialModule } from '@angular/material';
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
import { SelectPlanComponent } from './add-services/select-plan/select-plan.component';
import { CreditCheckComponent } from './add-services/credit-check/credit-check.component';
import { MovingComponent} from './moving/moving.component';
import { SelectPlanModalDialogComponent } from './moving-center-form/select-plan-modal-dialog/select-plan-modal-dialog.component';
import { MovingCenterFormComponent } from './moving-center-form/moving-center-form.component';
import { OfferDetailsPopoverComponent } from './my-service-plans/change-your-plan/offer-details-popover/offer-details-popover.component';
import { TooltipModule } from 'ngx-bootstrap';
import { PlanConfirmationPopoverComponent } from './my-service-plans/plan-confirmation-popover/plan-confirmation-popover.component';

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
      ChangeYourPlanCardComponent,
      SelectPlanComponent,
      CreditCheckComponent,
      MovingComponent,
      SelectPlanModalDialogComponent,
      MovingCenterFormComponent,
      OfferDetailsPopoverComponent,
      RenewalGaugeComponent,
      PlanConfirmationPopoverComponent
      ]
})
export class PlansAndServicesModule { }
