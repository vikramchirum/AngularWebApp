import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { IMyDpOptions } from 'mydatepicker';

import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { TransferRequest } from '../../../core/models/transfer-request.model';
import { TransferService } from '../../../core/transfer.service';
import { CustomerAccountClass } from 'app/core/models/CustomerAccount.model';
import { OfferRequest} from '../../../core/models/offer.model';
import { OfferService } from '../../../core/offer.service';

@Component({
  selector: 'mygexa-moving-center-form',
  templateUrl: './moving-center-form.component.html',
  styleUrls: ['./moving-center-form.component.scss'],
  providers: [TransferService, OfferService]
})
export class MovingCenterFormComponent implements OnInit {

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  nextClicked: boolean = false;
  previousClicked: boolean = true;
  movingCenterForm: FormGroup;
  movingAddressForm: FormGroup;
  ServicePlanForm: FormGroup;
  submitted: boolean = false;
  Final_Bill_To_Old_Billing_Address: boolean;
  Keep_Current_Offer: boolean;
  selectedOffer = null;
  availableOffers = null;
  offerId:string;
  
  public transferRequest: TransferRequest = null;

  private ActiveBillingAccountSubscription: Subscription = null;
  private CustomerAccountSubscription: Subscription = null;
  private ActiveBillingAccount = null;
  private TDU_DUNS_Number: string = null;
  customerDetails: CustomerAccountClass = null;
  offerRequestParams:OfferRequest = null;

  @ViewChild('selectPlanModal') selectPlanModal: SelectPlanModalDialogComponent;

  tduCheck(currentTDU, newTDU) {
    return (control: FormControl) => {
      //If user is moving to same TDU, then user can keep the current plan or choose new one
      if (control.value == "Current Plan") {
        if (currentTDU !== newTDU) {
          return {
            tduCheck: true
          }
        }
      }
    }

  }

  constructor(private fb: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private BillingAccountService: BillingAccountService,
    private customerAccountService: CustomerAccountService,
    private transferService: TransferService,
    private offerService:OfferService) {

  }




  ngOnInit() {

    this.movingAddressForm = this.fb.group({
      'Current_Service_End_Date': [null, Validators.required],
      'New_Service_Start_Date': [null, Validators.required],
      'current_bill_address': this.fb.array([]),
      'new_billing_address': this.fb.array([])
    })

    this.ServicePlanForm = this.fb.group({
      'service_address': [null, Validators.required],
      'service_plan': [null, Validators.required],
      'agree_to_terms': [null, Validators.required],
      'final_billing_address': this.fb.array([])
    })

  }


  ngAfterViewInit() {
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      movingFromAccount => {
        this.ActiveBillingAccount = movingFromAccount;
        this.TDU_DUNS_Number = this.ActiveBillingAccount.TDU_DUNS_Number;
        //On selecting current plan, check if the address is in same TDU or different TDU
        //TDU_DUNS for new address is hardcoded now. Get new address TDU from API
        this.ServicePlanForm.get('service_plan').setValidators([Validators.required, this.tduCheck(this.TDU_DUNS_Number, "957877905")]);
      }
    );
    this.CustomerAccountSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
        //console.log('Customer Account', this.customerDetails);
      }
    );
  }

  setDate(): void {
    // Set today date using the setValue function
    let date = new Date();
    this.movingAddressForm.setValue({
      Current_Service_End_Date: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  clearDate(): void {
    // Clear the date using the setValue function
    this.movingAddressForm.setValue({ Current_Service_End_Date: null });
  }



  nextButtonClicked() {
    this.nextClicked = true;
    this.previousClicked = !this.previousClicked;
    this.selectedOffer = null;
  }

  previousButtonClicked() {
    this.previousClicked = true;
    this.nextClicked = !this.nextClicked;
    this.ServicePlanForm.get('service_plan').reset();    
  }

  serviceChanged(event) {
    this.ActiveBillingAccount = event;
  }

  getSelectedOffer(event) {
    this.selectedOffer = event;
    //OfferId should only get passed when user wants to change their offer
    this.offerId = this.selectedOffer.Id;   
  }


  onSubmitMove(addressForm, billSelector) {
    this.submitted = true; 

    addressForm.Current_Service_End_Date = addressForm.Current_Service_End_Date.jsdate.toISOString();
    addressForm.New_Service_Start_Date = addressForm.New_Service_Start_Date.jsdate.toISOString();
    addressForm.current_bill_address = this.ActiveBillingAccount.Mailing_Address;


    // New address where the customer wants to turn on their service. API is not available to fetch new address.
    // For now mapped active account mailing address in new address as well.

    addressForm.new_billing_address = this.ActiveBillingAccount.Mailing_Address;

    //Address where the customer wants to send their final bill
    if (billSelector.service_address == 'Current Address') {
      billSelector.final_billing_address = addressForm.current_bill_address;
      this.Final_Bill_To_Old_Billing_Address = true;
    } else {
      billSelector.final_billing_address = addressForm.new_billing_address;
    }

    //If user selects existing plan , set current offer as true
    if (billSelector.service_plan == 'Current Plan') {
      this.Keep_Current_Offer = true;
    }

    //Request Parms to post data to Transfer service API
    this.transferRequest = {
      Billing_Account_Id: this.ActiveBillingAccount.Id,
      Current_Service_End_Date: addressForm.Current_Service_End_Date,
      Final_Bill_To_Old_Billing_Address: this.Final_Bill_To_Old_Billing_Address,
      Final_Bill_Address: billSelector.final_billing_address,
      UAN: this.ActiveBillingAccount.UAN,
      Billing_Address: addressForm.new_billing_address,
      TDSP_Instructions: "",
      New_Service_Start_Date: addressForm.New_Service_Start_Date,
      Keep_Current_Offer: this.Keep_Current_Offer,
      Offer_Id: this.offerId,
      Contact_Info: {
        Email_Address: this.customerDetails.Email,
        Primary_Phone_Number: this.customerDetails.Primary_Phone
      },
      Language_Preference: this.customerDetails.Language,
      Promotion_Code_Used: '',     
      Date_Sent: new Date().toISOString()
    }
    this.transferService.submitMove(this.transferRequest);
  }

  openSelectPlanModal() {
    this.selectPlanModal.show();
  }

  onServicePlanFormSubmit(addressForm, billSelector) {

  }

//TODO : get new address from API
  onMovingAddressFormSubmit(addressForm) {    
    //start date - when the customer wants to turn on their service.
    //TODO : Get TDU_DNS number from New Address API
   this.offerRequestParams = {
     startDate: addressForm.New_Service_Start_Date.jsdate.toISOString(),
     dunsNumber:"957877905"
   }
   // send start date and TDU_DUNS_Number to get offers available.
    this.offerService.getOffers(this.offerRequestParams)
      .subscribe(result => {
        this.availableOffers = result;
      })
  }

  getCurrentPlan(){  
    this.selectedOffer = null;
    //should not pass offerId if the user selects existing Plan.
    this.offerId=undefined;
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
    this.CustomerAccountSubscription.unsubscribe();
  }


}
