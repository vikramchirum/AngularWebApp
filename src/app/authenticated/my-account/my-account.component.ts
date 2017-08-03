import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { result, startsWith } from 'lodash';



@Component({
  selector: 'mygexa-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

    private startsWith = startsWith;


  constructor(
    private Router: Router    
  ){}

  ngOnInit() {
  }
}