import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterModule } from '@angular/router';


@Component({
  selector: 'mygexa-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent implements OnInit {

  flipButton: boolean = false;
  enrolled: boolean = false;
  constructor(private router: Router) { }

  testing() {
    this.enrolled = !this.enrolled
  }
  toggleButton(): void {
    this.flipButton = !this.flipButton;
  }
  onEnroll() {
    this.enrolled = true;
    //this.router.navigate(['/account/refer-a-friend/my-rewards']);
  }
  ngOnInit() { }

}
