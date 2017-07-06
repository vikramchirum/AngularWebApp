import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateEmail, equalityCheck } from '../../../../validators/validator';
import {CustomerAccountService} from 'app/core/CustomerAccount.service';
import { CustomerAccountClass } from 'app/core/models/CustomerAccount.model';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
import {UserService} from 'app/core/user.service';
import { filter } from 'lodash';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {

  emailAddress: string;
  emailEditing: boolean;
  phoneEditing  = false;
  accountNumber: string;
  customer_account_service: Subscription;
  userservicesubscription: Subscription;
  customerDetails: CustomerAccountClass = null;
  activeBillingDetails: BillingAccountClass = null;
  constructor(private customerAccountService: CustomerAccountService, private userService: UserService) {
     this.emailEditing = false;
   }

  ngOnInit() {
    this.customer_account_service = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
        console.log('Customer Account', this.customerDetails);
      }
    );
    this.userservicesubscription = this.userService.UserObservable.subscribe(
      result => {
        this.accountNumber = result.Account_permissions.filter(x => x.AccountType === 'Customer_Account_Id')[0].AccountNumber;
      }
    );
  }

   toggleEmailEdit($event) {
    $event.preventDefault();
    this.emailEditing = !this.emailEditing;
  }

  togglePhoneEdit($event) {
      $event.preventDefault();
    this.phoneEditing = !this.phoneEditing;

  }

  ngOnDestroy() {
    this.customer_account_service.unsubscribe();
    this.userservicesubscription.unsubscribe();
  }

}
