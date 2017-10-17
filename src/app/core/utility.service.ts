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

    const fileName = this.parseFilenameFromContentDisposition(data.headers.get('Content-Disposition'));
    const blob = new Blob([data.blob()], {type: 'application/pdf'});
    const objectUrl = window.URL.createObjectURL(blob);

    // for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'invoice');
    } else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      // for firefox
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
      }, 10);
    } else {
      // for chrome and other browsers
      window.open(objectUrl, '_blank');
    }
  }

  parseFilenameFromContentDisposition(contentDisposition: any) {
    if (!contentDisposition) {
      return null;
    }

    let filename = null;
    if (contentDisposition && contentDisposition.indexOf('inline') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    return filename;
  }
}
