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
  billingOptions = [{ option: 'Email', checked: false }, { option: 'Paper', checked: false }];
  plansOptions = [{ option: 'Email', checked: false }, { option: 'Paper', checked: false }];
  paperlessSettings: boolean = false;
  goPaperless: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.sendBillsForm = this.fb.group({
      billOptions: this.fb.array([])
    });
    this.planDocumentsForm = this.fb.group({
      planDocsOptions: this.fb.array([])
    });
  }
 
  togglePaperless(isChecked, option) {
    if (isChecked) {
      if (option == 'Email') {
        this.paperlessSettings = !this.paperlessSettings;
      } else {
        this.goPaperless = !this.goPaperless;
      }

    } else {
      this.paperlessSettings = false;
      this.goPaperless = false;
    }

  }
  onBillCheckSelected(option: string, isChecked: boolean) {
    this.billingOptions.forEach(checkbox => {
      if (checkbox.option !== option) {
        checkbox.checked = !checkbox.checked;
      }
    });
    this.togglePaperless(isChecked, option);
  }
  onPlansCheckSelected(option: string, isChecked: boolean) {
    this.plansOptions.forEach(checkbox => {
      if (checkbox.option !== option) {
        checkbox.checked = !checkbox.checked;
      }
    });
    this.togglePaperless(isChecked, option);
  }

}




