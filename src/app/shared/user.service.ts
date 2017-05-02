/**
 * Created by patrick.purcell on 5/2/2017.
 */
import {Injectable} from '@angular/core';

import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class UserService implements CanActivate {
  user_logged_in: boolean = false;
  logged_in_user: string;
  auth_user: any;

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
    this.user_logged_in = true;
    this.logged_in_user = user_name;
    this.auth_user = {user_name: user_name, password: password};
  }

  logout(){
    this.user_logged_in = false;
  }
}
