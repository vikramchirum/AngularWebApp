import { assign, isString } from 'lodash';

export class PaymentsHistory {
  Payment_Date: Date;
  Payment_Source: string;
  Payment_Type: string;
  Amount_Paid: number;
  Payment_Status: string;
  Reversal_Reason: string;

  /**
   * Construct a new Billing_Account passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);

    if (isString(this.Payment_Date)) {
      this.Payment_Date = new Date(this.Payment_Date);
    }

  }
}
