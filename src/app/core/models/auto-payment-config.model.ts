
import { assign, isString } from 'lodash';

export interface IBillingAccountModel {
  BillingAccountId: string;
  BillingSystem: 'GEMS' | string;
  AccountTypeName: 'ContractServicePoint' | string;
  BusinessUnit: 'GEXA' | string;
}

export interface IAutoPaymentConfigEnroll {
  PayMethodId: number;
  BillingAccountModel: IBillingAccountModel;
}

export interface IAutoPaymentConfigUpdate {
  APCId: string;
  PayMethodId: string;
}

export interface IAutoPaymentConfig {
  Id: string;
  StartDate: Date;
  StopDate: Date;
  PayMethodId: number;
  BillingAccountModel: IBillingAccountModel;
}

export class AutoPaymentConfig implements IAutoPaymentConfig {

  Id: string = null;
  StartDate: Date = null;
  StopDate: Date = null;
  PayMethodId: number = null;
  BillingAccountModel: IBillingAccountModel = {
    BillingAccountId: null,
    BillingSystem: null,
    AccountTypeName: null,
    BusinessUnit: null
  };

  /**
   * Construct a new Billing_Account passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);

    // Convert ISO string dates to JavaScript Date objects.
    if (isString(this.StartDate)) {
      this.StartDate = new Date(this.StartDate);
    }
    if (isString(this.StopDate)) {
      this.StopDate = new Date(this.StopDate);
    }
  }
}
