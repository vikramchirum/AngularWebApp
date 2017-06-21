import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'mygexa-moving-from-to-address',
  templateUrl: './moving-from-to-address.component.html',
  styleUrls: ['./moving-from-to-address.component.scss']
})
export class MovingFromToAddressComponent implements OnInit {

private nextClicked:boolean = false;
private previousClicked:boolean = true;


 movingCenterForm: FormGroup;
  constructor(fb: FormBuilder) {
    this.movingCenterForm = fb.group({
      'Current_Service_End_Date': [null, Validators.required],
      'New_Service_Start_Date':[null, Validators.required],
      'service_address':'',
      'service_plan':'',
      'agree_to_terms':'',
      'current_billing_address': fb.array([]),
      'new_billing_address':fb.array([]),
      'final_billing_address':fb.array([])
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
    this.nextClicked =  !this.nextClicked;
  }

  serviceChanged(event) {
    console.log(event);
  }


  onSubmit(formValue){
      //console.log(formValue);
  }


}
