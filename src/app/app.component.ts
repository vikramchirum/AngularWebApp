import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'mygexa-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mygexa works!';

  constructor(
    private Router: Router
  ) {}
}
