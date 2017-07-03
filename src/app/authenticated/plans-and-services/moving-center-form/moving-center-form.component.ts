import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';


@Component({
  selector: 'mygexa-moving-center-form',
  templateUrl: './moving-center-form.component.html',
  styleUrls: ['./moving-center-form.component.scss']
})
export class MovingCenterFormComponent implements OnInit {


  nextClicked: boolean = false;
  previousClicked: boolean = true;
  New_Service_Start_Date;
  Current_Service_End_Date;
  options = {};
  movingCenterForm: FormGroup;
  movingAddressForm: FormGroup;
  ServicePlanForm: FormGroup;
  submitted: boolean = false;

  private ActiveBillingAccountSubscription: Subscription = null;

  @ViewChild('selectPlanModal') selectPlanModal: SelectPlanModalDialogComponent;

  constructor(fb: FormBuilder, 
  private viewContainerRef: ViewContainerRef,
   private BillingAccountService: BillingAccountService) {

    this.movingAddressForm = fb.group({
      'Current_Service_End_Date': [null, Validators.required],
      'New_Service_Start_Date': [null, Validators.required],
      'current_bill_address':fb.array([]),
      'new_billing_address': fb.array([])
    })

    this.ServicePlanForm = fb.group({
      'service_address': '',
      'service_plan': '',
      'agree_to_terms': '',      
      'final_billing_address': fb.array([])
    })
  }



  ngOnInit() {
  }

  
  ngAfterViewInit() {
     this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
        movingFromAccount => {
          console.log('ActiveBillingAccount.', movingFromAccount);         
        } 
      );


      
  }



  nextButtonClicked() {
    this.nextClicked = true;
    this.previousClicked = !this.previousClicked;
  }

  previousButtonClicked() {
    this.previousClicked = true;
    this.nextClicked = !this.nextClicked;
  }

  serviceChanged(event) {
    console.log(event);
  }


  onSubmitMove() {
    this.submitted = true;
  }

  openSelectPlanModal() {
    this.selectPlanModal.show();
  }

  onServicePlanFormSubmit(addressForm, billSelector) {
    //console.log(addressForm, billSelector);
  }

  onMovingAddressFormSubmit(addressForm) {
   // console.log(addressForm);
  }


}
