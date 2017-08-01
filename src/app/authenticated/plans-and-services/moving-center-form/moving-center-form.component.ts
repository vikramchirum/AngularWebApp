import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { clone } from 'lodash';
import { Observable } from 'rxjs/Observable';

import { checkIfSunday, validateMoveInDate, checkIfNewYear, checkIfChristmasEve, checkIfChristmasDay, checkIfJuly4th, tduCheck } from '../../../validators/moving-form.validator';
import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { TransferRequest } from '../../../core/models/transfers/transfer-request.model';
import { TransferService } from '../../../core/transfer.service';
import { OfferService } from '../../../core/offer.service';
import { AddressSearchService } from '../../../core/addresssearch.service';
import { ISearchAddressRequest } from '../../../core/models/serviceaddress/searchaddressrequest.model';
import { ServiceAddress } from '../../../core/models/serviceaddress/serviceaddress.model';
import {CustomerAccount} from '../../../core/models/customeraccount/customeraccount.model';
import {OfferRequest} from '../../../core/models/offers/offerrequest.model';

@Component({
  selector: 'mygexa-moving-center-form',
  templateUrl: './moving-center-form.component.html',
  styleUrls: ['./moving-center-form.component.scss'],
  providers: [TransferService, OfferService]
})
export class MovingCenterFormComponent implements OnInit {

  nextClicked: boolean = false;
  previousClicked: boolean = true;
  movingCenterForm: FormGroup;
  movingAddressForm: FormGroup;
  ServicePlanForm: FormGroup;
  submitted: boolean = false;
  Final_Bill_To_Old_Service_Address: boolean;
  Keep_Current_Offer: boolean;
  selectedOffer = null;
  availableOffers = null;
  offerId: string;
  showHideAdressList: boolean = true;
  pastDueErrorMessage : string;

  public transferRequest: TransferRequest = null;

  private ActiveServiceAccountSubscription: Subscription = null;
  private CustomerAccountSubscription: Subscription = null;
  private ActiveServiceAccount = null;
  private TDU_DUNS_Number: string = null;
  customerDetails: CustomerAccount = null;
  offerRequestParams: OfferRequest = null;
  results: ServiceAddress[] = null;
  newServiceAddress: ServiceAddress = null;

  @ViewChild('selectPlanModal') selectPlanModal: SelectPlanModalDialogComponent;


  constructor(private fb: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private ServiceAccountService: ServiceAccountService,
    private customerAccountService: CustomerAccountService,
    private transferService: TransferService,
    private offerService: OfferService,
    private addressSearchService: AddressSearchService) {
    // start date and end date must be future date.
    this.disableUntil();
  }




  ngOnInit() {

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
      'current_bill_address': this.fb.array([]),
      'newAddressSearchField': [null, Validators.required],
      'activeAccountAddress':null
    }, { validator: validateMoveInDate('Current_Service_End_Date', 'New_Service_Start_Date') }),

      this.ServicePlanForm = this.fb.group({
        'service_address': [null, Validators.required],
        'service_plan': [null, Validators.required],
        'agree_to_terms': [false, [Validators.pattern('true')]],
        'final_service_address': this.fb.array([])
      })

  }

  ngAfterViewInit() {

    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      movingFromAccount => {
        //console.log("Active Service Account", movingFromAccount);
        this.ActiveServiceAccount = movingFromAccount;
      }
    );
    this.CustomerAccountSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
       // console.log('Customer Account**************************', result);
      }
    );


    this.movingAddressForm.controls.newAddressSearchField.valueChanges
      // request API only after a specific interval of time and avoid too many API calls.
      // emits a value from the source observable after 200ms
      .debounceTime(200)
      .distinctUntilChanged()
      // Emit values from latest request and discards previous source emission.
      .switchMap((query) => this.searchNewAddress(query))
      .subscribe(result => {
        console.log("Address search Response", result);
        this.results = result;
        this.showHideAdressList = true;
      }),
      error => {
        console.log('Address Search API error', error.Message);
      };
  }

  searchNewAddress(queryString: string) {
    const searchRequest = {} as ISearchAddressRequest;
    searchRequest.partial = queryString;
    return this.addressSearchService.searchAddress(searchRequest)
  }


  private newServiceStartDate: IMyOptions = {
    // start date options here...
    disableUntil: { year: 0, month: 0, day: 0 },
  }


  private currentServiceEndDate: IMyOptions = {
    // other end date options here...
  }

  onStartDateChanged(event: IMyDateModel) {
    // date selected
  }

  onEndDateChanged(event: IMyDateModel) {
    // date selected
    // let d = clone(event.jsdate);
    // let copy: IMyOptions = this.getCopyOfOptions();
    // d.setDate(d.getDate() + 30);
    // copy.disableSince = {
    //   year: d.getFullYear(),
    //   month: d.getMonth() + 1,
    //   day: d.getDate() };
    // this.newServiceStartDate = copy;
  }

  disableUntil() {
    let currentDate = new Date();
    let copy = this.getCopyOfOptions();
    copy.disableUntil = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    };
    this.newServiceStartDate = copy;
    this.currentServiceEndDate = copy;
  }

  getCopyOfOptions(): IMyOptions {
    return JSON.parse(JSON.stringify(this.newServiceStartDate));
  }

  previousButtonClicked() {
    this.previousClicked = true;
    this.nextClicked = !this.nextClicked;
    this.ServicePlanForm.get('service_plan').reset();
  }

  serviceChanged(event) {
    this.ActiveServiceAccount = event;
  }

  getSelectedOffer(event) {
    this.selectedOffer = event;
    //OfferId should only get passed when user wants to change their offer
    this.offerId = this.selectedOffer.Id;
  }


  selectNewServiceAddress(value, event) {
    event.stopPropagation();
    this.movingAddressForm.controls.newAddressSearchField.setValue(value.newAddressString());
    this.newServiceAddress = value;
    this.showHideAdressList = !this.showHideAdressList;
  }

  addressFormSubmit(addressForm) {

    if(this.customerDetails.Past_Due > 40){
     this.pastDueErrorMessage = "We are unable to process your request due to Past due Balance";
    }

    //start date - when the customer wants to turn on their service.
    // dunsNumber - TDU_DNS number from New Address Search API
    this.offerRequestParams = {
      startDate: addressForm.New_Service_Start_Date.jsdate,
      dunsNumber: this.newServiceAddress.Meter_Info.TDU_DUNS
    }
    // send start date and TDU_DUNS_Number to get offers available.
    this.offerService.getOffers(this.offerRequestParams)
      .subscribe(result => {
        this.availableOffers = result;
        //prevent user from navigating to plans page if we don't offer service in the moving address
        //prevent user from submitting the form if past due balance over 40
        if( this.availableOffers.Items.length > 0 && this.customerDetails.Past_Due < 40){
          this.nextClicked = true;
          this.previousClicked = !this.previousClicked;
          this.selectedOffer = null;
        }
      });
  }

  // New Service Plans Modal
  openSelectPlanModal() {
    this.selectPlanModal.show();
  }


  getCurrentPlan() {
    this.selectedOffer = null;
    //should not pass offerId if the user selects existing Plan.
    this.offerId = undefined;

    //On selecting current plan, check if the address is in same TDU or different TDU
    this.ServicePlanForm.get('service_plan').setValidators([Validators.required, tduCheck(this.ActiveServiceAccount.TDU_DUNS_Number, this.newServiceAddress.Meter_Info.TDU_DUNS)]);

  }


  onSubmitMove(addressForm, billSelector) {

    addressForm.current_bill_address = this.ActiveServiceAccount.Mailing_Address;
    //Address where the customer wants to send their final bill
    if (billSelector.service_address === 'Current Address') {
      billSelector.final_service_address = addressForm.current_bill_address;
      this.Final_Bill_To_Old_Service_Address = true;
    } else {
      billSelector.final_service_address = this.newServiceAddress.Address;
      this.Final_Bill_To_Old_Service_Address = false;
    }

    //If user selects existing plan , set current offer as true
    if (billSelector.service_plan === 'Current Plan') {
      this.Keep_Current_Offer = true;
    }

    // Request Parms to post data to Transfer service API
    this.transferRequest = {
      //The email must match an email that is attached to a channel.  It is hardcoded now
      Email_Address: "sirisha.gunupati@gexaenergy.com", //this.customerDetails.Email,
      Service_Account_Id: this.ActiveServiceAccount.Id,
      Current_Service_End_Date: addressForm.Current_Service_End_Date.jsdate,
      Final_Bill_To_Old_Service_Address: this.Final_Bill_To_Old_Service_Address,
      Final_Bill_Address: billSelector.final_service_address,
      UAN: this.newServiceAddress.Meter_Info.UAN,
      Service_Address: this.newServiceAddress.Address,
      TDSP_Instructions: "",
      New_Service_Start_Date: addressForm.New_Service_Start_Date.jsdate,
      Keep_Current_Offer: this.Keep_Current_Offer,
      Offer_Id: this.offerId,
      Contact_Info: {
        Email_Address: "sirisha.gunupati@gexaenergy.com", // this.customerDetails.Email,
        Primary_Phone_Number: this.customerDetails.Primary_Phone
      },
      Language_Preference: this.customerDetails.Language,
      Promotion_Code_Used: '',
      Date_Sent: new Date().toISOString()
    }
    this.transferService.submitMove(this.transferRequest).subscribe(
      () => this.submitted = true),
      error => {
        console.log('Transfer Request API error', error.Message);
      }
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
    this.CustomerAccountSubscription.unsubscribe();
  }



}
