/**
 * Created by vikram.chirumamilla on 7/6/2017.
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClient } from './httpclient';
import { IBudgetBillingEstimate } from './models/budgetbilling/budgetbillingestimate.model';
import { IBudgetBillingInfo } from './models/budgetbilling/budgetbillinginfo.model';
import { ICreateBudgetBillingRequest } from './models/budgetbilling/createbudgetbillingrequest.model';
import { ICancelBudgetBillingRequest } from './models/budgetbilling/cancelbudgetbillingrequest.model';

@Injectable()
export class BudgetBillingService {

  constructor(private http: HttpClient) {
  }

  getBudgetBillingEstimate(serviceAccountId: number): Observable<IBudgetBillingEstimate> {
    const relativePath = `/budget_billing/${serviceAccountId}/details`;
    return this.http.get(relativePath).map((response: Response) => {
      return <IBudgetBillingEstimate> response.json();
    }).catch(this.handleError);
  }

  getBudgetBillingInfo(serviceAccountId: number): Observable<IBudgetBillingInfo> {
    const relativePath = `/budget_billing/${serviceAccountId}`;
    return this.http.get(relativePath).map((response: Response) => {
      return <IBudgetBillingInfo> response.json();
    }).catch(this.handleError);
  }

  createBudgetBilling(request: ICreateBudgetBillingRequest): Observable<boolean[]> {
    const relativePath = `/budget_billing/${request.Service_Account_Id}/create`;
    return this.http.post(relativePath, request).map((response: Response) => {
      return <boolean> response.json();
    }).catch(this.handleError);
  }

  cancelBudgetBilling(request: ICancelBudgetBillingRequest): Observable<boolean> {
    const body = JSON.stringify(request);
    const relativePath = `/budget_billing/${request.Service_Account_Id}/cancel`;
    return this.http.put(relativePath, body).map((response: Response) => {
      return <boolean> response.json();
    }).catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
