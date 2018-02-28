import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { get } from 'lodash';

import {UserService} from 'app/core/user.service';
import {ChannelStore} from 'app/core/store/channelstore';
import {environment} from '../../../environments/environment';

import * as CryptoJS from 'crypto-js';
declare var mcrypt: any;

@Component({
  selector: 'mygexa-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent implements OnInit {

  constructor(private UserService: UserService,
              private Router: Router,
              private FormBuilder: FormBuilder,
              private channelStore: ChannelStore) {
  }

  ngOnInit() {

    const getUrlParameter = function getUrlParameter(sParam) {
      const sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&');
      let sParameterName = null;
      for (let index = 0; index < sURLVariables.length; index++) {
        if (sURLVariables[index].indexOf('?') > -1) {
          sParameterName = sURLVariables[index].split('?');
          sParameterName = sParameterName[1].split('=');
        } else {
          sParameterName = sURLVariables[index].split('=');
        }
        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
      }
    };

    let username = getUrlParameter('xyu');
    let password = getUrlParameter('yxp');

    if (username && password) {

      username = getUrlParameter('xyu').toString();
      password = getUrlParameter('yxp').toString();

      if (username != null && password != null) {

        username = atob(username);
        const key = CryptoJS.enc.Base64.parse(environment.crypto_key);
        const iv = CryptoJS.enc.Base64.parse(environment.crypto_iv);
        let decrypted = CryptoJS.AES.decrypt(password, key, {iv: iv});
        decrypted = decrypted.toString(CryptoJS.enc.Utf8);
        username = username;
        password = decrypted.toString();
        if (username && password) {

          this.UserService.login(username.trim(), password.trim()).subscribe(
            (result) => {
              if ( get(result, 'Account_permissions.length', 0 ) <= 0 ) {
              } else {
                this.Router.navigate([this.UserService.UserState || '/']); }
              this.channelStore.LoadChannelId();
            },
              error => {
              this.Router.navigate(['/login']);
            }
          );
        }
      }
    }
  }
}
