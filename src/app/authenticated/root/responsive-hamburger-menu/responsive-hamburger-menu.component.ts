import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'mygexa-responsive-hamburger-menu',
  templateUrl: './responsive-hamburger-menu.component.html',
  styleUrls: ['./responsive-hamburger-menu.component.scss']
})
export class ResponsiveHamburgerMenuComponent implements OnInit {
  
  @Output() notify = new EventEmitter<string>();

   constructor(private router: Router) {
  }

  ngOnInit() {
    
  }
   routerOnClick() {
   // this.router.navigate([url]);
    this.notify.emit("Router changed");
  }

}
