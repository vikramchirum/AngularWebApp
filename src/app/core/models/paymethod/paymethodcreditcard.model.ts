/**
 * Created by vikram.chirumamilla on 7/28/2017.
 */

interface IPaymethodCreditCard {
  AccountNumber: string;
  AccountHolder: string;
  CreditCardType: string;
  ExpirationMonth: number;
  ExpirationYear: number;
  MaximumDraftAmount: number;
}
