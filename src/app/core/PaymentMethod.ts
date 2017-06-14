
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import MockData from './PaymentMethod.mock-data.json';
import { BillingAccount } from './BillingAccount';

export class PaymentMethod {
  Id: string;
  Card_Type: string;
  Card_Brand: string;
  Card_Expires: string;
  Card_Last: string;
  Card_Name: string;
  Used_For_Auto_Pay: boolean;

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

  /**
   * Returns the formatted brand name or none.
   * @returns {string}
   */
  getBrand(): string {
    switch (this.Card_Brand) {
      case 'amex': return 'Amex';
      case 'diners-club': return 'Diners Club';
      case 'discover': return 'Discover';
      case 'jcb': return 'JCB';
      case 'mastercard': return 'Mastercard';
      case 'paypal': return 'PayPal';
      case 'stripe': return 'Stripe';
      case 'visa': return 'Visa';
    }
    return '???';
  }

  /**
   * Returns the Font Awesome tag or a general credit card icon.
   * @returns {string}
   */
  getFontAwesomeTag(): string {
    switch (this.Card_Brand) {
      case 'amex': return 'fa-cc-amex';
      case 'diners-club': return 'fa-cc-diners-club';
      case 'discover': return 'fa-cc-discover';
      case 'jcb': return 'fa-cc-jcb';
      case 'mastercard': return 'fa-cc-mastercard';
      case 'paypal': return 'fa-cc-paypal';
      case 'stripe': return 'fa-cc-stripe';
      case 'visa': return 'fa-cc-visa';
    }
    return 'fa-credit-card';
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

  applyNewAutoBillPay(paymentMethod: PaymentMethod, billingAccount: BillingAccount): Promise<any> {
    // TODO: Interact with the API to make this change.
    return Promise.resolve();
  }

  /**
   * Loops through the payment methods removing those with matching Id values.
   * @param Id
   * @returns {Promise<PaymentMethod[]>}
   */
  deletePaymentMethod(Id: string): Promise<PaymentMethod[]> {

    // Use the gotten payment methods, otherwise get them.
    return this.getPaymentMethods()
    // Start removing matching payment methods.
      .then(() => {
        // Cache the length of payment methods.
        const length = this.PaymentMethods.length;
        for (let index = 0; index < length; index++) {
          // If the valid payment method's Id matches...
          if (
            this.PaymentMethods[index]
            && this.PaymentMethods[index].Id === Id
          ) {
            // ... then remove the payment method from the array.
            this.PaymentMethods.splice(index, 1);
            // TODO: call out to the API to delete here.
          }
        }
        // Return back the current array of payment methods for anyone asking.
        return this.PaymentMethods;
      })
      .catch((error) => this.handleError(error));

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
