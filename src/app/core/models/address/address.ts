/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

export interface IAddress {
  Line1: string;
  Line2: string;
  City: string;
  State: string;
  Zip: string;
  Zip_4: string;
}


/**
  * Returns back a formatted string of service Address
  * @param type
  * @returns {string | null}
  */
export function addressString(address): string {
  if (address) {
    return [
      address.Line1,
      address.Line2 && address.Line2 !== '' ? ' ' + address.Line2 : '',
      ', ',
      address.City,
      ', ',
      address.State,
      ' ',
      address.Zip,
      address.Zip_4 && address.Zip_4 !== '' ? '-' + address.Zip_4 : ''
    ].join('');
  }

  return null;

}