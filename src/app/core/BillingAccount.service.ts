
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { clone, find, first, forEach, get, isString, map, pull } from 'lodash';
import { BillingAccountClass } from './models/BillingAccount.model';
import { PaymentMethod } from './PaymentMethod';
import { HttpClient } from './httpclient';
import { UserService } from './user.service';

@Injectable()
export class BillingAccountService {

  public ActiveBillingAccountCache: BillingAccountClass = null;
  public ActiveBillingAccountObservable: Observable<BillingAccountClass> = null;
  public BillingAccountsCache: BillingAccountClass[] = null;
  public BillingAccountsObservable: Observable<BillingAccountClass[]> = null;
  public IsActiveBillingAccountUpForRenewalCache: boolean = null;
  public IsActiveBillingAccountUpForRenewalObservable: Observable<boolean> = null;

  private initialized: boolean = null;
  private CustomerAccountId: string = null;
  private ActiveBillingAccountObservers: Observer<any>[] = [];
  private BillingAccountsObservers: Observer<any>[] = [];
  private requestObservable: Observable<Response> = null;

  set ActiveBillingAccountId(BillingAccountId: string) {
    localStorage.setItem('gexa_active_billing_account_id', BillingAccountId);
  }
  get ActiveBillingAccountId(): string {
    return localStorage.getItem('gexa_active_billing_account_id');
  }

  constructor(
    private HttpClient: HttpClient,
    private UserService: UserService
  ) {

    // Make Observables (Active Billing Account and Billing Accounts) for others to listen to.
    // 1. Collect, or 'push', new observers to the observable's collection.
    // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
    // 3. Provide the new observer a clean-up function to prevent memory leaks.
    this.ActiveBillingAccountObservable = Observable.create((observer: Observer<any>) => {
      this.ActiveBillingAccountObservers.push(observer);
      if (this.initialized) { observer.next(this.ActiveBillingAccountCache); }
      return () => pull(this.ActiveBillingAccountObservers, observer);
    });
    this.BillingAccountsObservable = Observable.create((observer: Observer<any>) => {
      this.BillingAccountsObservers.push(observer);
      if (this.initialized) { observer.next(this.BillingAccountsCache); }
      return () => pull(this.BillingAccountsObservers, observer);
    });


    // Respond to the first (initializing) call.
    this.BillingAccountsObservable.first().delay(0).subscribe(() => {
      this.initialized = true;
      if (this.ActiveBillingAccountId) { this.SetActiveBillingAccount(this.ActiveBillingAccountId); }
    });

    // Keep up-to-date with the user's billing accounts via the customer id.
    this.UserService.UserCustomerAccountObservable.subscribe(CustomerAccountId => {
      if (this.CustomerAccountId !== CustomerAccountId) {
        this.CustomerAccountId = CustomerAccountId;
        this.UpdateBillingAccounts();
      }
    });

  }

  UpdateBillingAccounts(): Observable<Response> {

    // If we're already requesting then return the original request observable.
    if (this.requestObservable) { return this.requestObservable; }

    // If we don't have a Customer Account Id then return null;
    if (this.CustomerAccountId === null) { return Observable.from(null); }

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.HttpClient.get(`/billing_accounts?search_option.customer_Account_Id=${this.CustomerAccountId}`)
      .map(data => data.json())
      .map(data => map(data, BillingAccountData => new BillingAccountClass(BillingAccountData)))
      .catch(error => error);

    // Handle the new Billing account data.
    this.requestObservable.subscribe(
      BillingAccounts => this.BillingAccountsCache = <any>BillingAccounts,
      error => this.handleError(error),
      () => {
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.BillingAccountsObservers, this.BillingAccountsCache);
      }
    );

    return this.requestObservable;

  }

  SetActiveBillingAccount(BillingAccount: BillingAccountClass | string): BillingAccountClass {

    // Determine the provided (from string or object) billing account id.
    BillingAccount = isString(BillingAccount) ? BillingAccount : get(BillingAccount, 'Id', this.ActiveBillingAccountId);

    // If there is nothing to change then return.
    if (get(this.ActiveBillingAccountCache, 'Id') === BillingAccount) { return this.ActiveBillingAccountCache; }

    // Find the specified billing account.
    let ActiveBillingAccount = find(this.BillingAccountsCache, ['Id', BillingAccount], null);

    // If no billing account was found then use the first one.
    if (ActiveBillingAccount === null) { ActiveBillingAccount = first(this.BillingAccountsCache); }

    // Assign the newly active billing account.
    this.ActiveBillingAccountCache = ActiveBillingAccount;
    if (this.ActiveBillingAccountCache) { this.ActiveBillingAccountId = this.ActiveBillingAccountCache.Id; }

    this.ActiveBillingAccountCache = this.SetIsUpFOrRenewalFlag(this.ActiveBillingAccountCache);

    // Emit our new data to all of our observers.
    this.emitToObservers(this.ActiveBillingAccountObservers, this.ActiveBillingAccountCache);

    return this.ActiveBillingAccountCache;

  }

  SetIsUpFOrRenewalFlag(ActiveBillingAccount: BillingAccountClass): BillingAccountClass {
    const Start_Date = ActiveBillingAccount.Current_Offer.Start_Date;
    const End_Date =  ActiveBillingAccount.Current_Offer.End_Date;
    const Term = ActiveBillingAccount.Current_Offer.Term;

    const startDate = new Date(Start_Date);
    const currentDate = new Date(Date.now());
    var req90Day: Date;

    if (End_Date === null) {
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 12 ));
      req90Day = new Date(new Date(new Date(startDate).setMonth(startDate.getMonth() + 12 ))
        .setDate(new Date(new Date(startDate).setMonth(startDate.getMonth() + 12 )).getDate() - 90 ));
      console.log('End date null mark', req90Day);
    } else {
      req90Day = new Date(End_Date);
      console.log('End date not null mark', req90Day);
    }
    if ( currentDate > req90Day) {
      ActiveBillingAccount.IsUpForRenewal = true;
    } else {
      ActiveBillingAccount.IsUpForRenewal = false;
    }
    return ActiveBillingAccount;
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

  /**
   * Set the provided Billing Account's Auto Bill Pay setting to the provided Payment Method.
   * @param paymentMethod
   * @param billingAccount
   * @param value
   * @returns {Promise<void>}
   */
  applyNewAutoBillPay(paymentMethod: PaymentMethod, billingAccount: BillingAccountClass, value?: boolean): Promise<any> {

    // TODO: Interact with the API to make this change. Use the below temporarily.
    for (const index in this.BillingAccountsCache) {
      if (this.BillingAccountsCache[index]) {
        this.BillingAccountsCache[index].Enrolled_In_Auto_Bill_Pay = value === true;
        this.emitToObservers(this.BillingAccountsObservers, this.BillingAccountsCache);
        break;
      }
    }

    return Promise.resolve();

  }

}
