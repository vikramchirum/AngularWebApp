import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';

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

  @ViewChild('selectPlanModal') selectPlanModal: SelectPlanModalDialogComponent;

  constructor(fb: FormBuilder, private viewContainerRef: ViewContainerRef) {

    this.movingAddressForm = fb.group({
      'Current_Service_End_Date': [null, Validators.required],
      'New_Service_Start_Date': [null, Validators.required]
    })

    this.ServicePlanForm = fb.group({
      'service_address': '',
      'service_plan': '',
      'agree_to_terms': '',
      'new_billing_address': fb.array([]),
      'final_billing_address': fb.array([])
    })
  }

  ngOnInit() {
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
    console.log();
    this.submitted = true;
  }

  openSelectPlanModal() {
    this.selectPlanModal.show();
  }

  onServicePlanFormSubmit() {

  }

  onMovingAddressFormSubmit() {

  }


}
