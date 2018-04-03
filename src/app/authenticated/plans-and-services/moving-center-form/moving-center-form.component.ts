import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';

import {forEach} from 'lodash';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

import {
  checkIfSunday,
  validateMoveInDate,
  checkIfNewYear,
  checkIfChristmasEve,
  checkIfChristmasDay,
  checkIfJuly4th,
  tduCheck, isTduDifferent
} from 'app/validators/moving-form.validator';

import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';
import { ErrorModalComponent } from 'app/shared/components/error-modal/error-modal.component';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { TransferService } from 'app/core/transfer.service';
import { CalendarService } from 'app/core/calendar.service';
import { OfferService } from 'app/core/offer.service';
import { AvailableDateService } from 'app/core/availabledate.service';

import { ChannelStore } from 'app/core/store/channelstore';
import { TDUStore } from 'app/core/store/tdustore';

import { ITDU } from 'app/core/models/tdu/tdu.model';
import { IAddress } from 'app/core/models/address/address.model';
import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

import { ISearchTransferRequest } from 'app/core/models/transfers/searchtransferrequest.model';
import { TransferRequest } from 'app/core/models/transfers/transfer-request.model';
import { IOfferSelectionPayLoad } from 'app/shared/models/offerselectionpayload';
import { ITduAvailabilityResult } from 'app/core/models/availabledate/tduAvailabilityResult.model';
import { ServiceType } from 'app/core/models/enums/serviceType';
import { IServiceAccountPlanHistoryOffer } from 'app/core/models/serviceaccount/serviceaccountplanhistoryoffer.model';
import { OfferSelectionType } from 'app/core/models/enums/offerselectiontype';
import { validateInteger } from 'app/validators/validator';


import {
  GoogleAnalyticsCategoryType,
  GoogleAnalyticsEventAction
} from 'app/core/models/enums/googleanalyticscategorytype';
import { GoogleAnalyticsService } from 'app/core/googleanalytics.service';

@Component( {
  selector: 'mygexa-moving-center-form',
  templateUrl: './moving-center-form.component.html',
  styleUrls: [ './moving-center-form.component.scss' ],
  providers: [ TransferService, OfferService ]
} )
export class MovingCenterFormComponent implements OnInit, AfterViewInit, OnDestroy {

  formGroupSubscriber: Subscription = null;
  public isTduDifferent: boolean;
  public hasPastDue = false;
  public hasPendingTransfer = false;
  pastDue: number;
  TDUDuns: ITDU[];
  TDUDunsNumbers: string[] = [];
  public ActiveServiceAccount: ServiceAccount = null;
  customerDetails: CustomerAccount = null;


  enableDates: boolean = null;
  tduMoveOutAvailabilityResult: ITduAvailabilityResult;
  tduAvailabilityResult: ITduAvailabilityResult;
  trimmedAvailableDates: Date[];
  missingDates: Array<IMyDate> = null;
  nextClicked: boolean = false;
  previousClicked: boolean = true;
  submitted: boolean = false;
  Final_Bill_To_Old_Service_Address: boolean;
  Keep_Current_Offer: boolean;
  // selectedOffer: IOffers = null;
  selectedOffer: IOfferSelectionPayLoad = null;
  availableOffers = null;
  availableOffersLength: number =null;
  isLoading: boolean = null;
  showNewPlans: boolean = null;
  isKeepCurrent: boolean = true;
  isSelectNew: boolean = false;
  isUseCurrent: boolean = false;
  isUseNew: boolean = false;
  offerId: string;
  showHideAdressList: boolean = true;
  pastDueErrorMessage: string;
  private channelId: string;
  public transferRequest: TransferRequest = null;
  offerSelectionType = OfferSelectionType;
  finalBillAddress: string = null;
  convertedDates: Array<IMyDate> = null;


  private ActiveServiceAccountSubscription: Subscription = null;
  private CustomerAccountSubscription: Subscription = null;
  private channelStoreSubscription: Subscription = null;
  private offerSubscription: Subscription = null;
  private availableDateServiceSubscription: Subscription = null;
  private availableMoveOutDateServiceSubscription: Subscription = null;
  TDUDunsServiceSubscription: Subscription= null;
  public Featured_Usage_Level: string = null;
  public Price_atFeatured_Usage_Level: number;
  public Price_atFeatured_Usage_Level_Renewal: number;
  public Price_atFeatured_Usage_Level_Current: number;
  private TDU_DUNS_Number: string = null;
  offerRequestParams: OfferRequest = null;
  results: ServiceAddress[] = null;
  newServiceAddress: ServiceAddress = null;
  notSameTDU: boolean = null;
  showMorePlans: boolean = null;
  pricingMessage: string;
  addressNotServed: boolean = null;
  isValidAddress: boolean = null;
  @ViewChild( 'selectPlanModal' ) selectPlanModal: SelectPlanModalDialogComponent;
  @ViewChild( 'errorModal' ) errorModal: ErrorModalComponent;
  useOldAddress: boolean = true;
  enableSubmitMoveBtn: boolean = false;
  dynamicUAN = null;

  movingAddressForm: FormGroup;
  ServicePlanForm: FormGroup;
  dynamicAddressForm: FormGroup;

  public newServiceStartDate: IMyOptions = {
    // start date options here...
    disableDays: [],
    disableUntil: { year: 0, month: 0, day: 0 },
    disableSince: { year: 0, month: 0, day: 0 },
    dateFormat: 'mm-dd-yyyy'
  };

  public currentServiceEndDate: IMyOptions = {
    // other end date options here...;
    enableDays: [],
    disableDays: [],
    disableUntil: {
      year: new Date().getFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: new Date().getDate()-1
    },
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: new Date().getDate()+90
    },
    dateFormat: 'mm-dd-yyyy'
  };

  constructor( private fb: FormBuilder,
               private ServiceAccountService: ServiceAccountService,
               private customerAccountService: CustomerAccountService,
               private transferService: TransferService,
               private offerService: OfferService,
               private availableDateService: AvailableDateService,
               private calendarService: CalendarService,
               private channelStore: ChannelStore,
               private tduStore: TDUStore,
               private googleAnalyticsService: GoogleAnalyticsService) {
    this.channelStoreSubscription = this.channelStore.Channel_Id.subscribe(channelId => {
      this.channelId = channelId;
    });
  }

  ngOnInit() {

    this.TDUDunsServiceSubscription = this.tduStore.TDUDetails.subscribe(
      tduDuns => {
        this.TDUDuns = tduDuns;
        const dunsNumber: string[] = [];
        forEach(this.TDUDuns, item => dunsNumber.push(item.Duns_Number));
        this.TDUDunsNumbers = dunsNumber;
      }
    );

    this.movingAddressForm = this.fb.group({
      'Current_Service_End_Date': [null, Validators.compose([
        Validators.required,
        checkIfSunday,
        checkIfNewYear,
        checkIfChristmasEve,
        checkIfChristmasDay,
        checkIfJuly4th])],
      'New_Service_Start_Date': [null, Validators.compose([
        Validators.required,
        checkIfSunday,
        checkIfNewYear,
        checkIfChristmasEve,
        checkIfChristmasDay,
        checkIfJuly4th])],
      'current_bill_address': this.fb.array([])
    }, {validator: validateMoveInDate('Current_Service_End_Date', 'New_Service_Start_Date')});

    this.ServicePlanForm = this.fb.group({
      'service_address': [null, Validators.required],
      'service_plan': [null, Validators.required],
      'final_service_address': this.fb.array([])
    });

    this.dynamicAddressForm = this.fb.group({
      'Line1': [null, Validators.required],
      'Line2': [null],
      'City': [null, Validators.required],
      'State': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      'Zip': [null,  [Validators.required, validateInteger, Validators.minLength(5), Validators.maxLength(5)]]
    });

    let formGroupStatus = 'INVALID';
    this.formGroupSubscriber = this.dynamicAddressForm.statusChanges.subscribe((data: string) => {
      if (data !== formGroupStatus) {
        formGroupStatus = data;
        this.enableSubmitMove();
      }
    });
  }

  ngAfterViewInit() {

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      movingFromAccount => {
        this.ActiveServiceAccount = movingFromAccount;

        this.availableMoveOutDateServiceSubscription = this.availableDateService.getAvailableDate(this.ActiveServiceAccount.UAN).subscribe(
          availableDates => {
            this.tduMoveOutAvailabilityResult = availableDates;
            this.populateMoveOutCalendar();
          });

        this.ServiceAccountService.getPastDue(this.ActiveServiceAccount.Id).subscribe(pastDue => {
          this.pastDue = pastDue;


          this.movingAddressForm.get('Current_Service_End_Date').reset();
          this.movingAddressForm.get('New_Service_Start_Date').reset();

          this.hasPendingTransfer = false;
          this.hasPastDue = false;

          if (this.pastDue > 40) {
            this.hasPastDue = true;
            this.pastDueErrorMessage = 'We are unable to process your request due to Past due Balance';
          } else {
            this.hasPastDue = false;
            this.pastDueErrorMessage = null;
            this.checkForPendingTransfers(this.ActiveServiceAccount.Id);
          }
        });
      });

    this.CustomerAccountSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
      });
  }

  checkForPendingTransfers(serviceAccountId: string) {
    const transferSearchParams = {} as ISearchTransferRequest
    transferSearchParams.Current_Service_Account_Id = serviceAccountId;
    this.transferService.searchTransfers(transferSearchParams)
      .subscribe(transferRecords => {
        this.hasPendingTransfer = (transferRecords && transferRecords.length > 0);
      });
  }

  onStartDateChanged( event: IMyDateModel ) {
    // date selected
  }

  onEndDateChanged( event: IMyDateModel ) {
  }

  previousButtonClicked() {
    this.previousClicked = true;
    this.nextClicked = !this.nextClicked;
    this.ServicePlanForm.get( 'service_plan' ).reset();
  }

  serviceChanged( event ) {
    this.ActiveServiceAccount = event;
  }

  // Get Address from the emitter when users selects new address
  getSelectedAddress( event ) {
    this.newServiceAddress = event;
    this.addressNotServed = this.TDUDunsNumbers.includes(this.newServiceAddress.Meter_Info.TDU_DUNS);
    if (this.newServiceAddress.Meter_Info.UAN !== null && this.TDUDunsNumbers.includes(this.newServiceAddress.Meter_Info.TDU_DUNS)) {
      this.isTduDifferent = isTduDifferent(this.ActiveServiceAccount.TDU_DUNS_Number, this.newServiceAddress.Meter_Info.TDU_DUNS);
      this.ServicePlanForm.get('service_plan').setValidators([Validators.required,]);
      this.availableDateServiceSubscription = this.availableDateService.getAvailableDate(this.newServiceAddress.Meter_Info.UAN).subscribe(
        availableDates => {
          this.tduAvailabilityResult = availableDates;
          this.populateCalendar();
          this.enableDates = true;
        });
    } else {
      this.enableDates = false;
    }
  }


  getSelectedOffer( event ) {
    this.showNewPlans = false; // hide all offers
    this.selectedOffer = event;
    // OfferId should only get passed when user wants to change their offer
    this.offerId = this.selectedOffer.Offer.Id;
  }

  checkCurrentFeaturedUsageLevel(CurrentOffer: IServiceAccountPlanHistoryOffer) {
    if (CurrentOffer) {
        this.Featured_Usage_Level = CurrentOffer.Featured_Usage_Level;
        switch (CurrentOffer.Featured_Usage_Level) {
          case  '500 kWh': {
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt500kwh;
            break;
          }
          case  '1000 kWh': {
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt1000kwh;
            break;
          }
          case  '2000 kWh': {
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt2000kwh;
            break;
          }
          default: {
            CurrentOffer.Featured_Usage_Level = '2000 kWh';
            this.Price_atFeatured_Usage_Level_Current = CurrentOffer.RateAt2000kwh;
            break;
          }
        }
    }
  }

  populateMoveOutCalendar() {

    if ( this.tduMoveOutAvailabilityResult ) {
      // Clear the selected date
      this.currentServiceEndDate = null;
      // Filter the dates
      var calendarData = this.calendarService.getCalendarData( this.tduMoveOutAvailabilityResult, ServiceType.Move_Out);
      // Set calendar options
      // Color code the dates
      this.currentServiceEndDate = {
        disableUntil: calendarData.startDate,
        disableSince: calendarData.endDate,
        disableDays: calendarData.unavailableDates,
        markDates: [ { dates: calendarData.alertDates, color: 'Red' } ]
      };
    }
  }

  populateCalendar() {
    if ( this.tduAvailabilityResult ) {
      // Clear the selected date
      this.newServiceStartDate = null;
      // Filter the dates
      var calendarData = this.calendarService.getCalendarData( this.tduAvailabilityResult, ServiceType.MoveIn );

      // Set calendar options
      // Color code the dates
      this.newServiceStartDate = {
        disableUntil: calendarData.startDate,
        disableSince: calendarData.endDate,
        disableDays: calendarData.unavailableDates,
        markDates: [ { dates: calendarData.alertDates, color: 'Red' } ]
      };

      this.pricingMessage = calendarData.pricingMessage;
    }
  }

  disableFields( $event ) {
    // console.log('h', $event);
    this.isValidAddress = $event;
    this.enableDates = false;
    this.movingAddressForm.controls[ 'New_Service_Start_Date' ].setValue( '' );
  }


  addressFormSubmit( addressForm ) {
    // start date - when the customer wants to turn on their service.
    // dunsNumber - TDU_DNS number from New Address Search API
    this.offerRequestParams = {
      startDate: new Date().toISOString(),
      dunsNumber: this.newServiceAddress.Meter_Info.TDU_DUNS,
      approved: true,
      page_size: 100,
      channelId: this.channelId,
    };
    console.log('Offer params', this.offerRequestParams);
    // send start date and TDU_DUNS_Number to get offers available.
    this.isLoading = true;
    this.offerSubscription = this.offerService.getOffers(this.offerRequestParams)
      .subscribe(result => {
        this.availableOffers = result;
        this.availableOffersLength = this.availableOffers ? this.availableOffers.length : 0;
        this.isLoading = false;
        console.log('this.available offers', this.availableOffers);
        // prevent user from navigating to plans page if we don't offer service in the moving address
        // prevent user from submitting the form if past due balance over 40
        if (this.availableOffers.length > 0) {
          this.nextClicked = true;
          this.previousClicked = !this.previousClicked;
          this.selectedOffer = null;
          // if tdu is different show plans by default.
          if (this.isTduDifferent) {
            this.showPlans();
          } else {
            this.getCurrentPlan();
          }
        }
      });
  }

  // New Service Plans Modal
  showPlans() {
    this.ServicePlanForm.controls[ 'service_plan' ].setValue( 'New Plan' );
    this.showNewPlans = true;
    this.isKeepCurrent = false;
    this.isSelectNew = true;
    // this.selectPlanModal.show();
  }

  morePlansClicked() {
    this.showMorePlans = !this.showMorePlans;
  }

  getCurrentPlan() {
    this.ServicePlanForm.controls[ 'service_plan' ].setValue( 'Current Plan' );
    this.showNewPlans = false;
    this.selectedOffer = null;
    this.isKeepCurrent = true;
    this.isSelectNew = false;

    // should not pass offerId if the user selects existing Plan.
    this.offerId = undefined;

    // On selecting current plan, check if the address is in same TDU or different TDU
    // if (this.ActiveServiceAccount.TDU_DUNS_Number !== this.newServiceAddress.Meter_Info.TDU_DUNS ) {
    //   this.notSameTDU = true;
    // } else { this.notSameTDU = false; }
    this.ServicePlanForm.get( 'service_plan' ).setValidators( [ Validators.required, tduCheck( this.ActiveServiceAccount.TDU_DUNS_Number, this.newServiceAddress.Meter_Info.TDU_DUNS ) ] );

  }
  enableSubmitMove() {

    if (this.ServicePlanForm && this.ServicePlanForm.valid) {
      this.enableSubmitMoveBtn = true;
      if (!this.useOldAddress) {
        if (this.dynamicAddressForm && this.dynamicAddressForm.valid) {
          this.enableSubmitMoveBtn = true;
        } else {
          this.enableSubmitMoveBtn = false;
        }
      }
    } else {
      this.enableSubmitMoveBtn = false;
    }
  }
  useCurrentAddress() {

    this.ServicePlanForm.controls[ 'service_address' ].setValue( 'Current Address' );
    this.finalBillAddress = 'Current Address';
    this.isUseNew = false;
    this.isUseCurrent = true;
    this.enableSubmitMove();
  }

  useNewAddress() {

    this.ServicePlanForm.controls['service_address'].setValue('New Address');
    this.finalBillAddress = 'New Address';
    this.isUseNew = true;
    this.isUseCurrent = false;
    if (!this.useOldAddress) {
    }
    this.enableSubmitMove();
  }

  onSubmitMove( addressForm, billSelector ) {

    this.googleAnalyticsService.postEvent(GoogleAnalyticsCategoryType[GoogleAnalyticsCategoryType.MovingCenter], GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SubmitTransfer]
      , GoogleAnalyticsEventAction[GoogleAnalyticsEventAction.SubmitTransfer]);

    let Partner_Account_Number = null;
    let Partner_Name_On_Account = null;

    console.log( 'addressForm', addressForm );
    console.log( 'billSelector', billSelector );
    const dynamicAddress = {} as IAddress;

    addressForm.current_bill_address = this.ActiveServiceAccount.Mailing_Address;
    // Address where the customer wants to send their final bill
    if ( billSelector.service_address === 'Current Address' ) {
      billSelector.final_service_address = addressForm.current_bill_address;
      this.Final_Bill_To_Old_Service_Address = true;
    } else {
      billSelector.final_service_address = this.newServiceAddress.Address;
      this.Final_Bill_To_Old_Service_Address = false;
    }
    if (this.useOldAddress) {console.log(1);
      dynamicAddress.City = this.newServiceAddress.Address.City;
      dynamicAddress.State = this.newServiceAddress.Address.State;
      dynamicAddress.Line1 = this.newServiceAddress.Address.Line1;
      dynamicAddress.Line2 = this.newServiceAddress.Address.Line2;
      dynamicAddress.Zip = this.newServiceAddress.Address.Zip;
      dynamicAddress.Zip_4 = this.newServiceAddress.Address.Zip_4;
    } else {console.log(2);
      dynamicAddress.City = this.dynamicAddressForm.get('City').value;
      dynamicAddress.State = this.dynamicAddressForm.get('State').value;
      dynamicAddress.Line1 = this.dynamicAddressForm.get('Line1').value;
      dynamicAddress.Line2 = this.dynamicAddressForm.get('Line2').value;
      dynamicAddress.Zip = this.dynamicAddressForm.get('Zip').value;
      dynamicAddress.Zip_4 = null;
      // billSelector.final_service_address = dynamicAddress;
    }
    this.dynamicUAN = this.newServiceAddress.Meter_Info.UAN;


    console.log('dynamicAddress', dynamicAddress);
    this.dynamicUAN = this.newServiceAddress.Meter_Info.UAN;

    // If user selects existing plan , set current offer as true
    if ( billSelector.service_plan === 'Current Plan' ) {
      this.Keep_Current_Offer = true;
    }

    if ( this.Keep_Current_Offer && this.ActiveServiceAccount.Current_Offer.Partner_Info ) {
      Partner_Account_Number = this.ActiveServiceAccount.Current_Offer.Partner_Info.Code;
      Partner_Name_On_Account = this.ActiveServiceAccount.Current_Offer.Partner_Info.Partner.Name;
    } else {
      if (this.selectedOffer && this.selectedOffer.Has_Partner) {
        Partner_Account_Number = this.selectedOffer.Partner_Account_Number;
        Partner_Name_On_Account = this.selectedOffer.Partner_Name_On_Account;
      } else {
        Partner_Account_Number = null;
        Partner_Name_On_Account = null;
      }
    }

    // Request Parms to post data to Transfer service API
    this.transferRequest = {
      // The email must match an email that is attached to a channel.  It is hardcoded now
      Email_Address: String(environment.Client_Email_Addresses),
      Service_Account_Id: this.ActiveServiceAccount.Id,
      Current_Service_End_Date: addressForm.Current_Service_End_Date.jsdate,
      Final_Bill_To_Old_Service_Address: this.Final_Bill_To_Old_Service_Address,
      Final_Bill_Address: billSelector.final_service_address,
      UAN: this.dynamicUAN,
      Billing_Address: dynamicAddress,
      TDSP_Instructions: '',
      New_Service_Start_Date: addressForm.New_Service_Start_Date.jsdate,
      Keep_Current_Offer: this.Keep_Current_Offer,
      Offer_Id: this.offerId,
      Contact_Info: {
        Email_Address: this.customerDetails.Email,
        Primary_Phone_Number: this.customerDetails.Primary_Phone
      },
      Language_Preference: this.customerDetails.Language,
      Promotion_Code_Used: '',
      Date_Sent: new Date().toISOString(),
      Partner_Account_Number: Partner_Account_Number,
      Partner_Name_On_Account: Partner_Name_On_Account,
      Agrees_To_Priority_Move_In_Charge: true
    };
    this.transferService.submitMove( this.transferRequest ).subscribe(
      () => this.submitted = true,
      err => {
        Observable.throw( err );
        this.errorModal.showErrorModal( err );
      } );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
    this.CustomerAccountSubscription.unsubscribe();
    if (this.channelStoreSubscription) {
      this.channelStoreSubscription.unsubscribe();
    }
    if (this.offerSubscription) {
      this.offerSubscription.unsubscribe();
    }
    if (this.availableDateServiceSubscription) {
      this.availableDateServiceSubscription.unsubscribe();
    }
    if (this.TDUDunsServiceSubscription) {
      this.TDUDunsServiceSubscription.unsubscribe();
    }
    if (this.formGroupSubscriber) {
      this.formGroupSubscriber.unsubscribe();
    }

    if (this.availableMoveOutDateServiceSubscription) {
      this.availableMoveOutDateServiceSubscription.unsubscribe();
    }
  }

  toggleAddress() {
    this.useOldAddress = !this.useOldAddress;
    this.enableSubmitMove();
  }

}
