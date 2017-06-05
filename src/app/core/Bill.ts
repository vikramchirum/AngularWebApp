
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import MockData from './Bill.mock-data.json';

interface IBillCharges {
  title: string;
  items: any[];
}

export class Bill {
  Id: string;
  balance_forward: number;
  date_due: string;
  invoice_number: string;
  charges: IBillCharges[];

  /**
   * Calculate the total of a charge's items.
   * @param charge
   * @returns {number}
   */
  static subtotal(charge: any) {
    let subtotal = 0;
    for (const item in charge.items) {
      if (typeof charge.items[item].amount === 'number') {
        subtotal += charge.items[item].amount;
      }
    }
    return subtotal;
  }

  /**
   * Construct a new Bill passing in values (opts) to use.
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
   * Calculate the total of a our charges.
   * @param bill
   * @returns {number}
   */
  total(): number {
    let total = 0;
    for (const charge in this.charges) {
      if (this.charges[charge]) { total += Bill.subtotal(this.charges[charge]); }
    }
    return total;
  }

  /**
   * Return back the total amount of current charges with any forward balances.
   * @returns {number}
   */
  current_charges(): number {
    return this.total() + this.balance_forward;
  }

}

@Injectable()
export class BillService {

  public Bills: Bill[] = null;
  private CurrentBill: Bill = null;
  private BillsUrl = 'api/bills';

  constructor(
    private http: Http
  ) {}

  /**
   * Returns the current bill and sets it if it is not already set.
   * @returns {BillingAccount}
   */
  getCurrentBill(): Promise<Bill> {

    // Reset the current bill.
    this.CurrentBill = null;

    // Set the current bill, getting the bills if we haven't already.
    return this.getBills()
      .then((Bills: Bill[]) => this.CurrentBill = Bills[0])
      .catch(error => this.handleError(error))
      .then(() => this.CurrentBill);
  }

  /**
   * Returns the array of bills and requests them if they have not been already requested.
   * @returns {Promise<Bill[]>}
   */
  getBills(): Promise<Bill[]> {

    // If we have the Bills, return them:
    // To-do Maybe look them up again?
    if (this.Bills !== null) { return Promise.resolve(this.Bills); }

    // If we did not have them, look them up:
    return Promise.resolve(MockData)
      .then(data => this.processApiData(data))
      .catch(error => this.handleError(error));
    // return this.http.get(this.BillsUrl)
    //   .toPromise()
    //   .then(response => response.json().data)
    //   .then(data => this.processApiData(data))
    //   .catch(error => this.handleError(error));

  }

  /**
   * Returns the identified bill and requests if if it has not already been requested.
   * @param id
   * @returns {Promise<Bill>}
   */
  getBill(Id: string): Promise<Bill> {

    // If we have not gotten the bills, get them and return the specified:
    if (this.Bills === null) {
      return this.getBills()
        .then(() => this.getBill(Id));
    }

    // We have the bills, so find the one with the matching Id and then return it:
    for (const index in this.Bills) {
      if (
        this.Bills[index]
        && this.Bills[index].Id === Id
      ) {
        return Promise.resolve(this.Bills[index]);
      }
    }

    // Otherwise no bill was found, return null:
    return Promise.reject(null);

  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private processApiData(data: Bill[]) {

    // Reset the current bills:
    this.Bills = [];

    // Add new bills applying the provided data:
    for (const index in data) {
      if (data[index]) {
        this.Bills.push(new Bill(data[index]));
      }
    }

    // Return all of what we added:
    return this.Bills;

  }

}
