import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../shared/user.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  user_name: string;
  password: string;


  constructor(private user_service: UserService, private router: Router) {  }

  login(){
    this.user_service.login(this.user_name, this.password);
    this.router.navigate(['/account']);
  }

  ngOnInit() {
    console.log('Login local storage: ' + localStorage.getItem('gexa_auth_token'));
  }

}
