/**
 * Created by vikram.chirumamilla on 9/26/2017.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

  constructor() {
  }

  isNullOrWhitespace(input: string) {

    if (typeof input === 'undefined' || input === null || input === 'null') {
      return true;
    }

    return input.replace(/\s/g, '').length < 1;
  }

  addMonths(date: Date, months: number): Date {
    date.setMonth(date.getMonth() + months);
    return date;
  }
}
