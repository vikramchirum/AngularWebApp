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
import { IUser } from "app/register/register";
import { environment } from 'environments/environment';

@Injectable()
export class UserService implements CanActivate {
  token: IToken;
  state: string = null;
  result: string;
  errorMessage: string;
  private actionUrl: string; private registerUrl: string;

  get logged_in_user(): string {
    return localStorage.getItem('gexa_auth_token');
  };

  get user_logged_in(): boolean {
    return !!this.logged_in_user;
  };

  constructor(private router: Router, private _http: Http) {

    this.actionUrl = environment.Api_Url + "/user/authentication";
    this.registerUrl = environment.Api_Url + "/user/register";

    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.token = currentUser && currentUser.token;

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

  login(user_name: string, password: string): Observable<IToken> {

    return this._http.get(`${this.actionUrl}?username=${user_name}&password=${password}`)
      .map((response: Response) => {
        const token = response.json() as IToken;
        if (token && token.Code === 'OK') {
          localStorage.setItem('gexa_auth_token', token.Data)
          this.token = token;
          return this.token;
        }

        return null;
      });

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
