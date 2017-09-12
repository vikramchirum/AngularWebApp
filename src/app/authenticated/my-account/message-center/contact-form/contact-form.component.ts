import { Component, OnInit, Input, OnDestroy} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { MessageCenterService } from '../../../../core/messagecenter.service';
import { CustomerAccountService } from '../../../../core/CustomerAccount.service';
import { CustomerAccount } from '../../../../core/models/customeraccount/customeraccount.model';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from '../../../../core/models/serviceaccount/serviceaccount.model';
import { IContactUsRequest } from '../../../../core/models/messagecenter/contactusrequest.model';
import { ICustomerAccountPrimaryPhone } from '../../../../core/models/customeraccount/customeraccountprimaryphone.model';

@Component({
  selector: 'mygexa-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {

  @Input() phoneNumber;
  name: string;

  ActiveServiceAccountSubscription: Subscription;
  customerServiceSubscription: Subscription;
  serviceAccount: ServiceAccount;
  customerDetails: CustomerAccount;

  submitted = false;
  message = '';

  constructor(private messageCenterService: MessageCenterService, private customerAccountService: CustomerAccountService
    , private serviceAccountService: ServiceAccountService) {
  }

  ngOnInit() {

    this.customerServiceSubscription = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
        if (this.customerDetails.Primary_Phone && this.customerDetails.Primary_Phone.Area_Code && this.customerDetails.Primary_Phone.Number) {
          this.phoneNumber = this.customerDetails.Primary_Phone.Area_Code.concat(this.customerDetails.Primary_Phone.Number);
        } else {
          this.phoneNumber = this.customerDetails.Primary_Phone.Number;
        }
        this.name = this.customerDetails.First_Name + ' ' + this.customerDetails.Last_Name;
      });

    this.ActiveServiceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.serviceAccount = result;
      });
  }

  onSubmit(model: any, isValid: boolean) {

    const contactUsRequest = {} as IContactUsRequest;
    contactUsRequest.DaytimePhone = {} as ICustomerAccountPrimaryPhone;

    contactUsRequest.Service_Account_Id = this.serviceAccount.Id;
    contactUsRequest.Question = this.message;
    contactUsRequest.DaytimePhone.Number = this.phoneNumber;

    this.messageCenterService.contactus(contactUsRequest).subscribe(res => {

      if (res) {
        console.log('message sent');
      }

    });

    this.submitted = true;
  }

  ngOnDestroy() {
    this.customerServiceSubscription.unsubscribe();
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
