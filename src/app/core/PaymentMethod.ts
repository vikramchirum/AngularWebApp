
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import MockData from './PaymentMethod.mock-data.json';

export class PaymentMethod {
  Id: string;
  Card_Type: string;
  Card_Brand: string;
  Card_Last: string;
  Card_Name: string;

  /**
   * Construct a new Payment_Method passing in values (opts) to use.
   * @param opts
   */
  constructor(opts) {
    for (const key in opts) {
      if (opts[key] !== undefined) {
        this[key] = opts[key];
      }
    }
  }

}

@Injectable()
export class PaymentMethodService {

  public PaymentMethods: PaymentMethod[] = null;
  private CurrentPaymentMethod: PaymentMethod = null;
  private PaymentMethodUrl = 'api/Payment_Method';

  constructor(
    private http: Http
  ) { }

  /**
   * Returns the current payment method and sets it if it is not already set.
   * @returns {PaymentMethod}
   */
  getCurrentPaymentMethod(): Promise<PaymentMethod> {

    // Reset the current bill.
    this.CurrentPaymentMethod = null;

    // Set the current payment method, getting the payment method if we haven't already.
    return this.getPaymentMethods()
      .then((PaymentMethods: PaymentMethod[]) => this.CurrentPaymentMethod = PaymentMethods[0])
      .catch(error => this.handleError(error))
      .then(() => this.CurrentPaymentMethod);
  }

  /**
   * Returns the array of billing accounts and requests them if they have not been already requested.
   * @returns {Promise<PaymentMethod[]>}
   */
  getPaymentMethods(): Promise<PaymentMethod[]> {

    // If we have the payment methods, return them:
    // To-do Maybe look them up again?
    if (this.PaymentMethods !== null) { return Promise.resolve(this.PaymentMethods); }

    // If we did not have them, look them up:
    return Promise.resolve(MockData)
      .then(data => this.processApiData(data))
      .catch(error => this.handleError(error));
    // return this.http.get(this.PaymentMethodUrl)
    //   .toPromise()
    //   .then(response => response.json().data)
    //   .then(data => this.processApiData(data))
    //   .catch(error => this.handleError(error));

  }

  /**
   * Returns the identified payment method and requests it if it has not already been requested.
   * @param id
   * @returns {Promise<PaymentMethod>}
   */
  getPaymentMethod(Id: string): Promise<PaymentMethod> {

    // If we have not gotten the payment methods, get them and return the specified:
    if (this.PaymentMethods === null) {
      return this.getPaymentMethods()
        .then(() => this.getPaymentMethod(Id));
    }

    // We have the payment methods, so find the one with the matching Id and then return it:
    for (const index in this.PaymentMethods) {
      if (
        this.PaymentMethods[index]
        && this.PaymentMethods[index].Id === Id
      ) {
        return Promise.resolve(this.PaymentMethods[index]);
      }
    }

    // Otherwise no payment method was found, return null:
    return Promise.reject(null);

  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private processApiData(data: PaymentMethod[]) {

    // Reset the current payment methods:
    this.PaymentMethods = [];

    // Add new payment methods applying the provided data:
    for (const index in data) {
      if (data[index]) {
        this.PaymentMethods.push(new PaymentMethod(data[index]));
      }
    }

    // Return all of what we added:
    return this.PaymentMethods;

  }

}
