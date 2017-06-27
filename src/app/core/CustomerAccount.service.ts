
import { Injectable } from '@angular/core';

import { clone, find, forEach, get, pull } from 'lodash';
import { HttpClient } from './httpclient';
import { UserService } from './user.service';
import { CustomerAccountClass } from './models/CustomerAccount.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class CustomerAccountService {

  public CustomerAccountCache: CustomerAccountClass = null;
  public CustomerAccountObservable: Observable<CustomerAccountClass> = null;

  private CustomerAccountId: string = null;
  private CustomerAccountsObservers: Observer<CustomerAccountClass>[] = [];
  private CustomerAccountRequester: Observable<CustomerAccountClass> = null;

  constructor(
    private HttpClient: HttpClient,
    private UserService: UserService
  ) {

    // Make an Observable for others to listen to.
    this.CustomerAccountObservable = Observable.create((observer: Observer<CustomerAccountClass>) => {

      // We want to collect our observers for future emits.
      this.CustomerAccountsObservers.push(observer);

      // If we do have our customer account then send it to the new observer, otherwise make a request.
      if (this.CustomerAccountCache !== null) {
        observer.next(this.CustomerAccountCache);
      } else {
        this.getCustomerAccount();
      }

      // Provide the clean-up function to avoid memory leaks.
      // Find the observer and remove them from the collection.
      return () => pull(this.CustomerAccountsObservers, observer);

    });

    // Keep the customer account id synced.
    this.UserService.UserObservable.subscribe(user => {
      console.log(user);

      const customer_account = find(get(user, 'Account_permissions', []), { AccountType: 'Customer_Account_Id'});

      // If we have a customer account then try and update our id, otherwise reset and emit.
      if (customer_account) {
        // Update only if the account id has changed.
        if (this.CustomerAccountId !== customer_account.AccountNumber) {
          this.CustomerAccountId = customer_account.AccountNumber;
          this.getCustomerAccount();
        }
      } else {
        this.CustomerAccountId = null;
        this.emitToObservers(this.CustomerAccountsObservers, this.CustomerAccountCache);
      }

    });

  }

  getCustomerAccount(): Observable<CustomerAccountClass> {

    // If we don't have an Id to lookup, skip.
    if (!this.CustomerAccountId) { return; }

    // If we're already requesting, return the original request.
    if (this.CustomerAccountRequester) {
      return this.CustomerAccountRequester;
    }

    // We want to keep a collection of those who subscribe while we request.
    const observersWhileRequesting: Observer<CustomerAccountClass>[] = [];

    // Make an Observable we can use to collect interested observers and to then publish to.
    this.CustomerAccountRequester = Observable.create((observer: Observer<CustomerAccountClass>) => {

      // We want to collect our observers to emit to after the HTTP request.
      observersWhileRequesting.push(observer);

      // Provide the clean-up function to avoid memory leaks.
      // Find the observer and remove them from the collection.
      return () => pull(observersWhileRequesting, observer);

    });

    // Make the request.
    this.HttpClient.get(`/customer_accounts/${this.CustomerAccountId}`)
      .map(res => res.json())
      .subscribe(
        data => this.CustomerAccountCache = new CustomerAccountClass(data),
        error => {
          // TODO: handle errors.
          console.log({ error });
          return Observable.throw(error.statusText);
        },
        () => {
          // Start to emit to any and all observers collected since this request started.
          forEach(clone(observersWhileRequesting), observer => {
            // Emit.
            observer.next(this.CustomerAccountCache);
            // Close.
            observer.complete();
          });

          this.emitToObservers(this.CustomerAccountsObservers, this.CustomerAccountCache);

          // Destroy this requester.
          this.CustomerAccountRequester = null;

        }
      );

    // Return the observable to the observer who initialized this request.
    return this.CustomerAccountRequester;

  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

}
