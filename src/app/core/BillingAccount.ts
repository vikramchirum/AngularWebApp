
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import { environment } from 'environments/environment';

interface IBillingAccountAddress {
  Line1: string;
  Line2: string;
  City: string;
  State: string;
  Zip: string;
  Zip_4: string;
}
interface IBillingAccountPlanHistory {
  StartDate: string;
  StopDate: string;
  CSP_Status: string;
  Offer: [ IBillingAccountPlanHistoryOffer ];
  OfferingName: string;
}
interface IBillingAccountPlanHistoryOffer {
  Rate_Code: string;
  Client_Key: string;
  Promotion_Name: string;
  Promotion_Code: string;
  Product_Name: string;
  Product_Description: string;
  RateAt500kwh: number;
  RateAt1000kwh: number;
  RateAt2000kwh: number;
  Term: number;
  TDU_Name: string;
  TDU_DUNS_Number: string;
  Meter_Charge: number;
  Delivery_Charge: number;
  Early_Termination_Fee: number;
  Base_Charge: number;
  Energy_Charges: [ IBillingAccountPlanHistoryOfferCharge ];
  Usage_Credits: [ IBillingAccountPlanHistoryOfferCharge ];
  Usage_Charges: [ IBillingAccountPlanHistoryOfferCharge ];
  Start_Date: string;
  End_Date: string;
}
interface IBillingAccountPlanHistoryOfferCharge {
  Min: number;
  Max: number;
  Amount: number;
}

export class BillingAccount {
  Entity_id: string;
  Id: string;
  Past_Due: number;
  Current_Due: number;
  UAN: string;
  TDU_Name: string;
  TDU_DUNS_Number: string;
  Service_Address: IBillingAccountAddress;
  Mailing_Address: IBillingAccountAddress;
  Paperless_Billing: boolean;
  Budget_Billing: boolean;
  Service_Stop_Request_date: string;
  Status_Id: number;
  Status: string;
  Terminate_Switch: boolean;
  Switch_Hold: boolean;
  Contract_Start_Date: string;
  Contract_End_Date: string;
  Last_payment_amount: number;
  Last_payment_date: string;
  Plan_History: [ IBillingAccountPlanHistory ];

  /**
   * Construct a new Billing_Account passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    for (const key in opts) {
      if (opts[key] !== undefined) {
        this[key] = opts[key];
      }
    }
  }

  /**
   * Returns back a formatted string of either the 'Service_Address' or 'Mailing_Address'.
   * @param type
   * @returns {string | null}
   */
  addressString(type: string): string {

    if (
      type === 'Service_Address'
      || type === 'Mailing_Address'
    ) {
      return [
        this[type].Line1,
        this[type].Line2 && this[type].Line2 !== '' ? ' ' + this[type].Line2 : '',
        ', ',
        this[type].City,
        ', ',
        this[type].State,
        ' ',
        this[type].Zip,
        this[type].Zip_4 && this[type].Zip_4 !== '' ? '-' + this[type].Zip_4 : ''
      ].join('');
    }

    return null;

  }

  /**
   * Returns back the formatted string of the 'Service_Address'.
   * @returns {string}
   */
  serviceAddressString(): string {
    return this.addressString('Service_Address');
  }

  /**
   * Returns back the formatted string of the 'Mailing_Address'.
   * @returns {string}
   */
  mailingAddressString(): string {
    return this.addressString('Mailing_Address');
  }

}

@Injectable()
export class BillingAccountService {

  public ActiveBillingAccount: BillingAccount = null;
  public BillingAccounts: BillingAccount[] = null;
  public BillingAccountsObservable: Observable<BillingAccount[]> = null;

  private BillingAccountsSubscribers: Subscriber<any>[] = [];
  private BillingAccountsRequesting: boolean = null;
  private BillingAccountsRetries: number = null;

  constructor(
    private Http: Http
  ) {

    // Make an Observable for others to listen to.
    this.BillingAccountsObservable = Observable.create((subscriber: Subscriber<any>) => {

      // We want to collect our subscribers for future emits.
      this.BillingAccountsSubscribers.push(subscriber);

      // There are no billing accounts and we are not requesting, so make a request.
      if (
        this.BillingAccounts === null
        && this.BillingAccountsRequesting === false
      ) {
        this.BillingAccountsUpdate();
      }

      // If we do have our billing accounts, send them to the new subscriber.
      if (this.BillingAccounts !== null) {
        subscriber.next(this.BillingAccounts);
      }

      // Provide the clean-up function to avoid memory leaks.
      // Find the subscriber and remove them from the collection.
      return () => {
        const length = this.BillingAccountsSubscribers.length;
        for (let index = 0; index < length; index++) {
          if (this.BillingAccountsSubscribers[index] === subscriber) {
            this.BillingAccountsSubscribers.splice(index, 1);
            break;
          }
        }
      };

    });

    this.BillingAccountsUpdate();

  }

  /**
   * Force the API lookup and then emit to all of our subscribers.
   * @returns {Observable<Response>}
   */
  BillingAccountsUpdate(): Observable<Response> {

    // Turn on the updating flag to prevent new subscribers from making new requests.
    this.BillingAccountsRequesting = true;

    const response = this.Http.get(`${environment.Api_Url}/billing_accounts?search_option.customer_Account_Id=962786`)
      .map(data => data.json())
      .catch(error => error);

    response.subscribe(
      // Process our results into classes.
      data => {
        // Populate our new billing account collection with new billing account classes using our new data.
        const BillingAccounts: BillingAccount[] = [];
        for (const index in data) {
          if (data[index]) {
            BillingAccounts.push(new BillingAccount(data[index]));
          }
        }
        // Update with the new billing accounts.
        this.BillingAccounts = BillingAccounts;
        // If there is no active billing account, or it is not included, then set a new active billing account.
        if (
          this.ActiveBillingAccount === null
          || this.BillingAccounts.indexOf(this.ActiveBillingAccount) < 0
        ) {
          this.ActiveBillingAccount = this.BillingAccounts.length > 0 ? this.BillingAccounts[0] : null;
        }
        // Reset the retries:
        this.BillingAccountsRetries = 0;
        // Reset the updating flag - allow new API subscribers to request:
        this.BillingAccountsRequesting = false;
      },
      // TODO: handle errors.
      error => {
        if (this.BillingAccountsRetries >= 5) {
          alert(`Error with ${environment.Api_Url}/billing_accounts\nToo many retries... please check the console.\n`);
        } else {
          this.BillingAccountsRetries++;
          console.log(`Error with ${environment.Api_Url}/billing_accounts\nTrying again (${this.BillingAccountsRetries}/5) in 5 seconds...\n`, error);
          setTimeout(() => this.BillingAccountsUpdate(), 5000);
        }
      },
      // Emit our new data to all of our subscribers.
      () => {
        // If we're still requesting, that means we error'd out - so stop, reset and don't emit.
        if (this.BillingAccountsRequesting === true) {
          this.BillingAccountsRequesting = false;
          return;
        }
        for (const index in this.BillingAccountsSubscribers) {
          if (this.BillingAccountsSubscribers[index]) {
            this.BillingAccountsSubscribers[index].next(this.BillingAccounts);
          }
        }
      }
    );

    return response;

  }

}
