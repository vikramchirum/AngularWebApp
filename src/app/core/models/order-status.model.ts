
import {assign} from 'lodash';

import {IAddress, addressString} from './address/address.model';
import {Offer} from './offers/offer.model';

export class OrderStatus {
    Service_Account_Id: string;
    Offer: Offer;
    Service_Account_Address: IAddress;
    Prev_Service_Account_Address: IAddress;
    Order_Placed: String;
    Order_Type: String;
    Status: String;

  constructor(opts: any) {
    assign(this, opts);
  }

  prevServiceAccountAddressString(): string {
    return addressString(this.Prev_Service_Account_Address);
  };

  serviceAccountAddressString(): string {
    return addressString(this.Service_Account_Address);
  };
}
