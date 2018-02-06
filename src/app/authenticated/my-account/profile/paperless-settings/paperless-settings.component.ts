import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { AccountType } from 'app/core/models/enums/accounttype';
import { NotificationType } from 'app/core/models/enums/notificationtype';
import { NotificationStatus } from 'app/core/models/enums/notificationstatus';
import { NotificationOptionsService } from 'app/core/notificationoptions.service';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { ContactMethod } from 'app/core/models/enums/contactmethod';
import { UserService } from 'app/core/user.service';
import { NotificationOptionsStore } from 'app/core/store/notificationoptionsstore';

import {GoogleAnalyticsService} from 'app/core/googleanalytics.service';
import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';

@Component({
  selector: 'mygexa-paperless-settings',
  templateUrl: './paperless-settings.component.html',
  styleUrls: ['./paperless-settings.component.scss']
})
export class PaperlessSettingsComponent implements OnInit {

  billingOptions = [{ option: 'Email', checked: false }, { option: 'Paper', checked: false }];
  plansOptions = [{ option: 'Email', checked: false }, { option: 'Paper', checked: false }];
  paperlessSettings: boolean;
  goPaperless: boolean = false;
  notificationOptionsForBills = null;
  notificationOptionsForPlans = null;
  public SearchNotificationOptions = null;
  searchNotificationOptionRequestForBill = null;
  searchNotificationOptionRequestForPlans = null;
  CustomerAccountServiceSubscription: Subscription = null;
  UserServiceSubscription: Subscription = null;
  customerDetails: CustomerAccount = null;
  updateNotification = null;
  notificationType; emailAddress;

  constructor(private fb: FormBuilder,
    private notificationService: NotificationOptionsService,
    private CustomerAccountService: CustomerAccountService,
    private UserService: UserService,
    private NotificationOptionsStore: NotificationOptionsStore,
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit() {

    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;

        this.notificationType = NotificationType;
        this.SearchNotificationOptions = {
          Account_Info: {
            Account_Type: AccountType.GEMS_Residential_Customer_Account,
            Account_Number: this.customerDetails.Id ? this.customerDetails.Id : null,
          },
          Type: NotificationType.Bill
        };

        this.getNotificationOption(this.customerDetails.Id);
      }
    );

    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => {
        this.emailAddress = result.Profile.Email_Address;
      }
    );
  }

  // fetch notification options for bills and Plans based on Notification Type(Bill, Contract_Expiration)
  getNotificationOption(custId) {
    this.searchNotificationOptionRequestForBill = {
      Account_Info: {
        Account_Type: AccountType.GEMS_Residential_Customer_Account,
        Account_Number: custId
      },
      Type: NotificationType.Bill
    };
    this.searchNotificationOptionRequestForPlans = {
      Account_Info: {
        Account_Type: AccountType.GEMS_Residential_Customer_Account,
        Account_Number: custId
      },
      Type: NotificationType.Contract_Expiration
    };
    this.notificationService.searchNotificationOption(this.searchNotificationOptionRequestForBill).subscribe(result => {
      this.notificationOptionsForBills = result;
      if (this.notificationOptionsForBills && this.notificationOptionsForBills.length > 0) {
        this.selectedPreference(this.notificationOptionsForBills, this.billingOptions);
      } else {
        this.billingOptions[1].checked = true;
      }
      this.togglePaperless(this.billingOptions, this.plansOptions);
    });
    this.notificationService.searchNotificationOption(this.searchNotificationOptionRequestForPlans).subscribe(result => {
      this.notificationOptionsForPlans = result;
      if (this.notificationOptionsForPlans && this.notificationOptionsForPlans.length > 0) {
        this.selectedPreference(this.notificationOptionsForPlans, this.plansOptions);
      } else {
        this.plansOptions[1].checked = true;
      }
      this.togglePaperless(this.billingOptions, this.plansOptions);
    });
  }
  selectedPreference(preference, preferenceOptions) {
    if (preference[0].Status === 'Active') {
      if (preference[0].Paperless) {
        preferenceOptions[0].checked = preference[0].Paperless;
      } else {
        preferenceOptions[0].checked = true;
        preferenceOptions[1].checked = true;
      }
    } else {
      preferenceOptions[1].checked = true;
    }
  }

  togglePaperless(billingOptions, plansOptions) {
    let flag = 1;
    billingOptions.forEach(x => {
      if (x.checked) {
        if (x.option === 'Paper') {
          flag = 0;
        }
      }
    });

    plansOptions.forEach(x => {
      if (x.checked) {
        if (x.option === 'Paper') {
          flag = 0;
        }
      }
    });
    if (flag === 1) {
      this.paperlessSettings = true;
    } else {
      this.paperlessSettings = false;
    }
  }

  // To validate if all the elements in array is checked
  validateCheckbox(element, index, array) {
    if (element.checked) {
      return false;
    }
    return true;
  }

  onCheckSelected(option: string, isChecked: boolean, CheckOptions: any, notificationResponse: any, notificationType) {

    // set google analytics
    if (notificationType === 0) {
      if (option === 'Email') {
        if (isChecked) {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperlessBilling]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperlessBilling]);
        } else {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperlessBilling]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperlessBilling]);
        }
      }

      if (option === 'Paper') {
        if (isChecked) {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperBilling]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperBilling]);
        } else {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperBilling]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperBilling]);
        }
      }
    }

    if (notificationType === 1) {
      if (option === 'Email') {
        if (isChecked) {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperlessPlanDocuments]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperlessPlanDocuments]);
        } else {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperlessPlanDocuments]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperlessPlanDocuments]);
        }
      }

      if (option === 'Paper') {
        if (isChecked) {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperPlanDocuments]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SelectPaperPlanDocuments]);
        } else {
          this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.ProfilePreferences], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperPlanDocuments]
            , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.UnSelectPaperPlanDocuments]);
        }
      }
    }

    let newValue = isChecked;
    CheckOptions.forEach(checkbox => {
      if (checkbox.option === option) {
        checkbox.checked = newValue;
      }
    });
    // toggle Checkbox(When one is unchecked and other becomes checked)
    let isUnchecked = CheckOptions.every(this.validateCheckbox);
    if (isUnchecked) {
      CheckOptions.forEach(checkbox => {
        if (checkbox.option !== option) {
          checkbox.checked = true;
        }
      });
    }
    this.togglePaperless(this.billingOptions, this.plansOptions);
    if (notificationResponse.length > 0) {
      this.updateNotificationOption(notificationResponse, CheckOptions);
    } else {
      this.createNotification(notificationType, CheckOptions);
    }
  }

  // If there is no notification option, call create notification when user makes changes in UI
  createNotification(notificationType, selectedOptions) {
    let paperless = false;
    if (selectedOptions[0].checked && !selectedOptions[1].checked) {
      paperless = true;
    }
    let notificationRequest = {
      Account_Info: {
        Account_Type: AccountType.GEMS_Residential_Customer_Account,
        Account_Number: this.customerDetails.Id
      },
      Type: notificationType,
      Paperless: paperless,
      Preferred_Contact_Method: ContactMethod.Email,
      Email: this.emailAddress, // this.customerDetails.Email,
      Phone_Number: this.customerDetails.Primary_Phone,
      Status: NotificationStatus.Active
    };
    this.notificationService.createNotificationOption(notificationRequest).subscribe(
      () => {
        console.log();
        this.NotificationOptionsStore.LoadNotificationOptions(this.SearchNotificationOptions);
      },
      error => {
        console.log('create notification API error', error.Message);
      });
  }

  // If we have notification option already then call update notification(PUT request)
  updateNotificationOption(notificationResponse, selectedOptions) {
    let paperless = false;
    let status = notificationResponse[0].Status;
    if (selectedOptions[0].checked && !selectedOptions[1].checked) {
      paperless = true;
    }
    // If user selects paper only, change status to Canceled(setting record as inactive)
    if (!selectedOptions[0].checked && selectedOptions[1].checked) {
      status = NotificationStatus.Canceled;
    } else {
      status = NotificationStatus.Active;
    }

    this.updateNotification = {
      Type: notificationResponse[0].Type,
      Paperless: paperless,
      Preferred_Contact_Method: 'Email',
      Email: notificationResponse[0].Email,
      Status: status,
      Phone_Number: this.customerDetails.Primary_Phone,
      Account_Info: notificationResponse[0].Account_Info,
      Id: notificationResponse[0].Id
    };
    this.notificationService.updateNotificationOption(this.updateNotification).subscribe(
      () => {
        console.log();
        this.NotificationOptionsStore.LoadNotificationOptions(this.SearchNotificationOptions);
      },
      error => {
        console.log('update notification API error', error.Message);
      });
  }
}







