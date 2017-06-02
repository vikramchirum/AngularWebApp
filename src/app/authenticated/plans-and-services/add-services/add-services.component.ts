import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollTop() {
    window.scrollTo(0,0);
  }

}
