
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { pull, forEach } from 'lodash';
import { BillingAccountClass } from './models/BillingAccount.model';
import { PaymentMethod } from './PaymentMethod';
import { HttpClient } from './httpclient';

@Injectable()
export class BillingAccountService {

  public ActiveBillingAccount: BillingAccountClass = null;
  public BillingAccounts: BillingAccountClass[] = null;
  public BillingAccountsObservable: Observable<BillingAccountClass[]> = null;

  private CustomerAccountId: string = null;
  private BillingAccountsObservers: Observer<any>[] = [];
  private BillingAccountsRequesting: boolean = null;

  constructor(
    private HttpClient: HttpClient
  ) {

    // TODO: get the user's customer id.
    // this.CustomerAccountId = this.UserService.CustomerAccountId;
    this.CustomerAccountId = '962786';

    // Make an Observable for others to listen to.
    this.BillingAccountsObservable = Observable.create((observer: Observer<any>) => {

      // We want to collect our observers for future emits.
      this.BillingAccountsObservers.push(observer);

      // There are no billing accounts and we are not requesting, so make a request.
      if (
        this.BillingAccounts === null
        && this.BillingAccountsRequesting === false
      ) {
        this.BillingAccountsUpdate();
      }

      // If we do have our billing accounts, send them to the new observer.
      if (this.BillingAccounts !== null) {
        observer.next(this.BillingAccounts);
      }

      // Provide the clean-up function to avoid memory leaks.
      // Find the observer and remove them from the collection.
      return () => pull(this.BillingAccountsObservers, observer);

    });

    this.BillingAccountsUpdate();

  }

  /**
   * Force the API lookup and then emit to all of our observers.
   * @returns {Observable<Response>}
   */
  BillingAccountsUpdate(): Observable<Response> {

    // Turn on the updating flag to prevent new observers from making new requests.
    this.BillingAccountsRequesting = true;

    const response = this.HttpClient.get(`/billing_accounts?search_option.customer_Account_Id=${this.CustomerAccountId}`)
      .map(data => data.json())
      .catch(error => error);

    response.subscribe(
      // Process our results into classes.
      data => {
        this.BillingAccountsProcessApiData(data);
        // Reset the updating flag - allow new API observers to request:
        this.BillingAccountsRequesting = false;
      },
      error => {
        // TODO: handle errors.
        console.log({ error });
        return Observable.throw(error.statusText);
      },
      // Emit our new data to all of our observers.
      () => {
        // If we're still requesting, that means we error'd out - so stop, reset and don't emit.
        if (this.BillingAccountsRequesting === true) {
          this.BillingAccountsRequesting = false;
          return;
        }
        this.BillingAccountsEmitToObservers();
      }
    );

    return response;

  }

  /**
   * Process provided JSON data into Billing Account classes.
   * @param jsonData
   * @constructor
   */
  BillingAccountsProcessApiData(jsonData): void {

    // Populate our new billing account collection with new billing account classes using our new data.
    const BillingAccounts: BillingAccountClass[] = [];
    forEach(jsonData, data => BillingAccounts.push(new BillingAccountClass(data)));

    // Update with the new billing accounts.
    this.BillingAccounts = BillingAccounts;

    // If there is no active billing account, or it is not included, then set a new active billing account.
    if (
      this.ActiveBillingAccount === null
      || this.BillingAccounts.indexOf(this.ActiveBillingAccount) < 0
    ) {
      this.ActiveBillingAccount = this.BillingAccounts.length > 0 ? this.BillingAccounts[0] : null;
    }

  }

  /**
   * Emit the current Billing Accounts to all observers.
   * @constructor
   */
  BillingAccountsEmitToObservers(): void {
    forEach(this.BillingAccountsObservers, observer => observer.next(this.BillingAccounts));
  }

  /**
   * Set the provided Billing Account's Auto Bill Pay setting to the provided Payment Method.
   * @param paymentMethod
   * @param billingAccount
   * @returns {Promise<void>}
   */
  applyNewAutoBillPay(paymentMethod: PaymentMethod, billingAccount: BillingAccountClass, value?: boolean): Promise<any> {

    // TODO: Interact with the API to make this change. Use the below temporarily.
    for (const index in this.BillingAccounts) {
      if (this.BillingAccounts[index]) {
        this.BillingAccounts[index].Enrolled_In_Auto_Bill_Pay = value === true;
        this.BillingAccountsEmitToObservers();
        break;
      }
    }

    return Promise.resolve();

  }

}
