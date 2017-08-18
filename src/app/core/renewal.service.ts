/**
 * Created by vikram.chirumamilla on 7/10/2017.
 */
import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';
import { clone, find, first, forEach, get, isString, map, pull } from 'lodash';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { HttpClient } from './httpclient';
import { IRenewal } from './models/renewals/renewal.model';
import { ICreateRenewalRequest } from './models/renewals/createrenewalrequest.model';
import { ICancelRenewalRequest} from './models/renewals/cancelrenewalrequest.model';
import { IGetRenewalRequest } from './models/renewals/getrenewalrequest.model';
import { IRenewalDetails } from './models/renewals/renewaldetails.model';
import {Observer} from 'rxjs/Observer';
import {ServiceAccountService} from './serviceaccount.service';

@Injectable()
export class RenewalService {

  public ActiveServiceAccount_RenewalDetailsObservable: Observable<IRenewalDetails> = null;
  public ActiveServiceAccount_RenewalDetailsCache: IRenewalDetails = null;

  private initialized: boolean = null;
  private ActiveServiceAccount_RenewalDetailsObservers: Observer<any>[]= [];
  private requestObservable: Observable<Response> = null;
  private _ActiveServiceAccountId: string = null;

  constructor(private http: HttpClient, private ServiceAccountService: ServiceAccountService) {
    // Make Observable for others to listen to.
    this.ActiveServiceAccount_RenewalDetailsObservable = Observable.create((observer: Observer<any>) => {
      // 1. Collect, or 'push', new observers to the observable's collection.
      this.ActiveServiceAccount_RenewalDetailsObservers.push(observer);
      // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
      if (this.initialized) { observer.next(this.ActiveServiceAccount_RenewalDetailsCache); }
      // 3. Provide the new observer a clean-up function to prevent memory leaks.
      return() => pull(this.ActiveServiceAccount_RenewalDetailsObservers, observer);
      });

    // Respond to the first (initializing) call.
    this.ActiveServiceAccount_RenewalDetailsObservable.first().delay(0).subscribe((result) => {
      this.initialized = true;
    });


    // Keep up-to-date with the service's accounts Service via the service account id.
    this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => this.ActiveServiceAccountId = ActiveServiceAccount.Id);
  }

  get ActiveServiceAccountId(): string {
    return this._ActiveServiceAccountId;
  }
  set ActiveServiceAccountId(ActiveServiceAccountId: string) {
    if (this._ActiveServiceAccountId !== ActiveServiceAccountId) {
      this._ActiveServiceAccountId = ActiveServiceAccountId;
      this.UpdateRenewalDetails();
    }
  }

  getRenewal(serviceAccountId: number): Observable<IRenewal>   {
    const relativePath = `/renewals/${serviceAccountId}`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  searchRenewal(searchRequest: IGetRenewalRequest): Observable<IRenewal> {

    const params: URLSearchParams = new URLSearchParams();
    for (const key in searchRequest) {
      if (searchRequest.hasOwnProperty(key)) {
        const val = searchRequest[key];
        params.set(key, val);
      }
    }

    const relativePath = `/renewals/`;
    return this.http.get(relativePath, params)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  getRenewalDetails(serviceAccountId: number): Observable<IRenewalDetails>   {
    const relativePath = `/renewals/${serviceAccountId}/details`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <IRenewalDetails> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

UpdateRenewalDetails(): Observable<Response> {


  // If we're already requesting then return the original request observable.
  if (this.requestObservable) { return this.requestObservable; }

  // If we don't have a Service Account Id then return null;
  if (this.ActiveServiceAccountId === null) { return Observable.from(null); }

  const relativePath = `/renewals/${Number(this.ActiveServiceAccountId)}/details`;

  // Assign the Http request to prevent any similar requests.
  this.requestObservable = this.http.get(relativePath)
    .map(data => data.json())
    .map(data => <IRenewalDetails> data)
    .catch(error => error);

  // Handle the new Service account renewal data.
  this.requestObservable.subscribe(
    ServiceAccounts_RenewalDetails => this.ActiveServiceAccount_RenewalDetailsCache = <any>ServiceAccounts_RenewalDetails,
    error => this.http.handleHttpError(error),
    () => {
      console.log('ServiceAccounts_RenewalDetails =', this.ActiveServiceAccount_RenewalDetailsCache);
      // We're no longer requesting.
      this.requestObservable = null;
      // Emit our new data to all of our observers.
      this.emitToObservers(this.ActiveServiceAccount_RenewalDetailsObservers, this.ActiveServiceAccount_RenewalDetailsCache);
    }
  );
  return this.requestObservable;
}

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

  createRenewal(request: ICreateRenewalRequest): Observable<IRenewal> {
    const body = JSON.stringify(request);
    const relativePath = `/renewals/${request.service_account_id}/create_renewal`;
    return this.http.post(relativePath, body)
      .map((response: Response) => { return <IRenewal> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

  cancelRenewal(request: ICancelRenewalRequest): Observable<boolean> {
    const body = JSON.stringify(request);
    const relativePath = `/renewals/${request.Service_Account_Id}/cancel_renewal`;
    return this.http.put(relativePath, body)
      .map((response: Response) => { return <boolean> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }

}
