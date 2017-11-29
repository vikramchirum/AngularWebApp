import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { clone, sortBy } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import {
  checkIfSunday,
  validateMoveInDate,
  checkIfNewYear,
  checkIfChristmasEve,
  checkIfChristmasDay,
  checkIfJuly4th,
  tduCheck
} from 'app/validators/moving-form.validator';
import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { TransferRequest } from 'app/core/models/transfers/transfer-request.model';
import { TransferService } from 'app/core/transfer.service';
import { OfferService } from 'app/core/offer.service';
import { AddressSearchService } from 'app/core/addresssearch.service';
import { ISearchAddressRequest } from 'app/core/models/serviceaddress/searchaddressrequest.model';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';
import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { ChannelStore } from '../../../core/store/channelstore';
import { OfferSelectionType } from '../../../core/models/enums/offerselectiontype';
import { IOffers } from '../../../core/models/offers/offers.model';
import { ServiceAccount } from '../../../core/models/serviceaccount/serviceaccount.model';
import { IOfferSelectionPayLoad } from '../../../shared/models/offerselectionpayload';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { AvailableDateService } from '../../../core/availabledate.service';
import { ITduAvailabilityResult } from '../../../core/models/availabledate/tduAvailabilityResult.model';
import { ServiceType } from '../../../core/models/enums/serviceType';
import { CalendarService } from '../../../core/calendar.service';
import { TDUStore } from '../../../core/store/tdustore';
import { ITDU } from '../../../core/models/tdu/tdu.model';

@Component( {
  selector: 'mygexa-moving-center-form',
  templateUrl: './moving-center-form.component.html',
  styleUrls: [ './moving-center-form.component.scss' ],
  providers: [ TransferService, OfferService ]
} )
export class MovingCenterFormComponent implements OnInit, AfterViewInit, OnDestroy {
  enableDates: boolean = null;
  tduAvailabilityResult: ITduAvailabilityResult;
  trimmedAvailableDates: Date[];
  missingDates: Array<IMyDate> = null;
  nextClicked: boolean = false;
  previousClicked: boolean = true;
  movingCenterForm: FormGroup;
  movingAddressForm: FormGroup;
  ServicePlanForm: FormGroup;
  submitted: boolean = false;
  Final_Bill_To_Old_Service_Address: boolean;
  Keep_Current_Offer: boolean;
  // selectedOffer: IOffers = null;
  selectedOffer: IOfferSelectionPayLoad = null;
  availableOffers = null;
  isLoading: boolean = null;
  showNewPlans: boolean = null;
  isKeepCurrent: boolean = false;
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
  TDUDunsServiceSubscription: Subscription= null;
  TDUDuns: ITDU[];
  private ActiveServiceAccount: ServiceAccount = null;
  private TDU_DUNS_Number: string = null;
  customerDetails: CustomerAccount = null;
  offerRequestParams: OfferRequest = null;
  results: ServiceAddress[] = null;
  newServiceAddress: ServiceAddress = null;
  notSameTDU: boolean = null;
  showMorePlans: boolean = null;
  pricingMessage: string;
  TDUDunsNumbers: string[] = [];
  addressNotServed: boolean = null;
  isValidAddress: boolean = null;
  @ViewChild( 'selectPlanModal' ) selectPlanModal: SelectPlanModalDialogComponent;
  @ViewChild( 'errorModal' ) errorModal: ErrorModalComponent;


  constructor( private fb: FormBuilder,
               private viewContainerRef: ViewContainerRef,
               private ServiceAccountService: ServiceAccountService,
               private customerAccountService: CustomerAccountService,
               private transferService: TransferService,
               private offerService: OfferService,
               private addressSearchService: AddressSearchService,
               private channelStore: ChannelStore,
               private availableDateService: AvailableDateService,
               private calendarService: CalendarService,
               private tduStore: TDUStore ) {
    // start date and end date must be future date.
    this.channelStoreSubscription = this.channelStore.Channel_Id.subscribe( ChannelId => {
      this.channelId = ChannelId;
      console.log('Channel Id', this.channelId);
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
      }
    );
    this.movingAddressForm = this.fb.group( {
      'Current_Service_End_Date': [ null, Validators.compose( [
        Validators.required,
        checkIfSunday,
        checkIfNewYear,
        checkIfChristmasEve,
        checkIfChristmasDay,
        checkIfJuly4th ] ) ],
      'New_Service_Start_Date': [ null, Validators.compose( [
        Validators.required,
        checkIfSunday,
        checkIfNewYear,
        checkIfChristmasEve,
        checkIfChristmasDay,
        checkIfJuly4th ] ) ],
      'current_bill_address': this.fb.array( [] )
    }, { validator: validateMoveInDate( 'Current_Service_End_Date', 'New_Service_Start_Date' ) } ),

      this.ServicePlanForm = this.fb.group( {
        'service_address': [ null, Validators.required ],
        'service_plan': [ null, Validators.required ],
        // 'agree_to_terms': [false, [Validators.pattern('true')]],
        'final_service_address': this.fb.array( [] )
      } );
  }

  ngAfterViewInit() {

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      movingFromAccount => {
        // console.log("Active Service Account", movingFromAccount);
        this.ActiveServiceAccount = movingFromAccount;
        if ( this.ActiveServiceAccount.Past_Due > 49 ) {
          this.pastDueErrorMessage = 'We are unable to process your request due to Past due Balance';
        } else {
          this.pastDueErrorMessage = null;
        }
      }
    );
    this.CustomerAccountSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
        // console.log('Customer Account**************************', result);
        // if ( this.customerDetails.Past_Due > 49 ) {
        //   this.pastDueErrorMessage = 'We are unable to process your request due to Past due Balance';
        // }
      }
    );
  }

  private newServiceStartDate: IMyOptions = {
    // start date options here...
    disableDays: [],
    disableUntil: { year: 0, month: 0, day: 0 },
    disableSince: { year: 0, month: 0, day: 0 },
    dateFormat: 'mm-dd-yyyy'
  };


  private currentServiceEndDate: IMyOptions = {
    // other end date options here...;
    enableDays: [],
    disableDays: [],
    dateFormat: 'mm-dd-yyyy'
  };

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

  getSelectedOffer( event ) {
    this.showNewPlans = false; // hide all offers
    this.selectedOffer = event;
    console.log( 'Offer selected', this.selectedOffer );
    // OfferId should only get passed when user wants to change their offer
    this.offerId = this.selectedOffer.Offer.Id;
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

  // Get Address from the emitter when users selects new address
  getSelectedAddress( event ) {
    this.newServiceAddress = event;
    // if ( this.newServiceAddress === null) {
    //   this.enableDates = false;
    // }
    this.addressNotServed = this.TDUDunsNumbers.includes(this.newServiceAddress.Meter_Info.TDU_DUNS);
    if ( this.newServiceAddress.Meter_Info.UAN !== null && this.TDUDunsNumbers.includes(this.newServiceAddress.Meter_Info.TDU_DUNS )) {
      this.availableDateServiceSubscription = this.availableDateService.getAvailableDate( this.newServiceAddress.Meter_Info.UAN ).subscribe(
        availableDates => {
          this.tduAvailabilityResult = availableDates;
          this.populateCalendar();
          this.enableDates = true;
        } );
    } else {
      this.enableDates = false;
    }
    // console.log('event',  this.newServiceAddress);
  }

  addressFormSubmit( addressForm ) {
    this.pastDueErrorMessage = ( this.ActiveServiceAccount && this.ActiveServiceAccount.Past_Due > 40 ) ? 'We are unable to process your request due to Past due Balance' : null;

    // start date - when the customer wants to turn on their service.
    // dunsNumber - TDU_DNS number from New Address Search API
    this.offerRequestParams = {
      startDate: addressForm.New_Service_Start_Date.jsdate.toISOString(),
      dunsNumber: this.newServiceAddress.Meter_Info.TDU_DUNS,
      approved: true,
      page_size: 100,
      channelId: this.channelId
    };
    console.log( 'Offer params', this.offerRequestParams );
    // send start date and TDU_DUNS_Number to get offers available.
    this.isLoading = true;
    this.offerSubscription = this.offerService.getOffers( this.offerRequestParams )
      .subscribe( result => {
        this.availableOffers = result;
        this.isLoading = false;
        console.log( 'this.available offers', this.availableOffers );
        // prevent user from navigating to plans page if we don't offer service in the moving address
        // prevent user from submitting the form if past due balance over 40
        if ( this.availableOffers.length > 0 && this.ActiveServiceAccount.Past_Due < 40 ) {
          this.nextClicked = true;
          this.previousClicked = !this.previousClicked;
          this.selectedOffer = null;
        }
      } );
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

  useCurrentAddress() {
    this.ServicePlanForm.controls[ 'service_address' ].setValue( 'Current Address' );
    this.finalBillAddress = 'Current Address';
    this.isUseNew = false;
    this.isUseCurrent = true;
  }

  useNewAddress() {
    this.ServicePlanForm.controls[ 'service_address' ].setValue( 'New Address' );
    this.finalBillAddress = 'New Address';
    this.isUseNew = true;
    this.isUseCurrent = false;
  }

  onSubmitMove( addressForm, billSelector ) {
    let Partner_Account_Number = null;
    let Partner_Name_On_Account = null;

    console.log( 'addressForm', addressForm );
    console.log( 'billSelector', billSelector );

    addressForm.current_bill_address = this.ActiveServiceAccount.Mailing_Address;
    // Address where the customer wants to send their final bill
    if ( billSelector.service_address === 'Current Address' ) {
      billSelector.final_service_address = addressForm.current_bill_address;
      this.Final_Bill_To_Old_Service_Address = true;
    } else {
      billSelector.final_service_address = this.newServiceAddress.Address;
      this.Final_Bill_To_Old_Service_Address = false;
    }

    // If user selects existing plan , set current offer as true
    if ( billSelector.service_plan === 'Current Plan' ) {
      this.Keep_Current_Offer = true;
    }

    if ( this.Keep_Current_Offer && this.ActiveServiceAccount.Current_Offer.Partner_Info ) {
      Partner_Account_Number = this.ActiveServiceAccount.Current_Offer.Partner_Info.Code;
      Partner_Name_On_Account = this.ActiveServiceAccount.Current_Offer.Partner_Info.Partner.Name;
    } else {
      Partner_Account_Number = null;
      Partner_Name_On_Account = null;
    }

    // Request Parms to post data to Transfer service API
    this.transferRequest = {
      // The email must match an email that is attached to a channel.  It is hardcoded now
      Email_Address: 'sirisha.gunupati@gexaenergy.com', // this.customerDetails.Email,
      Service_Account_Id: this.ActiveServiceAccount.Id,
      Current_Service_End_Date: addressForm.Current_Service_End_Date.jsdate,
      Final_Bill_To_Old_Service_Address: this.Final_Bill_To_Old_Service_Address,
      Final_Bill_Address: billSelector.final_service_address,
      UAN: this.newServiceAddress.Meter_Info.UAN,
      Billing_Address: this.newServiceAddress.Address,
      TDSP_Instructions: '',
      New_Service_Start_Date: addressForm.New_Service_Start_Date.jsdate,
      Keep_Current_Offer: this.Keep_Current_Offer,
      Offer_Id: this.offerId,
      Contact_Info: {
        Email_Address: 'sirisha.gunupati@gexaenergy.com', // this.customerDetails.Email,
        Primary_Phone_Number: this.customerDetails.Primary_Phone
      },
      Language_Preference: this.customerDetails.Language,
      Promotion_Code_Used: '',
      Date_Sent: new Date().toISOString(),
      Partner_Account_Number: Partner_Account_Number,
      Partner_Name_On_Account: Partner_Name_On_Account
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
    if ( this.channelStoreSubscription ) {
      this.channelStoreSubscription.unsubscribe();
    }
    if ( this.offerSubscription ) {
      this.offerSubscription.unsubscribe();
    }
    if ( this.availableDateServiceSubscription ) {
      this.availableDateServiceSubscription.unsubscribe();
    }
    if (this.TDUDunsServiceSubscription) {
      this.TDUDunsServiceSubscription.unsubscribe();
    }

  }


}
