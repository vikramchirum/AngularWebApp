import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMyDpOptions, IMyDate, IMyOptions, IMyDateModel } from 'mydatepicker';

import { OfferRequest } from 'app/core/models/offers/offerrequest.model';
import { OfferService } from 'app/core/offer.service';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';
import { IOffers } from 'app/core/models/offers/offers.model';

import { checkIfSunday, checkIfNewYear, checkIfChristmasEve, checkIfChristmasDay, checkIfJuly4th } from 'app/validators/moving-form.validator';

@Component({
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  addServiceForm: FormGroup;
  offerRequestParams: OfferRequest = null;
  selectedServiceAddress: ServiceAddress = null;
  availableOffers: IOffers[] = null;
  featuredOffers = null;



  private selDate: IMyDate = { year: 0, month: 0, day: 0 };

  constructor(private fb: FormBuilder,
    private offerService: OfferService) {

    this.disableUntil();
    let defaultDate = this.getBusinessDays();
    //To set default date
    this.selDate = {
      year: defaultDate.getFullYear(),
      month: defaultDate.getMonth() + 1,
      day: defaultDate.getDate()
    };

  }

  ngOnInit() {
    this.addServiceForm = this.fb.group({
      Service_Start_Date:  [{date:this.selDate}, Validators.compose([
        Validators.required,
        checkIfNewYear,
        checkIfChristmasEve,
        checkIfChristmasDay,
        checkIfJuly4th])],
      serviceType: ''
    });

  }

  //to fetch default date(3 business days from today) excluding weekends and holidays
  getBusinessDays() {
    let calculator = {
      workDaysAdded: 0,
      gexaHolidays: ['01-01', '07-04', '12-24', '12-25'],//['month-date']
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
    }
    return calculator.getNewWorkDay(3);
  }



  private ServiceStartDate: IMyOptions = {
    // start date options here... 
    disableUntil: { year: 0, month: 0, day: 0 }
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

  //Fetch Offers when users selects new address
  getSelectedAddress(event) {
    this.selectedServiceAddress = event;
    this.getFeaturedOffers();
  }


  onStartDateChanged(event: IMyDateModel) {
    // date selected
    this.getFeaturedOffers();
  }

  //Fetch Offers by passing start date and TDU_DUNS number of selected addresss
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
        //filter featured offers based on Featured Channel property
        this.featuredOffers = this.availableOffers.filter(x => {
          if (x.Plan.Featured_Channels.length > 0) {
            return this.availableOffers;
          }
        })
        console.log('Featured Offers', this.featuredOffers)

      });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }




}
