/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */

export interface IBill {
  invoice_date: Date;
  usage: string;
  due_date: Date;
  charges: number;
  balance: number;
  credit: number;
  total: number;
  invoice_id: number;
}
