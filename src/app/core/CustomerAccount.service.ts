
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { pull, forEach } from 'lodash';
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

    // TODO: get the user's customer id.
    // this.CustomerAccountId = this.UserService.CustomerAccountId;
    this.CustomerAccountId = '342802';

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

    // Start an initial call to the API.
    this.getCustomerAccount();

  }

  getCustomerAccount(): Observable<CustomerAccountClass> {

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
      .map((res: Response) => res.json())
      .subscribe(
        data => this.CustomerAccountCache = new CustomerAccountClass(data),
        error => {
          // TODO: handle errors.
          console.log({ error });
          return Observable.throw(error.statusText);
        },
        () => {

          // Start to emit to any and all observers collected since this request started.
          forEach(observersWhileRequesting, observer => {
            // Emit.
            observer.next(this.CustomerAccountCache);
            // Close.
            observer.complete();
          });

          // Emit the new data to all observers of the service's observable.
          forEach(this.CustomerAccountsObservers, observer => observer.next(this.CustomerAccountCache));

          // Destroy this requester.
          this.CustomerAccountRequester = null;

        }
      );

    // Return the observable to the observer who initialized this request.
    return this.CustomerAccountRequester;

  }

}
