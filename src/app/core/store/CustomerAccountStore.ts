import {Injectable} from '@angular/core';
import {CustomerAccountService} from '../CustomerAccount.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CustomerAccount} from '../models/customeraccount/customeraccount.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CustomerAccountStore {
  private LatestCustomerDetails: BehaviorSubject<CustomerAccount> = new BehaviorSubject(null);
  constructor(private CustomerAccountService: CustomerAccountService) {}
  get CustomerDetails() {
    return this.LatestCustomerDetails.asObservable();
  }
  LoadCustomerDetails(CustomerAccountID: string) {
    this.CustomerAccountService.GetCustomerDetails(CustomerAccountID).subscribe(
      UpdatedCustomerAccountDetails => {
        this.LatestCustomerDetails.next(UpdatedCustomerAccountDetails);
      });
  }
  UpdateCustomerDetails(CustomerDetails: CustomerAccount): Observable<CustomerAccount> {
    const observable = this.CustomerAccountService.UpdateCustomerDetails(CustomerDetails);
    observable.subscribe(
      UpdatedCustomerAccountDetails => {
       // console.log('Customer details updated', UpdatedCustomerAccountDetails);
        // this.LoadCustomerDetails(UpdatedCustomerAccountDetails.Id);
         this.LatestCustomerDetails.next(UpdatedCustomerAccountDetails);
      });
    return observable;
  }
}
