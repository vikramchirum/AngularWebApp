/**
 * Created by vikram.chirumamilla on 6/19/2017.
 */

export interface IBillLineItem {
  description: string;
  amount: number;
  uom: string;
  Quantity: string;
  multiplier: number;
  min: number;
  max: number;
  billLineItemType: string;
  billLineItemSubType: string;
}
