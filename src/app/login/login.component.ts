import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../core/user.service";
import {Router} from "@angular/router";
import { IToken } from "./login.component.token";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  user_name: string;
  error: string = null;
  password: string;
  token: IToken;
  tokencontent: string;

  constructor(private user_service: UserService, private router: Router) {  }

  login() {
    this.error = null;
    this.user_service.login(this.user_name, this.password)
      .subscribe(token => {
        if (this.user_service.token) {
          this.router.navigate(this.user_service.state ? [this.user_service.state] : ['/account/profile']);
        } else {
          this.error = "error";
          this.router.navigate(['/login']);
        }
      });

  }

  register() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    // console.log('Login local storage: ' + localStorage.getItem('gexa_auth_token'));
  }

}
