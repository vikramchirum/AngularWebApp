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

  downloadFile(data: Response) {
    const blob = new Blob([data.blob()], {type: 'application/pdf'});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'invoice');
    } else {
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl);
    }
  }

}
