
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import MockData from './bill.mock-data.json';

interface IBillCharges {
  title: string;
  items: any[];
}

export class Bill {
  id: string;
  date_due: string;
  invoice_number: string;
  charges: IBillCharges[];
}

@Injectable()
export class BillService {

  private billsUrl = 'api/bills';

  constructor(private http: Http) { }

  getBills(): Promise<Bill[]> {
    return Promise.resolve(MockData);
    /* For API:
     return this.http.get(this.billsUrl)
     .toPromise()
     .then(response => response.json().data as Bill[])
     .catch(this.handleError);
     */
  }

  getBill(id: string): Promise<Bill> {
    for (const index in MockData) {
      if (!MockData[index]) { continue; }
      if (MockData[index].id === id) { return Promise.resolve(MockData[index]); }
    }
    return Promise.reject(null);
    /* For API:
     return this.http.get(`${this.billsUrl}/${id}`)
     .toPromise()
     .then(response => response.json().data as Bill)
     .catch(this.handleError);
     */
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
