/**
 * Created by vikram.chirumamilla on 7/28/2017.
 */

interface IPaymethodBankAccount {
  AccountNumber: string;
  AccountHolder: string;
  AccountType: 'checking' | 'saving';
  RoutingNumber: string;
}
