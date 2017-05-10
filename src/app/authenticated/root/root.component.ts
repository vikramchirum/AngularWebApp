import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../environments/environment";
import {UserService} from "../../shared/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit {

  env = environment.Name;
  user: string;
  accordianVisible: boolean = false;

  constructor(private user_service: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.user_service.logged_in_user;
  }

  logout(){
    this.user_service.logout();
    this.router.navigate(['/login']);
  }

    toogleAccordian(evt) {
        if (this.accordianVisible) {
            this.accordianVisible = false;
            //jQuery('body').removeClass('noscroll');
        }
        else {
            //jQuery('body').removeClass('noscroll');
            this.accordianVisible = true;        
        //     jQuery('body').addClass('noscroll');
        // 
      }

    }

}
