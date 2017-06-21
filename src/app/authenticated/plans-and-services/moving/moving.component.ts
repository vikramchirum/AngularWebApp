import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mygexa-moving',
  templateUrl: './moving.component.html',
  styleUrls: ['./moving.component.scss']
})
export class MovingComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

}
