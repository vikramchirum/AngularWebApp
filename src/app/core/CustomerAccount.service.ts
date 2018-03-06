
import {Injectable} from '@angular/core';
import {clone, forEach, pull} from 'lodash';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {HttpClient} from './httpclient';
import {UserService} from './user.service';
import {CustomerAccount} from './models/customeraccount/customeraccount.model';

@Injectable()
export class CustomerAccountService {

  public CustomerAccountCache: CustomerAccount = null;
  public CustomerAccountObservable: Observable<CustomerAccount> = null;

  private initialized: boolean = null;
  private CustomerAccountsObservers: Observer<CustomerAccount>[] = [];
  private requestObservable: Observable<Response> = null;
  private _CustomerAccountId: string = null;

  constructor(private HttpClient: HttpClient, private UserService: UserService) {

    // Make the Observables for others to listen to.
    this.CustomerAccountObservable = Observable.create((observer: Observer<CustomerAccount>) => {
      // 1. Collect, or 'push', new observers to the observable's collection.
      this.CustomerAccountsObservers.push(observer);
      // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
      if (this.initialized) { observer.next(this.CustomerAccountCache); }
      // 3. Provide the new observer a clean-up function to prevent memory leaks.
      return () => pull(this.CustomerAccountsObservers, observer);
    });

    // Console.log the latest customer account.
    this.CustomerAccountObservable.subscribe(
      CustomerAccount => console.log('CustomerAccount = ', CustomerAccount)
    );

    // Respond to the first (initializing) call.
    this.CustomerAccountObservable.first().delay(0).subscribe(() => {
      this.initialized = true;
    });

    // Keep the customer account id synced.
    this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => this.CustomerAccountId = CustomerAccountId
    );
  }

  get CustomerAccountId(): string {
    return this._CustomerAccountId;
  }
  set CustomerAccountId(CustomerAccountId: string) {
    if (this._CustomerAccountId !== CustomerAccountId) {
      this._CustomerAccountId = CustomerAccountId;
      this.UpdateCustomerAccount();
    }
  }

  UpdateCustomerAccount(): Observable<Response> {

    // If we're already requesting then return the original request observable.
    if (this.requestObservable) { return this.requestObservable; }

    // If we don't have a Customer Account Id then return null;
    if (this.CustomerAccountId === null) { return Observable.from(null); }

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.HttpClient.get(`/customer_accounts/${this.CustomerAccountId}`)
      .map(data => data.json())
      .catch(error => this.HttpClient.handleHttpError(error));

    // Handle the new account data.
    this.requestObservable.subscribe(
      data => this.CustomerAccountCache = new CustomerAccount(data),
      error => this.HttpClient.handleHttpError(error),
      () => {
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.CustomerAccountsObservers, this.CustomerAccountCache);
      }
    );

    return this.requestObservable;
  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

  GetCustomerDetails(CustomerAccountId: string): Observable<CustomerAccount> {
    const relativePath = `/customer_accounts/${this.CustomerAccountId}`;
    return this.HttpClient.get(relativePath)
       .map(data => data.json())
      .map(data => {new CustomerAccount(data); console.log('Customer account', data); return data; })
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  UpdateCustomerDetails(CustomerDetails: CustomerAccount): Observable<CustomerAccount> {
    const body = CustomerDetails;
    const relativePath = `/customer_accounts/`;
    return this.HttpClient.put(relativePath, body)
      .map(res => res.json())
      .map(res => {new CustomerAccount(res);
      // console.log('Updated Customer account', res);
      return res; })
      .catch(error => this.HttpClient.handleHttpError(error));
  }

  getPastDue(customerAccountId: string): Observable<number> {
    return this.HttpClient.get(`/customer_accounts/${customerAccountId}/past_due`)
      .map(res => res.json())
      .catch(err => this.HttpClient.handleHttpError(err));
  }
}
