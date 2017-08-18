
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { clone, find, first, forEach, get, isString, map, pull } from 'lodash';
import { HttpClient } from './httpclient';
import { UserService } from './user.service';
import {ServiceAccount} from './models/serviceaccount/serviceaccount.model';
import {RenewalService} from './renewal.service';
import {IRenewalDetails} from './models/renewals/renewaldetails.model';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class ServiceAccountService {

  public ActiveServiceAccountCache: ServiceAccount = null;
  public ActiveServiceAccountObservable: Observable<ServiceAccount> = null;
  public ServiceAccountsCache: ServiceAccount[] = null;
  public ServiceAccountsObservable: Observable<ServiceAccount[]> = null;

  public ActiveServiceAccount_RenewalDetailsObservable: Observable<IRenewalDetails> = null;
  public ActiveServiceAccount_RenewalDetailsCache: IRenewalDetails = null;
  private ActiveServiceAccount_RenewalDetailsObservers: Observer<any>[]= [];
  public ActiveServiceAccount_RenewalDetails_Subscription: Subscription;

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

  constructor(private HttpClient: HttpClient, private UserService: UserService, private RenewalService: RenewalService) {

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
        // this.SetIsOnRenewalFlag(this.ActiveServiceAccountId);
        this.SetActiveServiceAccount(this.ActiveServiceAccountId);
      } else {
        if (result.length === 1) {
          // this.SetIsOnRenewalFlag(result[0].Id);
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
    // else {
    //   this.SetIsOnRenewalFlag(this.ActiveServiceAccountId);
    // }

    // Assign the newly active Service account.
    this.ActiveServiceAccountCache = ActiveServiceAccount;
    if (this.ActiveServiceAccountCache) { this.ActiveServiceAccountId = this.ActiveServiceAccountCache.Id; }

    this.ActiveServiceAccountCache = this.SetFlags(this.ActiveServiceAccountCache);

    // Emit our new data to all of our observers.
    this.emitToObservers(this.ActiveServiceAccountObservers, this.ActiveServiceAccountCache);

    return this.ActiveServiceAccountCache;

  }

  SetFlags(ServiceAccount: ServiceAccount): ServiceAccount {
    const currentDate = new Date();
    // End dates should not be null - for dev purposes, handle null dates:
    const endDate = ServiceAccount.Contract_End_Date === null
      // If no end date, take the current offer's term and add it.
      ? new Date(new Date(ServiceAccount.Contract_Start_Date).setMonth(new Date(ServiceAccount.Contract_Start_Date).getMonth() + Number(ServiceAccount.Current_Offer.Term)))
      // Otherwise, use the provided date.
      : new Date(ServiceAccount.Contract_End_Date);


    // // Set calculated end date
     ServiceAccount.Calculated_Contract_End_Date = endDate;

    // Determine if the service account is on hold over using its' current offer.

    // if (this.ActiveServiceAccount_RenewalDetailsCache) { ServiceAccount.IsUpForRenewal = this.ActiveServiceAccount_RenewalDetailsCache.Is_Account_Eligible_Renewal;
    //   console.log('ServiceAccounts renewal is set' );
    // } else {
    //   this.ActiveServiceAccount_RenewalDetailsObservable.subscribe(
    //     RenewalDetails => {
    //       ServiceAccount.IsUpForRenewal = RenewalDetails.Is_Account_Eligible_Renewal;
    //       console.log('ServiceAccounts renewal is set');
    //     });
    // }
    //
    ServiceAccount.IsOnHoldOver = ServiceAccount.Current_Offer.IsHoldOverRate;
    return  ServiceAccount;
  }

  SetIsOnRenewalFlag(AServiceAccountId: string): Observable<IRenewalDetails> {
    if (this.ActiveServiceAccount_RenewalDetailsObservable) { return this.ActiveServiceAccount_RenewalDetailsObservable; }
    this.ActiveServiceAccount_RenewalDetailsObservable = this.RenewalService.getRenewalDetails(Number(AServiceAccountId));
    this.ActiveServiceAccount_RenewalDetailsObservable.subscribe(
      RenewalDetails => this.ActiveServiceAccount_RenewalDetailsCache = <any>RenewalDetails,
      error => this.HttpClient.handleHttpError(error),
      () => {
        console.log('ServiceAccount_Renewaldetails =', this.ActiveServiceAccount_RenewalDetailsCache);
        // We're no longer requesting.
        this.ActiveServiceAccount_RenewalDetailsObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.ActiveServiceAccount_RenewalDetailsObservers, this.ActiveServiceAccount_RenewalDetailsCache );
      }
    );
    return this.ActiveServiceAccount_RenewalDetailsObservable;
  }

  OnUpgradeOrRenew(choice: string) {
    if (choice === 'Renewal') {
      this.ActiveServiceAccountObservable.subscribe(
        ActiveServiceAccount => {
          ActiveServiceAccount.IsRenewed = true;
          console.log('Renewed');
        }
      );
    } else if (choice === 'Upgrade') {
      this.ActiveServiceAccountObservable.subscribe(
        ActiveServiceAccount => {
          ActiveServiceAccount.IsUpgraded = true;
          console.log('Upgraded');
        }
      );
    }
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
