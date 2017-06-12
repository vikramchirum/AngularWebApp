import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { validateEmail } from 'app/validators/validator';

@Component({
  selector: 'mygexa-referral-options',
  templateUrl: './referral-options.component.html',
  styleUrls: ['./referral-options.component.scss']
})
export class ReferralOptionsComponent implements OnInit, AfterViewInit {
  @ViewChild('referralLink') referralLink;

  private friendsForm: FormGroup;

  constructor(
    private FormBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.friendsForm = this.FormBuilder.group({
      friends: this.FormBuilder.array([])
    });
    this.addFriend();
  }

  initFriend() {
    return this.FormBuilder.group({
      name: this.FormBuilder.group({
        first: ['', Validators.required],
        last: ['', Validators.required]
      }),
      email: ['', Validators.compose([Validators.required, validateEmail])]
    });
  }

  addFriend() {
    const control = <FormArray>this.friendsForm.controls['friends'];
    control.push(this.initFriend());
  }

  removeFriend(i: number) {
    const control = <FormArray>this.friendsForm.controls['friends'];
    control.removeAt(i);
  }

  onSubmit(friendsForm: FormGroup) {
    console.log(friendsForm.value);
    alert('Invitations sent here - check the console for your data.');
  }

  getReferralLink() {
    this.referralLink.nativeElement.select();
  }

  ngAfterViewInit() {}

}
