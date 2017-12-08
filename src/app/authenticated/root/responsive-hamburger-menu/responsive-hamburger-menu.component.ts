import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { result, startsWith } from 'lodash';


@Component({
  selector: 'mygexa-responsive-hamburger-menu',
  templateUrl: './responsive-hamburger-menu.component.html',
  styleUrls: ['./responsive-hamburger-menu.component.scss']
})
export class ResponsiveHamburgerMenuComponent implements OnInit {

  @Output() signout = new EventEmitter<string>();
  @Output() notify = new EventEmitter<string>();
  startsWith = startsWith;

  constructor(
        public Router: Router,
  ) { }

  ngOnInit() { }

  routerOnClick() {
    this.notify.emit('Router changed');
  }

  doSignOut($event) {
    if ($event && $event.preventDefault) { $event.preventDefault(); }
    this.routerOnClick();
    this.signout.emit();
  }

}
