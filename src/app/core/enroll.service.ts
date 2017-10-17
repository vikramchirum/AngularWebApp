import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from './httpclient';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';
import { clone, forEach, pull, map } from 'lodash';
import { CustomerCheckToken } from 'app/core/models/customercheckstoken/customer-checks.model';
import { EnrollmentRequest } from 'app/core/models/enrolladditionalservices/enrollment-request.model';

@Injectable()
export class EnrollService {

  constructor(private http: HttpClient) { }

  createEnrollment(enrollReq: EnrollmentRequest): Observable<string> {
    return this.http.post(`/Enrollments`,enrollReq)
    .map(data => data.json())
    //.catch(error => this.http.handleHttpError(error));
    .catch(error => this.handleError(error));
  }

  getCustomerCheckToken(customerAccountId: string): Observable<CustomerCheckToken> {
    //return this.http.get(`/service_accounts/${customerAccountId}/offers`)
    return this.http.post(`/Customer_checks/Existing?customer_account_id=${customerAccountId}`,{})
   // return this.http.post(`/Customer_checks/Existing?customer_account_id=288673`,{})
      .map(data => data.json())
      //.catch(error => this.http.handleHttpError(error));
      .catch(error => this.handleError(error));
  }
  
handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
        if(error.json() && error.json().Message)
            errMsg = error.json().Message;
        else
            errMsg = error.toString();
        //console.log('err: ',errMsg);
      //errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
}

}