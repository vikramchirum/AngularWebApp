/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */

export interface IBill {
  invoiceDate: string;
  charges: number;
  balance: number;
  credit: number;
  billType: string;
  invoice_id: number;
}
