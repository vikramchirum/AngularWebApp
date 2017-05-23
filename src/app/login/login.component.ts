import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../shared/user.service";
import {Router} from "@angular/router";
import { IToken } from "./login.component.token";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  user_name: string;
  password: string;
  token: IToken;
  tokencontent: string;

  constructor(private user_service: UserService, private router: Router) {  }

  login() {
    this.user_service.login(this.user_name, this.password).subscribe(res => this.token = res );

    console.log('Login local storage: ' + localStorage.getItem('gexa_auth_token'));

    if(localStorage.getItem("gexa_auth_token") != null)
      this.router.navigate(['/account']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    console.log('Login local storage: ' + localStorage.getItem('gexa_auth_token'));
  }

}
