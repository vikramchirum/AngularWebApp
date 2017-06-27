import { Pipe, PipeTransform } from '@angular/core';

export function NumberToMoney(value: number): string {

  // We'll take the money amount in cents, so round any possible fractions of cents.
  value = Math.round(value);

  // Single-digit values with a possible negative sign.
  if (value < 10 && value > -10) {
    return `${value < 0 ? '-' : ''}0.0${Math.abs(value)}`;
  }

  // Double-digit values with a possible negative sign.
  if (value < 100 && value > -100) {
    return `${value < 0 ? '-' : ''}0.${Math.abs(value)}`;
  }

  // Get the value as a string, with the decimal.
  const valueString = (value / 100).toString();

  // If we only have one digit after the decimal.
  if (valueString[valueString.length - 2] === '.') {
    return `${valueString}0`;
  }

  // If we do not have any decimals the it's a whole number.
  if (valueString.indexOf('.') < 0) {
    return `${valueString}.00`;
  }

  // It's a valid money number.
  return valueString;

}

@Pipe({name: 'NumberToMoneyPipe'})
export class NumberToMoneyPipe implements PipeTransform {
  transform(value: number): string {

    return NumberToMoney(value);

  }
}
