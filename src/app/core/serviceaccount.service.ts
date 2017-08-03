
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { clone, find, first, forEach, get, isString, map, pull } from 'lodash';
import { HttpClient } from './httpclient';
import { UserService } from './user.service';
import { Paymethod } from './models/paymethod/Paymethod.model';
import { ServiceAccount } from './models/serviceaccount/serviceaccount.model';

@Injectable()
export class ServiceAccountService {

  public ActiveServiceAccountCache: ServiceAccount = null;
  public ActiveServiceAccountObservable: Observable<ServiceAccount> = null;
  public ServiceAccountsCache: ServiceAccount[] = null;
  public ServiceAccountsObservable: Observable<ServiceAccount[]> = null;

  private initialized: boolean = null;
  private ActiveServiceAccountObservers: Observer<any>[] = [];
  private ServiceAccountsObservers: Observer<any>[] = [];
  private requestObservable: Observable<Response> = null;
  private _CustomerAccountId: string = null;

  set ActiveServiceAccountId(ServiceAccountId: string) {
    localStorage.setItem('gexa_active_Service_account_id', ServiceAccountId);
  }
  get ActiveServiceAccountId(): string {
    return localStorage.getItem('gexa_active_Service_account_id');
  }

  constructor(private HttpClient: HttpClient, private UserService: UserService) {

    // Make Observables (Active Service Account and Service Accounts) for others to listen to.
    // 1. Collect, or 'push', new observers to the observable's collection.
    // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
    // 3. Provide the new observer a clean-up function to prevent memory leaks.
    this.ActiveServiceAccountObservable = Observable.create((observer: Observer<any>) => {
      this.ActiveServiceAccountObservers.push(observer);
      if (this.initialized) { observer.next(this.ActiveServiceAccountCache); }
      return () => pull(this.ActiveServiceAccountObservers, observer);
    });
    this.ServiceAccountsObservable = Observable.create((observer: Observer<any>) => {
      this.ServiceAccountsObservers.push(observer);
      if (this.initialized) { observer.next(this.ServiceAccountsCache); }
      return () => pull(this.ServiceAccountsObservers, observer);
    });

    // Console.log the latest active Service account.
    this.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => console.log('ActiveServiceAccount = ', ActiveServiceAccount)
    );

    // Respond to the first (initializing) call.
    this.ServiceAccountsObservable.first().delay(0).subscribe((result) => {
      this.initialized = true;
      if (this.ActiveServiceAccountId) {
        this.SetActiveServiceAccount(this.ActiveServiceAccountId);
      }  else {
        if (result.length === 1) {
          this.SetActiveServiceAccount(result[0].Id);
        }
      }
    });

    // Keep up-to-date with the user's Service accounts via the customer id.
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
      this.UpdateServiceAccounts();
    }
  }

  UpdateServiceAccounts(): Observable<Response> {

    // If we're already requesting then return the original request observable.
    if (this.requestObservable) { return this.requestObservable; }

    // If we don't have a Customer Account Id then return null;
    if (this.CustomerAccountId === null) { return Observable.from(null); }

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.HttpClient.get(`/Service_accounts?search_option.customer_Account_Id=${this.CustomerAccountId}`)
      .map(data => data.json())
      .map(data => map(data, ServiceAccountData => new ServiceAccount(ServiceAccountData)))
      .catch(error => error);

    // Handle the new Service account data.
    this.requestObservable.subscribe(
      ServiceAccounts => this.ServiceAccountsCache = <any>ServiceAccounts,
      error => this.HttpClient.handleHttpError(error),
      () => {
        console.log('ServiceAccounts =', this.ServiceAccountsCache);
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.ServiceAccountsObservers, this.ServiceAccountsCache);
      }
    );

    return this.requestObservable;

  }

  SetActiveServiceAccount(ServiceAccount: ServiceAccount | string): ServiceAccount {

    // Determine the provided (from string or object) Service account id.
    ServiceAccount = isString(ServiceAccount) ? ServiceAccount : get(ServiceAccount, 'Id', this.ActiveServiceAccountId);

    // If there is nothing to change then return.
    if (get(this.ActiveServiceAccountCache, 'Id') === ServiceAccount) { return this.ActiveServiceAccountCache; }

    // Find the specified Service account.
    let ActiveServiceAccount = find(this.ServiceAccountsCache, ['Id', ServiceAccount], null);

    // If no Service account was found then use the first one.
    if (ActiveServiceAccount === null) { ActiveServiceAccount = first(this.ServiceAccountsCache); }

    // Assign the newly active Service account.
    this.ActiveServiceAccountCache = ActiveServiceAccount;
    if (this.ActiveServiceAccountCache) { this.ActiveServiceAccountId = this.ActiveServiceAccountCache.Id; }

    this.ActiveServiceAccountCache = this.SetIsUpFOrRenewalFlag(this.ActiveServiceAccountCache);

    // Emit our new data to all of our observers.
    this.emitToObservers(this.ActiveServiceAccountObservers, this.ActiveServiceAccountCache);

    return this.ActiveServiceAccountCache;

  }

  SetIsUpFOrRenewalFlag(ActiveServiceAccount: ServiceAccount): ServiceAccount {
    const Start_Date = ActiveServiceAccount.Contract_Start_Date;
    const End_Date =  ActiveServiceAccount.Contract_End_Date;
    const Term = ActiveServiceAccount.Current_Offer.Term;

    const startDate = new Date(Start_Date);
    const currentDate = new Date(Date.now());
    let req90Day: Date;

    if (End_Date === null) {
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 12 ));
      console.log('End date', endDate);
      req90Day = new Date(new Date(new Date(startDate).setMonth(startDate.getMonth() + 12 ))
        .setDate(new Date(new Date(startDate).setMonth(startDate.getMonth() + 12 )).getDate() - 90 ));
      console.log('End date null mark', req90Day);
    } else {

      const end_Date = new Date(End_Date);
      console.log('End date', end_Date);
      req90Day = new Date(end_Date.setDate(end_Date.getDate() - 90));
      console.log('End date null mark', req90Day);
    }

    ActiveServiceAccount.IsUpForRenewal = currentDate > req90Day;

    return ActiveServiceAccount;
  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

  RemoveAutoPaymentConfig(autoPaymentConfigId: number): void {
    forEach(this.ServiceAccountsCache, ServiceAccount => {
      if (ServiceAccount.AutoPayConfigId === autoPaymentConfigId) {
        ServiceAccount.AutoPayConfigId = null;
        ServiceAccount.Is_Auto_Bill_Pay = false;
        ServiceAccount.PayMethodId = null;
      }
    });
  }

  UpdateAutoPaymentConfig(autoPaymentConfigId: number, PaymethodId: number): void {
    forEach(this.ServiceAccountsCache, ServiceAccount => {
      if (ServiceAccount.AutoPayConfigId === autoPaymentConfigId) {
        ServiceAccount.PayMethodId = PaymethodId;
      }
    });
  }
}
