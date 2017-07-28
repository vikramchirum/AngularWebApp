import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateEmail, equalityCheck } from '../../../../validators/validator';
import {CustomerAccountService} from 'app/core/CustomerAccount.service';
import {UserService} from 'app/core/user.service';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccount} from "../../../../core/models/customeraccount/customeraccount.model";

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
  customerDetails: CustomerAccount = null;
  constructor(private customerAccountService: CustomerAccountService, private userService: UserService) {
     this.emailEditing = false;
   }

  ngOnInit() {
    this.customer_account_service = this.customerAccountService.CustomerAccountObservable.subscribe(
      result => {
        this.customerDetails = result;
      }
    );
    this.userservicesubscription = this.userService.UserObservable.subscribe(
      result => {
        this.accountNumber = result.Account_permissions.filter(x => x.AccountType === 'Customer_Account_Id')[0].AccountNumber;
        this.emailAddress = result.Profile.Email_Address;
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
