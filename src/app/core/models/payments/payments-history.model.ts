import { assign, isString } from 'lodash';

export class PaymentsHistory {
  PaymentDate: Date;
  PaymentAmount: number;
  PaymentStatus: string;
  PaymentMethod: string;
  PaymentAccount: string;

  constructor(opts: any) {
    assign(this, opts);

    if (isString(this.PaymentDate)) {
      this.PaymentDate = new Date(this.PaymentDate);
    }
  }
}
