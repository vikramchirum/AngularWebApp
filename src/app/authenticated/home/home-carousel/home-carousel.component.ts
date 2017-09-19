import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.scss']
})
export class HomeCarouselComponent implements OnInit {

  public promoCode: string = null;
  constructor() { }
  ngOnInit() {
     this.promoCode = 'Hello';
  }

}
