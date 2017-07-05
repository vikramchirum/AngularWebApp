import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { IMyDpOptions } from 'mydatepicker';

import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog/select-plan-modal-dialog.component';
import { BillingAccountService } from 'app/core/BillingAccount.service';
import { TransferRequest } from '../../../core/models/transfer-request.model';
import { TransferService } from '../../../core/transfer.service';


@Component({
  selector: 'mygexa-moving-center-form',
  templateUrl: './moving-center-form.component.html',
  styleUrls: ['./moving-center-form.component.scss'],
  providers: [TransferService]
})
export class MovingCenterFormComponent implements OnInit {

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  nextClicked: boolean = false;
  previousClicked: boolean = true;
  New_Service_Start_Date;
  Current_Service_End_Date;
  movingCenterForm: FormGroup;
  movingAddressForm: FormGroup;
  ServicePlanForm: FormGroup;
  submitted: boolean = false;

  public transferRequest: TransferRequest = null;

  private ActiveBillingAccountSubscription: Subscription = null;
  private ActiveBillingAccount = null;
  private TDU_DUNS_Number:string = null;

  @ViewChild('selectPlanModal') selectPlanModal: SelectPlanModalDialogComponent;

  tduCheck(currentTDU, newTDU) {
    return (control: FormControl) => {
      console.log("control.value", control.value);
       console.log("currentTDU", currentTDU);
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

  constructor(fb: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private BillingAccountService: BillingAccountService,

    private transferService: TransferService) {

    this.movingAddressForm = fb.group({
      'Current_Service_End_Date': [null, Validators.required],
      'New_Service_Start_Date': [null, Validators.required],
      'current_bill_address': fb.array([]),
      'new_billing_address': fb.array([])
    })

    this.ServicePlanForm = fb.group({
      'service_address': [null, Validators.required],
      'service_plan': '',
      'agree_to_terms': [null, Validators.required],
      'final_billing_address': fb.array([])
    })
  }




  ngOnInit() {

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
  }

  previousButtonClicked() {
    this.previousClicked = true;
    this.nextClicked = !this.nextClicked;
  }

  serviceChanged(event) {
    this.ActiveBillingAccount = event;
    console.log("change", this.ActiveBillingAccount);
  }

  getSelectedOffer(event) {
    console.log("selected offer......................", event)

  }


  onSubmitMove(addressForm, billSelector) {
    this.submitted = true;
    console.log(addressForm, billSelector);
    addressForm.Current_Service_End_Date = addressForm.Current_Service_End_Date.jsdate.toISOString();
    addressForm.New_Service_Start_Date = addressForm.New_Service_Start_Date.jsdate.toISOString();
    addressForm.current_bill_address = this.ActiveBillingAccount.Mailing_Address;


    // New address where the customer wants to turn on their service. API is not available to fetch new address.
    // For now mapped active account mailing address in new address as well.

    addressForm.new_billing_address = this.ActiveBillingAccount.Mailing_Address;

    //Address where the customer wants to send their final bill
    if (billSelector.service_address == "Current Address") {
      billSelector.final_billing_address = addressForm.current_bill_address;
    } else {
      billSelector.final_billing_address = addressForm.new_billing_address;
    }

    this.transferRequest = {
      Billing_Account_Id: this.ActiveBillingAccount.Id,
      Current_Service_End_Date: addressForm.Current_Service_End_Date,
      Final_Bill_To_Old_Billing_Address: true,
      Final_Bill_Address: billSelector.final_billing_address,
      UAN: this.ActiveBillingAccount.UAN,
      Billing_Address: addressForm.new_billing_address,
      TDSP_Instructions: "",
      New_Service_Start_Date: addressForm.New_Service_Start_Date,
      Keep_Current_Offer: true,
      Offer_Id: '',
      //Contact_Info: 
      Language_Preference: '',
      Promotion_Code_Used: '',
      Channel_Id: '',
      Referrer_Id: '',
      Date_Sent: ''
    }
    this.transferService.submitMove(this.transferRequest);
  }

  openSelectPlanModal() {
    this.selectPlanModal.show();
  }

  onServicePlanFormSubmit(addressForm, billSelector) {

  }

  onMovingAddressFormSubmit(addressForm) {
    console.log("addressForm", addressForm);
  }


}
