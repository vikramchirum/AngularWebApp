import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit {
  emailEditing: boolean;
  constructor() {
     this.emailEditing = false;
   }

  ngOnInit() {
  }
 
   toggleEmailEdit($event) {
    $event.preventDefault();
    this.emailEditing = !this.emailEditing;
  }

}
