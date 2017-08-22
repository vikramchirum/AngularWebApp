import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { OfferService } from 'app/core/offer.service';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';

@Component({
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  addServiceForm : FormGroup;
  offerRequestParams: OfferRequest = null;
  selectedServiceAddress: ServiceAddress = null;
  availableOffers = null;

  constructor(private fb: FormBuilder,
   private offerService: OfferService) { }

  ngOnInit() {
    this.addServiceForm = this.fb.group({
      Service_Start_Date:[null, Validators.required],
      serviceType:''
    });
     
  }

  getSelectedAddress(event){
    this.selectedServiceAddress = event;

  }

  getFeaturedOffers(){
   // console.log(event);
    console.log("start service date",this.addServiceForm.controls['Service_Start_Date'].value);
     this.offerRequestParams = {
      startDate: this.addServiceForm.controls['Service_Start_Date'].value.jsdate,
      dunsNumber: this.selectedServiceAddress.Meter_Info.TDU_DUNS
    }
    // send start date and TDU_DUNS_Number to get offers available.
    this.offerService.getOffers(this.offerRequestParams)
      .subscribe(result => {        
       this.availableOffers = result;
       console.log("Available Offers", this.availableOffers)
        
      });
  }

  scrollTop() {
    window.scrollTo(0,0);
  }


}
