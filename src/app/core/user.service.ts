/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, URLSearchParams, RequestOptions, Request, RequestMethod} from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {IToken} from "app/guest/login/login.component.token";
import {IUser, ISecurityQuestions} from "app/guest/login/register";
import {IRegisteredUser} from "app/guest/login/registeredUserDetails";
import {environment} from 'environments/environment';

@Injectable()
export class UserService implements CanActivate {

  public userDetails: IRegisteredUser;
  public securityQuestions: ISecurityQuestions;
  state: string = null;
  result: string;
  errorMessage: string;
  private loginUrl: string;
  private registerUrl: string;
  private secQuesUrl: string;
  private getSecQuestionUrl: string;


  get user_token(): string {
    return localStorage.getItem('gexa_auth_token');
  };

  get user_logged_in(): boolean {
    return !!this.user_token;
  };

  constructor(private router: Router, private _http: Http) {

     // this.loginUrl = 'http://localhost:53342/api/user/authentication';
     // this.registerUrl = 'http://localhost:53342/api/user/register';
     // this.getSecQuestionUrl = 'http://localhost:53342/api/user/getSecQues';

    this.secQuesUrl = environment.Api_Url + "/user/securityQues";
    this.getSecQuestionUrl = environment.Api_Url + "/user/getSecQues";
    this.loginUrl = environment.Api_Url + "/user/authentication";
    this.registerUrl = environment.Api_Url + "/user/register";
   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verify_login(state.url);
  }

  verify_login(url: string): boolean {

    if (this.state === null) {
      this.state = url;
    }

    if (this.user_logged_in) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
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
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', user_name);
    urlSearchParams.append('password', password);

    let headerParam = new Headers();
    headerParam.append("Content-Type", "application/x-www-form-urlencoded");

    let requestOptions = new RequestOptions({headers: headerParam});
    return this._http.post(this.loginUrl, urlSearchParams.toString(), requestOptions)
      .map((response: Response) => {
        var result = response.json();
        console.log("Result:", result);
        const token = result.Token;
        if (token && token.length) {
          localStorage.setItem('gexa_auth_token', token);
          return result;
        }
        return null;
      })
      .catch((error: any) => Observable.throw({Code: error.status, Message: error.statusText}));
  }

  signup(user: IUser): Observable<string> {

    var userRegistration = {
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
      }
    ;
    let body = JSON.stringify(userRegistration);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this._http.post(this.registerUrl, body, options)
      .map((response: Response) => {
        this.userDetails = response.json();
        const token = this.userDetails.Token;
        if (token && token.length) {
          localStorage.setItem('gexa_auth_token', token);
          return token;
        }
        return null;
      })
      .catch((error: any) => Observable.throw({Code: error.status, Message: error.statusText}));

    // this._http.post(this.registerUrl, user)
    //   .map((res: Response) => res.json())
    //   .subscribe(res => { this.result = res;
    //     console.log(this.result);
    //   });
  }

  getSecurityQuestions(): Observable<ISecurityQuestions[]> {
    return this._http.get(
      this.secQuesUrl).map(
      (response: Response) => {
        var res = <ISecurityQuestions[]> response.json();
        //console.log("Response:", res);
        return res;
        // data => {
        // console.log("My data", data);
        // return data;
      }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getSecQuesByUserName(user_name: string): Observable<string> {
    var username = user_name;
    let body = JSON.stringify(username);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

   return this._http.post(this.getSecQuestionUrl, body, options)
      .map((response: Response) => {
        var result = response.json();
        console.log( 'Response', result);
        if (result && result.length) {
          return result;
        }
        return null;
      }) .catch((error: any) => Observable.throw({Code: error.status, Message: error.statusText}));
  }

  logout() {
    // clear token remove user from local storage to log user out
    //this.token = null;
    //localStorage.removeItem('currentUser');
    localStorage.removeItem('gexa_auth_token');
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
