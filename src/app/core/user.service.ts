/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions, Request, RequestMethod } from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { IToken } from "app/login/login.component.token";
import { IUser } from "app/login/register";
import { environment } from 'environments/environment';

@Injectable()
export class UserService implements CanActivate {

  state: string = null;
  result: string;
  errorMessage: string;
  private actionUrl: string; private registerUrl: string;

  get user_token(): string {
    return localStorage.getItem('gexa_auth_token');
  };

  get user_logged_in(): boolean {
    return !!this.user_token;
  };

  constructor(private router: Router, private _http: Http) {

    this.actionUrl = environment.Api_Url + "/user/authentication";
    //this.actionUrl = "http://localhost:58894/api/user/authentication";
    this.registerUrl = environment.Api_Url + "/user/register";

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verify_login(state.url);
  }

  verify_login(url: string): boolean {

    if (this.state === null) { this.state = url; }

    if (this.user_logged_in) { return true; }

    this.router.navigate(['/login']);
    return false;
  }

  private handleError (error: Response | any) {
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
    headerParam.append("Content-Type","application/x-www-form-urlencoded");

    let requestOptions = new RequestOptions({headers: headerParam});
    return this._http.post(this.actionUrl, urlSearchParams.toString(), requestOptions)
      .map((response: Response) => {
        const token = response.json();
        if (token && token.length) {
          localStorage.setItem('gexa_auth_token', token);
          return token;
        }
        return null;
      })
      .catch((error:any) => Observable.throw({Code: error.status, Message: error.statusText}));
  }

  signup(user: IUser) {
    this._http.post(this.registerUrl, user)
      .map((res: Response) => res.json())
      .subscribe(res => { this.result = res;
        console.log(this.result);
      });
  }

  logout() {
    // clear token remove user from local storage to log user out
    //this.token = null;
    //localStorage.removeItem('currentUser');
    localStorage.removeItem('gexa_auth_token');
  }
}
