import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { startsWith } from 'lodash';

@Component({
  selector: 'mygexa-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {

  private startsWith = startsWith;

  constructor(
    private Router: Router
  ) {}
}
