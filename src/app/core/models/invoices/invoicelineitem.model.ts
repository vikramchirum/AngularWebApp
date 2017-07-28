/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */

export interface IInvoiceLineItem {
  Descripton: string;
  Amount: number;
  UOM: string;
  Quantity: string;
  Multiplier: number;
  Min: number;
  Max: number;
  Bill_Line_Item_Type: string;
  Bill_Line_Item_Sub_Type: string;
}
