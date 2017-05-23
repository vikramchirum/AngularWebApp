/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';

import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class UserService implements CanActivate {

  get logged_in_user(): string {
    return localStorage.getItem('gexa_auth_token');
  };

  get user_logged_in(): boolean {
    if (this.logged_in_user)
      return true;
    return false;
  };

  constructor(private router: Router) {
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

  login(user_name: string, password: string) {
    localStorage.setItem('gexa_auth_token', user_name);
  }

  logout() {
    localStorage.removeItem('gexa_auth_token');
  }
}
