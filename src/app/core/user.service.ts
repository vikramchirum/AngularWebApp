/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { filter, find, forEach, get, map, pull } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from 'environments/environment';
import { IUser, IUserSecurityQuestions, IUserSigningUp } from './models/User.model';

function getBillingAccountIds(user: IUser): string[] {
  return user
    ? map(filter(get(user, 'Account_permissions', []), ['AccountType', 'Billing_Account_Id']), 'AccountNumber')
    : null;
}

function getCustomerAccountId(user: IUser): string {
  return user
    ? <string>get(find(get(user, 'Account_permissions', []), ['AccountType', 'Customer_Account_Id']), 'AccountNumber', null)
    : null;
}

@Injectable()
export class UserService implements CanActivate {

  public UserCache: IUser = null;
  public UserObservable: Observable<IUser> = null;
  public UserBillingAccountsObservable: Observable<string[]> = null;
  public UserCustomerAccountObservable: Observable<string> = null;
  public UserState: string = null;
  public getSecurityQuestionsCached: IUserSecurityQuestions[] = [];

  private UserObservers: Observer<IUser>[] = [];
  private UserBillingAccountsObservers: Observer<string[]>[] = [];
  private UserCustomerAccountObservers: Observer<string>[] = [];
  private getUserFromMongo = environment.Api_Url + '/user/getUserFromMongo';
  private secQuesUrl = environment.Api_Url + '/user/securityQues';
  private getSecQuestionUrl = environment.Api_Url + '/user/getSecQues';
  //private checkSecQuesUrl = environment.Api_Url + '/user/checkSecurityQues';
  //private resetPasswordUrl = environment.Api_Url + '/user/resetPassword';
  private loginUrl = environment.Api_Url + '/user/authentication';
  private registerUrl = environment.Api_Url + '/user/register';

  private checkSecQuesUrl = 'http://localhost:53342/api/user/checkSecurityQues';
  private resetPasswordUrl = 'http://localhost:53342/api/user/resetPassword';

  get user_token(): string {

    // See if we already have it cached and return it.
    const cachedToken = get(this.UserCache, 'Token', null);
    if (cachedToken) { return cachedToken; }

    // Try getting it from localStorage / sessionStorage / cookie / etc...
    const token = localStorage.getItem('gexa_auth_token');
    const token_expire = localStorage.getItem('gexa_auth_token_expire');

    // If it's valid and hasn't expired then return it.
    if (
      token
      && token_expire
      && Number(token_expire) > (new Date).getTime()
    ) {
      return token;
    }

    // Otherwise, reset the stored token and return null.
    // TODO: Use cross-browser capable storage solution here.
    localStorage.removeItem('gexa_auth_token');
    localStorage.removeItem('gexa_auth_token_expire');
    return null;

  };

  get user_logged_in(): boolean {
    return !!this.user_token;
  };

  get UserCacheBillingAccountIds(): string[] {
    return getBillingAccountIds(this.UserCache);
  }

  get UserCacheCustomerAccountId(): string {
    return getCustomerAccountId(this.UserCache);
  }

  constructor(
    private router: Router,
    private Http: Http
  ) {

    // Make the User Observable for others to listen to.
    this.UserObservable = Observable.create((observer: Observer<IUser>) => {

      // We want to collect our observers for future emits.
      this.UserObservers.push(observer);

      // Send the User data to the new observer.
      observer.next(this.UserCache);

      // Provide the clean-up function to avoid memory leaks.
      // Find the observer and remove them from the collection.
      return () => pull(this.UserObservers, observer);

    });

    // Make the User Billing_Account_Ids Observable for others to listen to.
    this.UserBillingAccountsObservable = Observable.create((observer: Observer<string[]>) => {

      // We want to collect our observers for future emits.
      this.UserBillingAccountsObservers.push(observer);

      // Send the User data to the new observer.
      observer.next(getBillingAccountIds(this.UserCache));

      // Provide the clean-up function to avoid memory leaks.
      // Find the observer and remove them from the collection.
      return () => pull(this.UserBillingAccountsObservers, observer);

    });

    // Make the User Customer_Account_Id Observable for others to listen to.
    this.UserCustomerAccountObservable = Observable.create((observer: Observer<string>) => {

      // We want to collect our observers for future emits.
      this.UserCustomerAccountObservers.push(observer);

      // Send the User data to the new observer.
      observer.next(getCustomerAccountId(this.UserCache));

      // Provide the clean-up function to avoid memory leaks.
      // Find the observer and remove them from the collection.
      return () => pull(this.UserCustomerAccountObservers, observer);

    });

    // Keep observers of the user's customer and billing account Ids updated.
    this.UserObservable.subscribe(user => {
      if (user) {
        forEach(this.UserBillingAccountsObservers, observer => observer.next(getBillingAccountIds(user)));
        forEach(this.UserCustomerAccountObservers, observer => observer.next(getCustomerAccountId(user)));
      }
    });

    // If we have a valid token then get our user data.
    const storedToken = this.user_token;
    if (storedToken) {

      const params = new URLSearchParams();
      params.append('Token', storedToken);
      const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      const options = new RequestOptions({ headers, params });

      this.Http.get(this.getUserFromMongo, options)
        .map(res => res.json())
        .catch(error => this.handleError(error))
        .subscribe(res => this.ApplyUserData(res));
    }

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // The user is logged in so yes, they can activate.
    if (this.user_logged_in) { return true; }

    // Otherwise, save their state and navigate to the login prompt.
    this.UserState = this.UserState || state.url;
    this.router.navigate(['/login']);

  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  login(user_name: string, password: string): Observable<string> {

    const body = new URLSearchParams();
    body.append('username', user_name);
    body.append('password', password);
    const options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }) });

    return this.Http.post(this.loginUrl, body.toString(), options)
      .map(res => res.json())
      .map(res => this.ApplyUserData(res))
      .catch(error => this.handleError(error));
  }

  signup(user: IUserSigningUp): Observable<string> {

    const body = JSON.stringify({
      Credentials: {
        Username: user.User_name,
        Password: user.Password
      },
      Profile: {
        Email_Address: user.Email_Address,
        Username: user.User_name
      },
      Security_Question: {
        Id: user.Security_Question_Id,
        Question: user.Security_Question_Id.valueOf()
      },
      Security_Question_Answer: user.Security_Question_Answer,
      Billing_Account_Id: user.Billing_Account_Id,
      Zip_Code: user.Zip_Code
    });
    const options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.Http.post(this.registerUrl, body, options)
      .map(res => res.json())
      .map(res => this.ApplyUserData(res))
      .catch(error => this.handleError(error));
  }

  getSecurityQuestions(): Observable<IUserSecurityQuestions[]> {

    if (this.getSecurityQuestionsCached.length) { return Observable.of(this.getSecurityQuestionsCached); }

    return this.Http.get(this.secQuesUrl)
      .map(res => res.json())
      .map(res => this.getSecurityQuestionsCached = res)
      .catch(error => this.handleError(error));
  }

  getSecQuesByUserName(user_name: string): Observable<string> {

    const body = JSON.stringify(user_name);
    const options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.Http.post(this.getSecQuestionUrl, body, options)
      .map(res => res.json())
      .map(res => get(res, 'length') > 0 ? res : null)
      .catch(error => this.handleError(error));
  }

  checkSecQuesByUserName(user_name: string, security_answer: string) {
    const body = new URLSearchParams();
    body.append('Username', user_name);
    body.append('SecurityAnswer', security_answer);

    const options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }) });
    return this.Http.post(this.checkSecQuesUrl, body, options)
      .map(res => res.json())
      .map(res => get(res, 'length') > 0 ?  localStorage.setItem('reset_password_token', res) : localStorage.setItem('reset_password_token', null))
      .catch(error => this.handleError(error));
  }

  resetPassword (user_name: string, password: string) {
    const token = localStorage.getItem('reset_password_token');
    const body = JSON.stringify({
      creds: {
      Username: user_name, Password: password
    },
      Token: token
    });
    const options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    if (token && token.length) {
      return this.Http.put(this.resetPasswordUrl, body, options)
        .map(res => res.json())
        .catch(error => this.handleError(error));
    }
    return null;
  }

  ApplyUserData(user: IUser): IUser {

    this.UserCache = user || null;

    if (user) {
      // Make date objects.
      this.UserCache.Creation_Time = new Date(this.UserCache.Creation_Time);
      this.UserCache.Date_Created = new Date(this.UserCache.Date_Created);
      this.UserCache.Date_Last_Modified = new Date(this.UserCache.Date_Last_Modified);
      // If the token has changed, then update our storage.
      if (localStorage.getItem('gexa_auth_token') !== this.UserCache.Token) {
        localStorage.setItem('gexa_auth_token', this.UserCache.Token);
        localStorage.setItem('gexa_auth_token_expire', (this.UserCache.Date_Created.getTime() + 1000 * 60 * 60).toString());
      }
    }

    // Emit the new data to all observers.
    forEach(this.UserObservers, observer => observer.next(this.UserCache));

    // Return the new user's data.
    return this.UserCache;

  }

  logout() {
    // Remove our token and apply empty data.
    // TODO: Use cross-browser capable storage solution here.
    localStorage.removeItem('gexa_auth_token');
    localStorage.removeItem('gexa_auth_token_expire');
    this.ApplyUserData(null);
  }

}

@Injectable()
export class RedirectLoggedInUserToHome implements CanActivate {

  constructor (
    private UserService: UserService,
    private Router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      this.UserService.user_logged_in
      && state.url === '/login'
    ) {
      this.Router.navigate(['/']);
    }
    return true;
  }

}
