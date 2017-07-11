
import { assign, get } from 'lodash';

export const CardBrands = {
  amex: 'American Express',
  'diners-club': 'Diners Club',
  discover: 'Discover',
  jcb: 'JCB',
  mastercard: 'Mastercard',
  paypal: 'PayPal',
  stripe: 'Stripe',
  visa: 'Visa'
};

export const CardFontAwesomeClasses = {
  amex: 'fa-cc-amex',
  'diners-club': 'fa-cc-diners-club',
  discover: 'fa-cc-discover',
  jcb: 'fa-cc-jcb',
  mastercard: 'fa-cc-mastercard',
  paypal: 'fa-cc-paypal',
  stripe: 'fa-cc-stripe',
  visa: 'fa-cc-visa'
};

export interface IPaymethod {
  PayMethodId: number;
  PaymethodName: string;
  PaymethodType: 'CreditCard' | 'eCheck';
  IsActive: boolean;
  Used_For_Auto_Pay: boolean;
  BankAccount: IPaymethodBankAccount;
  CreditCard: IPaymethodCreditCard;
}
interface IPaymethodBankAccount {
  AccountNumber: string;
  AccountHolder: string;
  AccountType: 'checking' | 'saving';
  RoutingNumber: string;
}
interface IPaymethodCreditCard {
  AccountNumber: string;
  AccountHolder: string;
  CreditCardType: string;
  ExpirationMonth: number;
  ExpirationYear: number;
  MaximumDraftAmount: number;
}

export interface IPaymethodRequest {
  account_holder: string;
  CreditCard?: IPaymethodRequestCreditCard;
  Echeck?: IPaymethodRequestEcheck;
}
export interface IPaymethodRequestCreditCard {
  card_number: string;
  expire_year: string;
  expire_month: string;
  cvv: string;
}
export interface IPaymethodRequestEcheck {
  account_number: string;
  account_type: string;
  routing_number: string;
  other_info?: string;
}

export class PaymethodClass implements IPaymethod {
  PayMethodId = null;
  PaymethodName = null;
  IsActive = null;
  Used_For_Auto_Pay = null;
  BankAccount = null;
  CreditCard = null;

  /**
   * Construct a new Payment_Method passing in values (opts) to use.
   * @param opts
   */
  constructor(opts) {
    assign(this, opts);
  }

  get PaymethodType(): 'CreditCard' | 'eCheck' {
    return get(this, 'CreditCard', null) !== null ? 'CreditCard' : 'eCheck';
  }

  /**
   * Returns the formatted brand name or none/eCheck.
   * @returns {string}
   */
  getBrand(): string {
    return this.PaymethodType === 'CreditCard'
      ? get(CardBrands, this.CreditCard.CreditCardType.toLowerCase(), 'Credit Card')
      : 'eCheck';
  }

  getExpiration(): string {
    return this.PaymethodType === 'CreditCard'
      ? `${this.CreditCard.ExpirationMonth} / ${this.CreditCard.ExpirationYear}`
      : '';
  }

  /**
   * Returns the Font Awesome tag or a general credit card icon.
   * @returns {string}
   */
  getFontAwesomeTag(): string {
    return this.PaymethodType === 'CreditCard'
      ? get(CardFontAwesomeClasses, this.CreditCard.CreditCardType.toLowerCase(), 'fa-credit-card')
      : 'fa-id-card-o';
  }

  getLast(): string {
    return this.PaymethodType === 'CreditCard'
      ? this.CreditCard.AccountNumber
      : this.BankAccount.AccountNumber;
  }

}
