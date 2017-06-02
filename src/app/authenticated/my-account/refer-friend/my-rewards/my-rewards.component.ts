import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-my-rewards',
  templateUrl: './my-rewards.component.html',
  styleUrls: ['./my-rewards.component.scss']
})
export class MyRewardsComponent implements OnInit {
  streetAddress: string;
  city: string;
  state: string;
  zip: number;
  addressEditing: boolean;

  constructor() {
    this.addressEditing = false;
  }

  ngOnInit() {
    this.streetAddress = "20455 - TX-249 #200,";
    this.city = "Houston,";
    this.state = "TX";
    this.zip = 77070;
  }

  toggleAddressEdit($event){
    if ($event && $event.preventDefault) { $event.preventDefault(); }
    this.addressEditing = !this.addressEditing;
  }

}
