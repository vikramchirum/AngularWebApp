/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Response} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {environment} from 'environments/environment';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {clone, filter, find, forEach, get, map, pull, startsWith} from 'lodash';
import {IUser, IUserSecurityQuestions, IUserSigningUp} from './models/user/User.model';
import {HttpClient} from './httpclient';

function getServiceAccountIds(user: IUser): string[] {
  return user
    ? map(filter(get(user, 'Account_permissions', []), ['AccountType', 'Service_Account_Id']), 'AccountNumber')
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
  public UserServiceAccountsObservable: Observable<string[]> = null;
  public UserCustomerAccountObservable: Observable<string> = null;
  public UserState: string = null;
  public getSecurityQuestionsCached: IUserSecurityQuestions[] = [];

  private initialized: boolean = null;
  private UserObservers: Observer<IUser>[] = [];
  private UserServiceAccountsObservers: Observer<string[]>[] = [];
  private UserCustomerAccountObservers: Observer<string>[] = [];
  private secQuesUrl = '/user/securityQues';
  private getUserFromMongo = '/user/getUserFromMongo';
  private getSecQuestionUrl = '/user/getSecQues';
  private checkSecQuesUrl = '/user/checkSecurityQues';
  private resetPasswordUrl = '/user/resetPassword';
  private getUsernameUrl = '/user/getUsername';
  private loginUrl = '/user/authenticate';
  private registerUrl = '/user/register';
  private updateEmail = '/user/updateEmailAddress';
  private updateClaims = '/user/updateClaims';
  private updateSecAnswer = '/user/updateSecurityAnswer';
  private updateSecQuestion = '/user/updateSecurityQuestion';
  private updateUsername = '/user/updateUsername';

  get user_token(): string {

    // See if we already have it cached and return it.
    const cachedToken = get(this.UserCache, 'Token', null);
    if (cachedToken) {
      return cachedToken;
    }

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

  get UserCacheServiceAccountIds(): string[] {
    return getServiceAccountIds(this.UserCache);
  }

  get UserCacheCustomerAccountId(): string {
    return getCustomerAccountId(this.UserCache);
  }

  constructor(private router: Router,
              private Http: Http,
              private httpClient: HttpClient) {

    // Make the Observables (User, Service Account Ids, Customer Account Id) for others to listen to.
    // Each will:
    // 1. Collect, or 'push', new observers to the observable's collection.
    // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
    // 3. Provide the new observer a clean-up function to prevent memory leaks.
    this.UserObservable = Observable.create((observer: Observer<IUser>) => {
      this.UserObservers.push(observer);
      if (this.initialized) {
        observer.next(this.UserCache);
      }
      return () => pull(this.UserObservers, observer);
    });
    this.UserServiceAccountsObservable = Observable.create((observer: Observer<string[]>) => {
      this.UserServiceAccountsObservers.push(observer);
      if (this.initialized) {
        observer.next(getServiceAccountIds(this.UserCache));
      }
      return () => pull(this.UserServiceAccountsObservers, observer);
    });
    this.UserCustomerAccountObservable = Observable.create((observer: Observer<string>) => {
      this.UserCustomerAccountObservers.push(observer);
      if (this.initialized) {
        observer.next(getCustomerAccountId(this.UserCache));
      }
      return () => pull(this.UserCustomerAccountObservers, observer);
    });

    // Keep observers of the user's customer and service account Ids updated.
    this.UserObservable.subscribe(user => {
      if (user) {
        this.initialized = true;
        this.emitToObservers(this.UserServiceAccountsObservers, getServiceAccountIds(user));
        this.emitToObservers(this.UserCustomerAccountObservers, getCustomerAccountId(user));
        console.log('user = ', user);
        console.log(`ServiceAccountIds = ${getServiceAccountIds(user)}`);
        console.log(`CustomerAccountId = ${getCustomerAccountId(user)}`);
      }
    });

    // If we have a valid token then get our user data.

    const storedToken = this.user_token;
    if (storedToken) {

      this.httpClient.get(this.getUserFromMongo)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error))
        .subscribe(res => this.ApplyUserData(res));
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // The user is logged in so yes, they can activate.
    if (this.user_logged_in) {
      return true;
    }

    // Otherwise, save their state and navigate to the login prompt.
    this.UserState = this.UserState || state.url;
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});

  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

  login(user_name: string, password: string): Observable<IUser> {

    const body = {'username': user_name, 'password': password};

    return this.httpClient.post(this.loginUrl, body)
      .map(res => res.json())
      .map(res => {
        if (res.Account_permissions.length > 0) {
          this.ApplyUserData(res);
        }
        return res;
      })
      .catch(error => this.httpClient.handleHttpError(error));
  }

  signup(user: IUserSigningUp): Observable<string> {

    const body = {
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
      Service_Account_Id: user.Service_Account_Id,
      Zip_Code: user.Zip_Code
    };

    return this.httpClient.post(this.registerUrl, body)
      .map(res => res.json())
      .map(res => this.ApplyUserData(res))
      .catch(error => this.httpClient.handleHttpError(error));
  }

  getSecurityQuestions(): Observable<IUserSecurityQuestions[]> {

    if (this.getSecurityQuestionsCached.length) {
      return Observable.of(this.getSecurityQuestionsCached);
    }

    return this.httpClient.get(this.secQuesUrl)
      .map(res => res.json())
      .map(res => this.getSecurityQuestionsCached = res)
      .catch(error => this.httpClient.handleHttpError(error));
  }

  getSecQuesByUserName(user_name: string): Observable<string> {

    const body = JSON.stringify(user_name);

    return this.httpClient.post(this.getSecQuestionUrl, body)
      .map(res => res.json())
      .map(res => get(res, 'length') > 0 ? res : null)
      .catch(error => this.httpClient.handleHttpError(error));
  }

  checkSecQuesByUserName(user_name: string, security_answer: string) {
    const body = {
      Username: user_name,
      SecurityAnswer: security_answer
    };
    return this.httpClient.post(this.checkSecQuesUrl, body)
      .map(res => res.json())
      .map(res => {
        localStorage.setItem('reset_password_token', get(res, 'length') > 0 ? res : null);
        return res;
      })
      .catch(error => this.httpClient.handleHttpError(error));
  }

  resetPassword(user_name: string, password: string) {
    const token = localStorage.getItem('reset_password_token');
    const body = {
      creds: {
        Username: user_name,
        Password: password
      },
      Token: token
    };
    if (token && token.length) {
      return this.httpClient.put(this.resetPasswordUrl, body)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error));
    }
    return null;
  }

  recoverUsername(Email_Address) {
    const body = Email_Address;

    return this.httpClient.post(this.getUsernameUrl, body)
      .map(res => res.json())
      .map(res => {
        if (res && res.length) {
          sessionStorage.setItem('User_Name', res);
          return true;
        } else {
          return false;
        }
      })
      .catch(error => this.httpClient.handleHttpError(error));
  }

  updateEmailAddress(Email_Address: string) {
    // Using http client
    // const realtivePath = `/user/updateEmailAddress/`;
    // this._http.put(realtivePath, Email_Address).map((res: Response) => {
    // }).catch(error => this.HttpClient.handleHttpError(error));

    const token = localStorage.getItem('gexa_auth_token');
    const body = {
      Token: token,
      Email_Address: Email_Address
    };
    if (token && token.length) {
      return this.httpClient.put(this.updateEmail, body)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error));
    }
    return null;
  }

  // update username with token
  updateUserName(Username: string) {
    const token = localStorage.getItem('gexa_auth_token');
    const body = {
      creds: {
        Username: Username,
        Password: 'string'
      },
      Token: token
    };
    if (token && token.length) {
      return this.httpClient.put(this.updateUsername, body)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error));
    }
    return null;
  }

// Update security question and answer with token.
  updateSecurityQuestion(Ques_Id: number, Sec_Answer: string) {

    const token = localStorage.getItem('gexa_auth_token');
    const body = {
      Token: token,
      Question_Id: Ques_Id,
      Sec_Answer: Sec_Answer
    };
    if (token && token.length) {
      return this.httpClient.put(this.updateSecQuestion, body)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error));
    }
    return null;
  }

// Update security answer after user logged in.
  updateSecurityAnswer(Sec_Answer: string) {
    const token = localStorage.getItem('gexa_auth_token');
    const body = {
      Token: token,
      Sec_Answer: Sec_Answer
    };
    if (token && token.length) {
      return this.httpClient.put(this.updateSecAnswer, body)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error));
    }
    return null;
  }

  public setUserFromMongo(token: string) {
    if (token) {
      this.httpClient.get('/user/getUserFromMongo')
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error))
        .subscribe(res => this.ApplyUserData(res));
    }
  }

  public ApplyUserData(user: IUser): IUser {

    this.UserCache = user || null;

    if (user) {
      // Make date objects.
      this.UserCache.Creation_Time = new Date(this.UserCache.Creation_Time);
      this.UserCache.Date_Created = new Date(this.UserCache.Date_Created);
      this.UserCache.Date_Last_Modified = new Date(this.UserCache.Date_Last_Modified);
      // If the token has changed, then update our storage.
      if (localStorage.getItem('gexa_auth_token') !== this.UserCache.Token) {
        localStorage.setItem('gexa_auth_token', this.UserCache.Token);
        localStorage.setItem('gexa_auth_token_expire', (this.UserCache.Date_Created.getTime() + 1000 * 60 * 60 * 12).toString());
      }
    } else {
      // if (this.UserCache.Token && this.UserCache.Account_permissions.length < 0 ) {
      //
      // }
      this.httpClient.logout();
    }

    // Emit the new data to all observers.
    if (this.UserCache) {
      this.emitToObservers(this.UserObservers, this.UserCache);
    }

    // Return the new user's data.
    return this.UserCache;

  }

  public updateClaim(tok: string, zip: string, value: string) {
    const token = localStorage.getItem('gexa_auth_token');
    const body = {
      Zip: zip,
      Claim: {
        Claim: {
          key: 'Service_Account_Id',
          value: value
        },
        Token: tok
      }
    };
    if (tok && tok.length) {
      return this.httpClient.post(this.updateClaims, body)
        .map(res => res.json())
        .catch(error => this.httpClient.handleHttpError(error));
    }
    return null;
  }

  logout() {
    const relativePath = `/user/logout`;
    (this.httpClient.post(relativePath, null).map((response: Response) => {
      return <boolean> response.json();
    })).subscribe(res => {
      console.log('User logged out.');
    });
    this.httpClient.logout();
  }
}

@Injectable()
export class RedirectLoggedInUserToHome implements CanActivate {

  constructor(private UserService: UserService,
              private Router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      this.UserService.user_logged_in
      && startsWith(state.url, '/login')
    ) {
      this.Router.navigate(['/']);
    }
    return true;
  }

}
