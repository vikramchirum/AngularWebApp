/**
 * Created by vikram.chirumamilla on 7/6/2017.
 */
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClient } from './httpclient';
import { IBudgetBillingEstimate } from './models/budgetbilling/budgetbillingestimate.model';
import { IBudgetBillingInfo } from './models/budgetbilling/budgetbillinginfo';
import { ICreateBudgetBillingRequest } from './models/budgetbilling/createbudgetbillingrequest';
import { ICancelBudgetBillingRequest } from './models/budgetbilling/cancelbudgetbillingrequest';

@Injectable()
export class BudgetBillingService {

  constructor(private http: HttpClient) {
  }

  getBudgetBillingEstimate(billingAccountId: number): Observable<IBudgetBillingEstimate> {
    const relativePath = `/budget_billing/${billingAccountId}/estimate`;
    return this.http.get(relativePath).map((response: Response) => {
      return <IBudgetBillingEstimate> response.json();
    }).catch(this.handleError);
  }

  getBudgetBillingInfo(billingAccountId: number): Observable<IBudgetBillingInfo> {
    const relativePath = `/budget_billing/${billingAccountId}`;
    return this.http.get(relativePath).map((response: Response) => {
      return <IBudgetBillingInfo> response.json();
    }).catch(this.handleError);
  }

  createBudgetBilling(request: ICreateBudgetBillingRequest): Observable<boolean[]> {
    const body = JSON.stringify(request);
    const relativePath = `/budget_billing/${request.billing_account_id}/create_budget_billing`;
    return this.http.post(relativePath, body).map((response: Response) => {
      return <boolean> response.json();
    }).catch(this.handleError);
  }

  cancelBudgetBilling(request: ICancelBudgetBillingRequest): Observable<boolean> {
    const body = JSON.stringify(request);
    const relativePath = `/budget_billing/${request.billing_account_id}/cancel_budget_billing`;
    return this.http.put(relativePath, body).map((response: Response) => {
      return <boolean> response.json();
    }).catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log(error.statusText);
    return Observable.throw(error.statusText);
  }
}
