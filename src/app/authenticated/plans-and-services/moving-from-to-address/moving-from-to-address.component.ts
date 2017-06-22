import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {SelectPlanModalDialogComponent} from './select-plan-modal-dialog/select-plan-modal-dialog.component';


@Component({
  selector: 'mygexa-moving-from-to-address',
  templateUrl: './moving-from-to-address.component.html',
  styleUrls: ['./moving-from-to-address.component.scss']
})
export class MovingFromToAddressComponent implements OnInit {

  nextClicked: boolean = false;
  previousClicked: boolean = true;
  New_Service_Start_Date;
  Current_Service_End_Date;
  options = {};
  movingCenterForm: FormGroup;
  @ViewChild('selectPlanModal') selectPlanModal: SelectPlanModalDialogComponent;

  constructor(fb: FormBuilder, private viewContainerRef: ViewContainerRef) {
    this.movingCenterForm = fb.group({
      'Current_Service_End_Date': [null, Validators.required],
      'New_Service_Start_Date': [null, Validators.required],
      'service_address': '',
      'service_plan': '',
      'agree_to_terms': '',
      'current_billing_address': fb.array([]),
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


  onSubmit(formValue) {
    console.log(formValue);
  }

  openSelectPlanModal() {
    this.selectPlanModal.show();
  }


}
