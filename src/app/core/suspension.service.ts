import { Injectable } from '@angular/core';
import { HttpClient } from './httpclient';
import { ServiceAccount } from './models/serviceaccount/serviceaccount.model';
import { ServiceAccountService } from './serviceaccount.service';
import { ISuspensionStatusResponse } from './models/serviceaccount/suspensionstatus.model';
import { Observable } from 'rxjs';

@Injectable()
export class SuspensionService {
  
  private activeServiceAccount: ServiceAccount = null;

  constructor(private HttpClient: HttpClient, private serviceAccountService: ServiceAccountService) {
    this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => this.activeServiceAccount = activeServiceAccount
    );
  }

  getSuspensionStatus(serviceAccountId: string): Observable<ISuspensionStatusResponse> {
    return this.HttpClient
      .get(`/service_accounts/${serviceAccountId}/suspended`)
      .map(res => res.json())
      .catch(error => this.HttpClient.handleHttpError(error));
  }

}
