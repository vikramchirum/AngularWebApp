import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {UserService} from '../../shared/user.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit {

  env = environment.Name;
  user: string;
  accordionVisible: boolean = false;

  constructor(private user_service: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.user_service.logged_in_user;
  }

  logout() {
    this.user_service.logout();
    this.router.navigate(['/login']);
  }

  toggleAccordion(evt) {
    this.accordionVisible = !this.accordionVisible;
  }

  onNotify(message: string): void {
    this.accordionVisible = false;
  }

}
