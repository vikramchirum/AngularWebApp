
import { assign, isString } from 'lodash';

export interface IServiceAccountModel {
  ServiceAccountId: string | number;
  BillingSystem: 'GEMS' | string;
  AccountTypeName: 'ContractServicePoint' | string;
  BusinessUnit: 'GEXA' | string;
}

export interface IAutoPaymentConfigEnroll {
  PayMethodId: string | number;
  ServiceAccountModel: IServiceAccountModel;
}

export interface IAutoPaymentConfigUpdate {
  APCId: string | number;
  PayMethodId: string | number;
}

export interface IAutoPaymentConfig {
  Id: string | number;
  StartDate: Date;
  StopDate: Date;
  PayMethodId: string | number;
  ServiceAccountModel: IServiceAccountModel;
}

export class AutoPaymentConfig implements IAutoPaymentConfig {

  Id: string | number = null;
  StartDate: Date = null;
  StopDate: Date = null;
  PayMethodId: string | number = null;
  ServiceAccountModel: IServiceAccountModel = {
    ServiceAccountId: null,
    BillingSystem: null,
    AccountTypeName: null,
    BusinessUnit: null
  };

  /**
   * Construct a new AutoPaymentConfig passing in values (opts) to use.
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
