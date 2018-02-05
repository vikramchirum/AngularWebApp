import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMyDpOptions, IMyDate, IMyOptions, IMyDateModel, IMyMarkedDate, IMyMarkedDates } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { OfferService } from 'app/core/offer.service';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';
import { IOffers } from 'app/core/models/offers/offers.model';
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
import { AvailableDateService } from 'app/core/availabledate.service';
import { ITduAvailabilityResult } from 'app/core/models/availabledate/tduAvailabilityResult.model';
import { ServiceType } from 'app/core/models/enums/serviceType';
import { TduAction } from '../../../core/models/enums/tduAction';
import { forEach } from '@angular/router/src/utils/collection';
import { CalendarService } from '../../../core/calendar.service';
import { TDUStore } from '../../../core/store/tdustore';
import { ITDU } from '../../../core/models/tdu/tdu.model';
import { IAddress } from 'app/core/models/address/address.model';
import { IMeterInfo } from 'app/core/models/serviceaddress/meterinfo.model';

@Component( {
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: [ './add-services.component.scss' ]
} )
export class AddServicesComponent implements OnInit, OnDestroy {
  tduAvailabilityResult: ITduAvailabilityResult;
  addServiceForm: FormGroup;
  offerRequestParams: OfferRequest = null;
  selectedServiceAddress: ServiceAddress = null;
  availableOffers: IOffers[] = null;
  featuredOffers = null;
  serviceTypeSource = ServiceType;
  featuredOffersLength: number = null;
  showMorePlans: boolean = null;
  private customerAccountId: string;
  private channelId: string;
  private tokenRes: CustomerCheckToken;
  private tokenMsg: string;
  private isTokenError = false;
  isValidAddress: boolean = null;
  private enrollmentRequest: EnrollmentRequest = null;
  private CustomerAccountSubscription: Subscription = null;
  private channelStoreSubscription: Subscription = null;
  private availableDateServiceSubscription: Subscription = null;
  private TDUDunsServiceSubscription: Subscription = null;
  enableDates: boolean = null;
  private selectedOffers: string[];
  addressServed: boolean = null;
  private customerDetails: CustomerAccount = null;
  private Waiver: string;
  public serviceType?: ServiceType;
  public selectedStartDate: IMyDateModel;
  private selectedOfferId: string;
  public enrollErrorMsg: string;
  public enrolled = false;
  public showPlansFlag = false;
  offerSelectionType = OfferSelectionType;
  selectedOffer: IOfferSelectionPayLoad;
  offerSelected: boolean = null;
  pricingMessage: string;
  TDUDuns: ITDU[] = [];
  TDUDunsNumbers: string[] = [];
  useBillAddress: boolean = true;
  dynamicAddressForm: FormGroup;
  enableSubmitEnroll: boolean = false;
  dynamicUAN = null;
  constructor( private fb: FormBuilder,
               private offerService: OfferService, private UserService: UserService, private enrollService: EnrollService, private customerAccountService: CustomerAccountService,
               private modalStore: ModalStore, private channelStore: ChannelStore, private availableDateService: AvailableDateService, private calendarService: CalendarService,
               private tduStore: TDUStore ) {


    // Keep our customer account id up-to-date.
    this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => this.customerAccountId = CustomerAccountId
    );

    this.channelStoreSubscription = this.channelStore.Channel_Id.subscribe( ChannelId => {
      this.channelId = ChannelId;
    } );
  }

  ngOnInit() {
    this.TDUDunsServiceSubscription = this.tduStore.TDUDetails.subscribe(
      TDUDuns => {
        this.TDUDuns = TDUDuns;
        let DunsNumber: string[] = [];
        this.TDUDuns.forEach(
          item => DunsNumber.push(item.Duns_Number)
        );
        this.TDUDunsNumbers = DunsNumber;
        // console.log('TDU duns number array', this.TDUDunsNumbers);
      }
    );
    this.dynamicAddressForm = this.fb.group({
      'Line1': [null, Validators.required],
      'Line2': [null, Validators.required],
      'City': [null, Validators.required],
      'State': [null, Validators.required],
      'Zip': [null, Validators.required]
    });
  }

  public ServiceStartDate: IMyOptions = {
    // start date options here...
    disableDays: [],
    disableUntil: { year: 0, month: 0, day: 0 },
    disableSince: { year: 0, month: 0, day: 0 },
    dateFormat: 'mm-dd-yyyy'
  };

  populateCalendar() {
    if ( this.serviceType && this.tduAvailabilityResult ) {
      // Clear the selected date
      this.selectedStartDate = null;
      // Filter the dates
      var calendarData = this.calendarService.getCalendarData( this.tduAvailabilityResult, this.serviceType );

      // Set calendar options
      console.log( 'calendarData', calendarData );
      if (calendarData) {
        this.ServiceStartDate = {
          disableUntil: calendarData.startDate,
          disableSince: calendarData.endDate,
          disableDays: calendarData.unavailableDates,
          markDates: [ { dates: calendarData.alertDates, color: 'Red' } ]
        };
      }
      this.pricingMessage = calendarData.pricingMessage;
    }
  }

  disableFields( $event ) {
     // console.log('h', $event);
    this.isValidAddress = $event;
    if (!this.isValidAddress) {
      // console.log('hellllloo');
      this.clearFields();
    }
  }

  clearFields() {
    this.enableDates = false;
    this.ServiceStartDate.disableUntil = { year: 0, month: 0, day: 0 };
    this.ServiceStartDate.disableSince = { year: 0, month: 0, day: 0 };
    this.ServiceStartDate.disableDays = [];
    this.selectedStartDate = this.serviceType = this.featuredOffers = this.featuredOffersLength = null;
    this.showPlansFlag = false;
  }

  // Fetch Offers when users selects new address
  getSelectedAddress( serviceLocation ) {
    this.selectedServiceAddress = serviceLocation;
    console.log('selected address duns', this.selectedServiceAddress.Meter_Info.TDU_DUNS);
    // console.log('result', this.TDUDunsNumbers.includes(this.selectedServiceAddress.Meter_Info.TDU_DUNS));
    this.addressServed = this.TDUDunsNumbers.includes(this.selectedServiceAddress.Meter_Info.TDU_DUNS);
    if (!this.addressServed) {
      this.clearFields();
    }
    // console.log('addressServed', this.addressServed);
    // Get Available dates
    if ( this.selectedServiceAddress.Meter_Info.UAN !== null && this.TDUDunsNumbers.includes(this.selectedServiceAddress.Meter_Info.TDU_DUNS)) {
      this.availableDateServiceSubscription = this.availableDateService.getAvailableDate( this.selectedServiceAddress.Meter_Info.UAN ).subscribe(
        availableDates => {
          this.tduAvailabilityResult = availableDates;
          this.populateCalendar();
        }
      );
    }
    this.showPlansFlag = false;
    this.enrollErrorMsg = '';
    this.tokenMsg = '';
    this.isTokenError = false;
    if ( this.serviceType && this.addServiceForm && this.addServiceForm.value.Service_Start_Date.jsdate ) {
      this.getFeaturedOffers( this.addServiceForm.value.Service_Start_Date.jsdate );
    }
    this.checkCustomerToken();
  }

  onChangeServiceType() {
    if ( this.serviceType ) {
      this.populateCalendar();
      this.enableDates = true;
    } else {
      this.enableDates = false;
    }
  }

  onStartDateChanged( event: IMyDateModel ) {
    // date selected
    if ( this.selectedServiceAddress ) {
      this.getFeaturedOffers( event.jsdate );
    }
  }

  // Fetch Offers by passing start date and TDU_DUNS number of selected addresss
  getFeaturedOffers( ServiceStartDate ) {
    this.offerRequestParams = {
      startDate: ServiceStartDate ? ServiceStartDate.toISOString() : '',
      dunsNumber: this.selectedServiceAddress.Meter_Info.TDU_DUNS,
      approved: true,
      page_size: 100,
      channelId: this.channelId ? this.channelId : ''
    };
    console.log( 'Offer params', this.offerRequestParams );

    // send start date and TDU_DUNS_Number to get offers available.
    this.offerService.getOffers( this.offerRequestParams )
      .subscribe( result => {
        this.availableOffers = result;
        console.log( 'Available Offers', this.availableOffers );
        // filter featured offers based on Featured Channel property
        this.featuredOffers = this.availableOffers.filter( x => {
          if ( x.Plan.Featured_Channels.length > 0 ) {
            return this.availableOffers;
          }
        } );
        this.featuredOffersLength = this.featuredOffers ? this.featuredOffers.length : 0;
        console.log( 'Featured Offers', this.featuredOffers );

      } );
  }

  morePlansClicked() {
    this.showMorePlans = !this.showMorePlans;
  }

  scrollTop() {
    window.scrollTo( 0, 0 );
  }

  onOfferSelected ( event: IOfferSelectionPayLoad ) {
    this.offerSelected = true;
    this.selectedOffer = event;
    console.log('Selected offer', this.selectedOffer);
    this.selectedOfferId = event.Offer.Id;
    // this.formEnrollmentRequest();
    this.enableSubmitMove();
  }

  onNotify() {
    if ( this.formEnrollmentRequest() ) {
      this.enrollService.createEnrollment( this.enrollmentRequest )
        .subscribe( result => {
            console.log( 'final: ', result );
            this.enrollErrorMsg = 'Success';
            this.enrolled = true;
          },
          error => {
            this.enrollErrorMsg = error;
          } );
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

    if ( !(this.customerDetails && this.customerDetails.Id) ) {
      this.enrollErrorMsg = 'Customer Details are missing. Please try again';
      return;
    }

    this.enrollService.getCustomerCheckToken( this.customerDetails.Id )
      .subscribe( result => {
          this.tokenRes = <CustomerCheckToken>result;
          this.tokenMsg = this.tokenRes.Customer_Check_Token;
          if ( this.tokenRes.Enrollment_Deposit_Amount > 0 ) {
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
        } );
  }

  formEnrollmentRequest() {
    if ( !(this.selectedServiceAddress) ) {
      this.enrollErrorMsg = 'Please select Service Address to Continue';
      return false;
    } else if ( !(this.selectedStartDate) ) {
      this.enrollErrorMsg = 'Please select Service Start date to Continue';
      return false;
    }
    if ( !(this.serviceType) ) {
      this.enrollErrorMsg = 'Please select Service Type to Continue';
      return false;
    }
    if ( this.isTokenError ) {
      return false;
    }
    const dynamicAddress = {} as IAddress;
    if (this.useBillAddress) {
      dynamicAddress.City = this.selectedServiceAddress.Address.City;
      dynamicAddress.State = this.selectedServiceAddress.Address.State;
      dynamicAddress.Line1 = this.selectedServiceAddress.Address.Line1;
      dynamicAddress.Line2 = this.selectedServiceAddress.Address.Line2;
      dynamicAddress.Zip = this.selectedServiceAddress.Address.Zip;
      dynamicAddress.Zip_4 = this.selectedServiceAddress.Address.Zip_4;
      this.dynamicUAN = this.selectedServiceAddress.Meter_Info.UAN;
    } else {
      dynamicAddress.City = this.dynamicAddressForm.get('City').value;
      dynamicAddress.State = this.dynamicAddressForm.get('State').value;
      dynamicAddress.Line1 = this.dynamicAddressForm.get('Line1').value;
      dynamicAddress.Line2 = this.dynamicAddressForm.get('Line2').value;
      dynamicAddress.Zip = this.dynamicAddressForm.get('Zip').value;
      dynamicAddress.Zip_4 = null;
      this.dynamicUAN = null;
    }
    this.enrollmentRequest = {
      Email_Address: environment.Client_Email_Addresses,
      Offer_Id: this.selectedOfferId,
      UAN: this.dynamicUAN,
      Customer_Check_Token: this.tokenMsg,
      Waiver: this.Waiver,
      Service_Type: this.serviceType,
      Selected_Start_Date: this.selectedStartDate.jsdate,
      Language_Preference: this.customerDetails.Language,
      Contact_Info: {
        Email_Address: this.customerDetails.Email,
        Primary_Phone_Number: this.customerDetails.Primary_Phone
      },
      Billing_Address: dynamicAddress
    };
    if ( this.selectedOffer.Offer.Has_Partner ) {
      this.enrollmentRequest.Partner_Account_Number = this.selectedOffer.Partner_Account_Number;
      this.enrollmentRequest.Partner_Name_On_Account = this.selectedOffer.Partner_Name_On_Account;
    }
    // console.log('this.enrollmentRequest', this.enrollmentRequest);
    return true;
  }

  ngOnDestroy() {
    if ( this.channelStoreSubscription ) {
      this.channelStoreSubscription.unsubscribe();
    }
    if ( this.availableDateServiceSubscription ) {
      this.availableDateServiceSubscription.unsubscribe();
    }
    if (this.TDUDunsServiceSubscription) {
      this.TDUDunsServiceSubscription.unsubscribe();
    }
  }
  toggleAddress() {
    this.useBillAddress = !this.useBillAddress;
    this.enableSubmitMove();
  }
  enableSubmitMove() {
    if (!this.useBillAddress) {
      if (this.dynamicAddressForm.valid) {
        this.enableSubmitEnroll = true;
      } else {
        this.enableSubmitEnroll = false;
      }
    } else {
      this.enableSubmitEnroll = true;
    }
  }
}
