
import { Injectable } from '@angular/core';

import { clone, forEach, get, pull } from 'lodash';
import { HttpClient } from './httpclient';
import { UserService } from './user.service';
import { CustomerAccountClass } from './models/CustomerAccount.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class CustomerAccountService {

  public CustomerAccountCache: CustomerAccountClass = null;
  public CustomerAccountObservable: Observable<CustomerAccountClass> = null;

  private initialized: boolean = null;
  private CustomerAccountsObservers: Observer<CustomerAccountClass>[] = [];
  private requestObservable: Observable<Response> = null;
  private _CustomerAccountId: string = null;

  constructor(
    private HttpClient: HttpClient,
    private UserService: UserService
  ) {

    // Make the Observables for others to listen to.
    this.CustomerAccountObservable = Observable.create((observer: Observer<CustomerAccountClass>) => {
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
      .catch(error => error);

    // Handle the new Billing account data.
    this.requestObservable.subscribe(
      data => this.CustomerAccountCache = new CustomerAccountClass(data),
      error => this.handleError(error),
      () => {
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.CustomerAccountsObservers, this.CustomerAccountCache);
      }
    );

    return this.requestObservable;

  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = get(body, 'error', JSON.stringify(body));
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

}
