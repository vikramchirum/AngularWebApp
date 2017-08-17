
import { assign } from 'lodash';
import {IOffers} from './offers.model';

export class AllOffersClass {
  Type: string;
  Offers: [ IOffers ];

  /**
   * Construct a new AllOffersClass passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);
  }
}

export class UpgradeOffersClass {
  Items: [ IOffers ];

  /**
   * Construct a new AllOffersClass passing in values (opts) to use.
   * @param opts
   */
  constructor(opts: any) {
    assign(this, opts);
  }
}

