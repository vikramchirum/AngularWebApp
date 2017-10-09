import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMyDpOptions, IMyDate, IMyOptions, IMyDateModel } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { OfferService } from 'app/core/offer.service';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';
import { IOffers } from 'app/core/models/offers/offers.model';

import { checkIfSunday, checkIfNewYear, checkIfChristmasEve, checkIfChristmasDay, checkIfJuly4th } from 'app/validators/moving-form.validator';
import { UserService } from 'app/core/user.service';
import { EnrollService } from 'app/core/enroll.service';
import { CustomerCheckToken } from 'app/core/models/customercheckstoken/customer-checks.model';
import { EnrollmentRequest } from 'app/core/models/enrolladditionalservices/enrollment-request.model';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { ModalStore } from 'app/core/store/modalstore';
import { ChannelStore } from 'app/core/store/channelstore';
import { OfferSelectionType } from 'app/core/models/enums/offerselectiontype';
import { IOfferSelectionPayLoad } from 'app/shared/models/offerselectionpayload';
import { environment } from 'environments/environment';

@Component({
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit, OnDestroy {

  addServiceForm: FormGroup;
  offerRequestParams: OfferRequest = null;
  selectedServiceAddress: ServiceAddress = null;
  availableOffers: IOffers[] = null;
  featuredOffers = null;
  private customerAccountId: string;
  private channelId: string;
  private tokenRes: CustomerCheckToken;
  private tokenMsg: string;
  private isTokenError = false;

  private enrollmentRequest: EnrollmentRequest = null;
  private CustomerAccountSubscription: Subscription = null;
  private channelStoreSubscription: Subscription = null;

  private selectedOffers: string[];

  private customerDetails: CustomerAccount = null;
  private Waiver: string;
  private serviceType: string;
  private selectedOfferId: string;
  private enrollErrorMsg: string;
  private selDate: IMyDate = { year: 0, month: 0, day: 0 };
  private enrolled: boolean = false;
  private showPlansFlag: boolean = false;
  offerSelectionType = OfferSelectionType;
  selectedOffer: IOfferSelectionPayLoad;

  constructor(private fb: FormBuilder,
    private offerService: OfferService, private UserService: UserService, private enrollService: EnrollService, private customerAccountService: CustomerAccountService,
    private modalStore: ModalStore, private channelStore: ChannelStore) {


    this.disableUntil();
    let defaultDate = this.getBusinessDays();
    // To set default date
    this.selDate = {
      year: defaultDate.getFullYear(),
      month: defaultDate.getMonth() + 1,
      day: defaultDate.getDate()
    };

    // Keep our customer account id up-to-date.
    this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => this.customerAccountId = CustomerAccountId
    );

    this.channelStoreSubscription = this.channelStore.Channel_Id.subscribe( ChannelId =>  { this.channelId = ChannelId; });
  }

  ngOnInit() {
    this.addServiceForm = this.fb.group({
      Service_Start_Date:  [{date: this.selDate}, Validators.compose([
        Validators.required,
        checkIfNewYear,
        checkIfChristmasEve,
        checkIfChristmasDay,
        checkIfJuly4th])],
      serviceType: ''
    });

  }

  // to fetch default date(3 business days from today) excluding weekends and holidays
  getBusinessDays() {
    let calculator = {
      workDaysAdded: 0,
      gexaHolidays: ['01-01', '07-04', '12-24', '12-25'], // ['month-date']
      startDate: null,
      curDate: null,

      addWorkDay: function () {
        this.curDate.setDate(this.curDate.getDate() + 1);
        if (this.gexaHolidays.indexOf(this.formatDate(this.curDate)) === -1 && this.curDate.getDay() !== 0 && this.curDate.getDay() !== 6) {
          this.workDaysAdded++;
        }
      },

      formatDate: function (date) {
        var day = date.getDate(),
          month = date.getMonth() + 1;

        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return month + '-' + day;
      },

      getNewWorkDay: function (daysToAdd) {
        this.startDate = new Date();
        this.curDate = new Date();
        this.workDaysAdded = 0;

        while (this.workDaysAdded < daysToAdd) {
          this.addWorkDay();
        }
        return this.curDate;
      }
    };
    return calculator.getNewWorkDay(3);
  }



  private ServiceStartDate: IMyOptions = {
    // start date options here...
    disableUntil: { year: 0, month: 0, day: 0 },
    dateFormat: 'mm-dd-yyyy'
  }
  // Calling this function set disableUntil value
  disableUntil() {
    let d = this.getBusinessDays();
    d.setDate(d.getDate() - 1);
    let copy = this.getCopyOfOptions();
    copy.disableUntil = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
    this.ServiceStartDate = copy;
  }

  // Returns copy of myOptions
  getCopyOfOptions(): IMyOptions {
    return JSON.parse(JSON.stringify(this.ServiceStartDate));
  }

  // Fetch Offers when users selects new address
  getSelectedAddress(event) {
    this.selectedServiceAddress = event;
    this.showPlansFlag = false;
    this.enrollErrorMsg = '';
    this.tokenMsg = '';
    this.isTokenError = false;
    this.getFeaturedOffers(this.addServiceForm.value.Service_Start_Date.jsdate);
    this.checkCustomerToken();
  }


  onStartDateChanged(event: IMyDateModel) {
    // date selected
    if (this.selectedServiceAddress) {
      this.getFeaturedOffers(event.jsdate);
    }
  }

  // Fetch Offers by passing start date and TDU_DUNS number of selected addresss
  getFeaturedOffers(ServiceStartDate) {
    this.offerRequestParams = {
      startDate: ServiceStartDate.toISOString(),
      dunsNumber: this.selectedServiceAddress.Meter_Info.TDU_DUNS,
      approved: true,
      page_size: 100,
      channelId: this.channelId ? this.channelId : ''
    };
    console.log('Offer params', this.offerRequestParams);

    // send start date and TDU_DUNS_Number to get offers available.
    this.offerService.getOffers(this.offerRequestParams)
      .subscribe(result => {
        this.availableOffers = result;
        console.log('Available Offers', this.availableOffers);
        // filter featured offers based on Featured Channel property
        this.featuredOffers = this.availableOffers.filter(x => {
          if (x.Plan.Featured_Channels.length > 0) {
            return this.availableOffers;
          }
        });
        console.log('Featured Offers', this.featuredOffers);

      });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }


  onNotify(event) {
    this.selectedOffer = event;
    this.selectedOfferId = event.Id;
    if (this.formEnrollmentRequest()) {
      this.enrollService.createEnrollment(this.enrollmentRequest)
      .subscribe(result => {
        console.log('final: ', result);
        this.enrollErrorMsg = 'Success';
        this.enrolled = true;
      },
    error => {
      this.enrollErrorMsg = error;
    });
    }
  }

  showPlans() {
    this.showPlansFlag = true;
  }

  checkCustomerToken() {
    this.CustomerAccountSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
      }
    );

    if (!(this.customerDetails && this.customerDetails.Id)) {
      this.enrollErrorMsg = 'Customer Details are missing. Please try again';
      return;
    }

    this.enrollService.getCustomerCheckToken(this.customerDetails.Id)
    .subscribe(result => {
      this.tokenRes = <CustomerCheckToken>result;
      this.tokenMsg = this.tokenRes.Customer_Check_Token;
      if (this.tokenRes.Enrollment_Deposit_Amount > 0) {
        this.Waiver = 'Pay_Later';
      } else {
        this.Waiver = 'No_Waiver';
      }
      this.isTokenError = false;
    },
    error => {
      this.tokenMsg = error;
      this.isTokenError = true;
      // console.log("Error1", error);
    });
  }

  formEnrollmentRequest() {
    if (!(this.selectedServiceAddress)) {
      this.enrollErrorMsg = 'Please select Service Address to Continue';
      return false;
    } else if (!(this.addServiceForm.controls['Service_Start_Date'].value)) {
      this.enrollErrorMsg = 'Please select Service Start date to Continue';
      return false;
    }
    if (!(this.serviceType)) {
      this.enrollErrorMsg = 'Please select Service Type to Continue';
      return false;
    }
    if (this.isTokenError) {
      return false;
    }
    this.enrollmentRequest = {
      Email_Address: environment.Client_Email_Addresses,
      Offer_Id: this.selectedOfferId,
      UAN: this.selectedServiceAddress.Meter_Info.UAN,
      Customer_Check_Token: this.tokenMsg,
      Waiver: this.Waiver,
      Service_Type: this.serviceType,
      Selected_Start_Date: new Date(this.addServiceForm.controls['Service_Start_Date'].value.formatted).toISOString(),
      Language_Preference: this.customerDetails.Language,
      Contact_Info: {
        Email_Address: environment.Client_Email_Addresses,
        Primary_Phone_Number: this.customerDetails.Primary_Phone
      },
      Billing_Address: this.selectedServiceAddress.Address
    };
    if(this.selectedOffer.Offer.Has_Partner) {
      this.enrollmentRequest.Partner_Account_Number = this.selectedOffer.Partner_Account_Number;
      this.enrollmentRequest.Partner_Name_On_Account = this.selectedOffer.Partner_Name_On_Account;
    }
    //console.log('this.enrollmentRequest', this.enrollmentRequest);
    return true;
  }

  ngOnDestroy() {
    if (this.channelStoreSubscription) {
      this.channelStoreSubscription.unsubscribe();
    }
  }
}
