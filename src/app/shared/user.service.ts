/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions, Request, RequestMethod } from '@angular/http';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { IToken } from "app/login/login.component.token";
import { IUser } from "app/register/register";

@Injectable()
export class UserService implements CanActivate {
  token: IToken[];
  result: string;
  errorMessage: string;
  private actionUrl: string; private registerUrl: string;

  get logged_in_user(): string {
    return localStorage.getItem('gexa_auth_token');
  };

  get user_logged_in(): boolean {
    if(this.logged_in_user)
      return true;
    return false;
  };

  constructor(private router: Router, private _http: Http) {
    this.actionUrl = "http://localhost:62204/api/Login/authorizeUser";
    this.registerUrl = "http://localhost:50981/api/Login/register";

    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.verify_login(url);
  }

  verify_login(url: string): boolean {
    if (this.user_logged_in) {
      return true;
    }
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

    // Parameters obj-
    let params: URLSearchParams = new URLSearchParams();
    params.set('username', user_name);
    params.set('password', password);

    return this._http.get(this.actionUrl + '?username=' +  user_name + '&password=' + password + '', {search: params})
        .map((response: Response) => <IToken> response.json()).
        do(data => localStorage.setItem('gexa_auth_token', data.Data)).
        catch(this.handleError);

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
