import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../core/user.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  processing: boolean;
  user_name: string;
  error: string = null;
  password: string;

  constructor(private user_service: UserService, private router: Router) {
    this.processing = false;
  }


  login() {
    this.processing = true;
    this.error = null;
    this.user_service.login(this.user_name, this.password)
      .subscribe(
        token => {
          this.router.navigate(this.user_service.state ? [this.user_service.state] : ['/account/profile']);
        },
        error => {
          this.error = error.Message;
          this.processing = false;
        });

  }

  register() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    // console.log('Login local storage: ' + localStorage.getItem('gexa_auth_token'));
  }

}
