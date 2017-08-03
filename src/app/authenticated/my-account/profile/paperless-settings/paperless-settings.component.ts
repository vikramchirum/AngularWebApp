import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

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

  togglePaperless(checkboxOptions) {
    checkboxOptions.forEach(x => {
      if ((x.option == "Email" || "Paper") && x.checked) {
        this.paperlessSettings = false;
      } else {
        this.paperlessSettings = true;
      }

    });
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
    this.togglePaperless(CheckOptions);
  }
}




