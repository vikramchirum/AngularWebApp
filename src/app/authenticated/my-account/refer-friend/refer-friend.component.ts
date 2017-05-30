import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'mygexa-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit {

  flipButton: boolean = false;

  constructor(private router: Router) { }

  toggleButton(): void {
    this.flipButton = !this.flipButton;
  }
  onEnroll() {
    this.router.navigate(['/referral-options']);
  }
  ngOnInit() {
  }

}
