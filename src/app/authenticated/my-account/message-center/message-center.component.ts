import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit {
  userNameEditing: boolean;
  constructor() {
     this.userNameEditing = false;
   }

  ngOnInit() {
  }
  toggleUserNameEdit($event) {
    $event.preventDefault();
    this.userNameEditing = !this.userNameEditing;
  }

}
