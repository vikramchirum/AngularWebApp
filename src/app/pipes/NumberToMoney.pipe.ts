import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'NumberToMoneyPipe'})
export class NumberToMoneyPipe implements PipeTransform {
  transform(value: number): string {

    const string = (Math.ceil(value) / 100).toString();

    if (string.indexOf('.') < 0 ) { return `${string}.00`; }

    if (string.length === 1) { return `${string}.00`; }

    if (string[string.length - 2] === '.') { return `${string}0`; }

    return `${string}`;

  }
}
