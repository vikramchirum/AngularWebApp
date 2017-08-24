import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMyDpOptions, IMyDate, IMyOptions, IMyDateModel } from 'mydatepicker';

import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { OfferService } from 'app/core/offer.service';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';
import { IOffers } from 'app/core/models/offers/offers.model';

@Component({
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  addServiceForm: FormGroup;
  offerRequestParams: OfferRequest = null;
  selectedServiceAddress: ServiceAddress = null;
  availableOffers : IOffers[] = null;
  featuredOffers = null;


  private selDate: IMyDate = { year: 0, month: 0, day: 0 };

  constructor(private fb: FormBuilder,
    private offerService: OfferService) {
    let d: Date = new Date();
    this.addBusinessDays(new Date(), 3);
    let defaultDate = this.addBusinessDays(new Date(), 3);
    this.selDate = {
      year: defaultDate.getFullYear(),
      month: defaultDate.getMonth() + 1,
      day: defaultDate.getDate()
    };

    this.disableUntil();
  }

  ngOnInit() {
    this.addServiceForm = this.fb.group({
      Service_Start_Date: [Validators.required],
      serviceType: ''
    });

  }

  //To exclude weekends
  addBusinessDays(d, n) {
    d = new Date(d.getTime());
    var day = d.getDay();
    d.setDate(d.getDate() + n + (day === 6 ? 2 : +!day) + (Math.floor((n - 1 + (day % 6 || 1)) / 5) * 2));
    return d;
  }

  private ServiceStartDate: IMyOptions = {
    // start date options here... 
    disableUntil: { year: 0, month: 0, day: 0 }
  }
  // Calling this function set disableUntil value 
  disableUntil() {
    let d = this.addBusinessDays(new Date(), 3);
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

  getSelectedAddress(event) {
    this.selectedServiceAddress = event;
    this.getFeaturedOffers();
  }
  onStartDateChanged(event: IMyDateModel) {
    // date selected
    this.getFeaturedOffers();
  }

  getFeaturedOffers() {
    // console.log(event);   
    this.offerRequestParams = {
      startDate: this.addServiceForm.controls['Service_Start_Date'].value.jsdate,
      dunsNumber: this.selectedServiceAddress.Meter_Info.TDU_DUNS
    }
    // send start date and TDU_DUNS_Number to get offers available.
    this.offerService.getOffers(this.offerRequestParams)
      .subscribe(result => {
        this.availableOffers = result;
        console.log("Available Offers", this.availableOffers);
       //  this.accountNumber = result.Account_permissions.filter(x => x.AccountType === 'Customer_Account_Id')[0].AccountNumber;
        this.featuredOffers = this.availableOffers.filter(x=>{
          if(x.Plan.Featured_Channels.length > 0){
            return this.availableOffers;
          }
        })
        console.log('Featured Offers',  this.featuredOffers)

      });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }




}
