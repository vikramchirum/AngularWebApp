
import { assign, get } from 'lodash';
import {CardBrands, CardFontAwesomeClasses} from './constants';

export interface IPaymethod {
  PayMethodId: number;
  PaymethodName: string;
  PaymethodType: 'CreditCard' | 'eCheck';
  IsActive: boolean;
  Used_For_Auto_Pay: boolean;
  BankAccount: IPaymethodBankAccount;
  CreditCard: IPaymethodCreditCard;
}

export class Paymethod implements IPaymethod {
  PayMethodId = null;
  PaymethodName = null;
  IsActive = null;
  Used_For_Auto_Pay = null;
  BankAccount = null;
  CreditCard = null;

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
