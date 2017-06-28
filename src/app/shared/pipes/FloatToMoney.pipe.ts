import { Pipe, PipeTransform } from '@angular/core';

import { NumberToMoney } from './NumberToMoney.pipe';

export function FloatToMoney(value: number): string {

  return NumberToMoney(value * 100);

}

@Pipe({name: 'FloatToMoneyPipe'})
export class FloatToMoneyPipe implements PipeTransform {
  transform(value: number): string {

    return FloatToMoney(value);

  }
}
