import { Pipe, PipeTransform } from '@angular/core';
import {NumberToMoney} from './NumberToMoney.pipe';

export function DollarToCents(val: number): number {
  return val * 100;
}

@Pipe({
  name: 'DollarToCentsPipe'
})
export class DollarToCentsPipe implements PipeTransform {

  transform(value: number): number {
    return DollarToCents(value);
  }

}
