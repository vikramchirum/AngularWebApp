import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { forEach, get, isNumber, map, now, random } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { ISearchNotificationOptionRequest } from 'app/core/models/notificationoptions/searchnotificationoptionrequest.model';
import { AccountType } from 'app/core/models/enums/accounttype';
import { NotificationType } from 'app/core/models/enums/notificationtype';
import { NotificationStatus } from 'app/core/models/enums/notificationstatus';
import { NotificationOptionsService } from 'app/core/notificationoptions.service';
import { INotificationOption } from 'app/core/models/notificationoptions/notificationoption.model';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';

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
  notificationOptionsForBills = null;
  notificationOptionsForPlans = null;

  searchNotificationOptionRequestForBill  = null;
  searchNotificationOptionRequestForPlans = null;
  CustomerAccountServiceSubscription: Subscription = null;
  customerDetails: CustomerAccount = null;
  updateNotification = null;

  constructor(private fb: FormBuilder,
    private notificationService: NotificationOptionsService,
    private CustomerAccountService: CustomerAccountService
  ) { }

  ngOnInit() {
    this.sendBillsForm = this.fb.group({
      billingOptions: this.fb.array([])
    });
    this.planDocumentsForm = this.fb.group({
      plansOptions: this.fb.array([])
    });
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
        this.getNotificationOption(this.customerDetails.Id);
      }
    );
  }

  getNotificationOption(custId) {
    this.searchNotificationOptionRequestForBill = {
      Account_Info: {
        Account_Type:"GEMS_Residential_Customer_Account",
        Account_Number: custId
      },
      Type: "Bill",
      Status: "Active"
    }
    this.searchNotificationOptionRequestForPlans = {
      Account_Info: {
        Account_Type: "GEMS_Residential_Customer_Account",
        Account_Number: custId
      },
      Type: "Contract_Expiration",
      Status: "Active"
    }
    this.notificationService.searchNotificationOption(this.searchNotificationOptionRequestForBill).subscribe(result => {
      console.log('Notification Result for Bill', result);
      this.notificationOptionsForBills = result;
      if (this.notificationOptionsForBills && this.notificationOptionsForBills.length > 0) {
        this.selectedPreference(this.notificationOptionsForBills, this.billingOptions);
      } else {
        this.billingOptions[1].checked = true;
      }
    })
    this.notificationService.searchNotificationOption(this.searchNotificationOptionRequestForPlans).subscribe(result => {
      console.log('Notification Result for plans', result);
      this.notificationOptionsForPlans = result;
      if (this.notificationOptionsForPlans && this.notificationOptionsForPlans.length > 0) {
        this.selectedPreference(this.notificationOptionsForPlans, this.plansOptions);
      } else {
        this.plansOptions[1].checked = true;
      }
    })

  }
  selectedPreference(preference, preferenceOptions) {
    if (preference[0].Paperless) {
      preferenceOptions[0].checked = preference[0].Paperless;
    } else {
      preferenceOptions[0].checked = true;
      preferenceOptions[1].checked = true;
    }
    console.log('this.billOptions', this.billingOptions)
  }

  togglePaperless(billingOptions, plansOptions) {
    let flag = 1;

    billingOptions.forEach(x => {
      if (x.checked) {
        if (x.option == 'Paper') {
          flag = 0;
        }
      }
    });

    plansOptions.forEach(x => {
      if (x.checked) {
        if (x.option == 'Paper') {
          flag = 0;
        }
      }
    });
    if (flag == 1) {
      this.paperlessSettings = true;
    } else {
      this.paperlessSettings = false;
    }  
  }
  
  updateNotificationOption(notificationResponse, selectedOptions) { 
     
     let paperless = false;
     if(selectedOptions[0].checked && !selectedOptions[1].checked){
       paperless = true;       
     }
     
    this.updateNotification = {
      Type: notificationResponse[0].Type,
      Paperless: paperless,
      Preferred_Contact_Method: 'Email',
      Email: notificationResponse[0].Email,
      Status: notificationResponse[0].Status,
      Phone_Number: this.customerDetails.Primary_Phone,
      Account_Info: notificationResponse[0].Account_Info,
      Id:notificationResponse[0].Id
    }
    
    this.notificationService.updateNotificationOption(this.updateNotification).subscribe(
      () => console.log()),
      error => {
        console.log('update notification API error', error.Message);
      }

  }

  //To validate if all the elements in array is checked
  validateCheckbox(element, index, array) {
    if (element.checked) {
      return false;
    }
    return true;
  }

  onCheckSelected(option: string, isChecked: boolean, CheckOptions: any, notificationResponse:any) {
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
    this.updateNotificationOption(notificationResponse, CheckOptions);
  }
}




