import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
 import { forEach, get, isNumber, map, now, random } from 'lodash';

@Component({
  selector: 'mygexa-paperless-settings',
  templateUrl: './paperless-settings.component.html',
  styleUrls: ['./paperless-settings.component.scss']
})
export class PaperlessSettingsComponent implements OnInit {

  sendBillsForm: FormGroup;
  planDocumentsForm: FormGroup;
  billingOptions = [{ option: 'Email', checked: false }, { option: 'Paper', checked: true }];
  plansOptions = [{ option: 'Email', checked: false }, { option: 'Paper', checked: true }];
  paperlessSettings: boolean = false;
  goPaperless: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.sendBillsForm = this.fb.group({
      billingOptions: this.fb.array([])
    });
    this.planDocumentsForm = this.fb.group({
      plansOptions: this.fb.array([])
    });
  }

  togglePaperless(billingOptions, plansOptions) {
    let flag = 1;
    
    billingOptions.forEach(x => {
      if (x.checked) {
        if(x.option == 'Paper'){
          flag = 0;
        }
      }    
    });

     plansOptions.forEach(x => {
     if (x.checked) {
        if(x.option == 'Paper'){
          flag = 0;
        }
      }   
    });
    if(flag == 1) {
      this.paperlessSettings = true;
    }else {
       this.paperlessSettings = false;
    }
  

    // checkboxOptions.forEach(x => {
    //   if ((x.option == "Email" || "Paper") && x.checked) {
    //     this.paperlessSettings = false;
    //   } else {
    //     this.paperlessSettings = true;
    //   }
    // });
  
   
  }

  validateCheckbox(element, index, array) {
    if (element.checked) {
      return false;
    }
   return true;
  }

  onCheckSelected(option: string, isChecked: boolean, CheckOptions: any) {
    let newValue = isChecked;
    CheckOptions.forEach(checkbox => {
      if (checkbox.option == option) {
        checkbox.checked = newValue;
      }
    });
    //toggle Checkbox
    let isUnchecked = CheckOptions.every(this.validateCheckbox);
    if (isUnchecked) {
      CheckOptions.forEach(checkbox => {
        if (checkbox.option !== option) {
          checkbox.checked = true;
        }
      });
    }
    this.togglePaperless(this.billingOptions, this.plansOptions);
    console.log('plansOptions',);
    console.log('Billing Options', this.billingOptions);
  }
}




