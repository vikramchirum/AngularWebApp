import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import MockData from './billing-account-id-mock-data.json';

@Injectable()
export class MyBillService {


  public myBill = null;
  private myBillUrl = 'api/billing_accounts/<id>'; //url to web API


  constructor(private http: Http) { }


  /**
   * Returns billing account details based on Id 
   * @param id
   * @returns {Promise<any>}
   */
  getMyBill(Id: string): Promise<any> {

    //return bill if data is present

    if (this.myBill !== null) {
      return Promise.resolve(this.myBill);
    }

    //If bill detail is not there, request the service
    return Promise.resolve(MockData)
      .then(data => this.extractData(data))
      .catch(error => this.handleError(error));
    //   return this.http.get(this.myBillUrl)
    //   .toPromise()
    //   .then(response => response.json())
    //   .then(data => this.extractData(data))
    //     .catch(this.handleError);
  }
  private extractData(res: Response) {
    // console.log(res);
    return res;
    // let body = res.json();
    //return body.data || { };
  }



  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}



