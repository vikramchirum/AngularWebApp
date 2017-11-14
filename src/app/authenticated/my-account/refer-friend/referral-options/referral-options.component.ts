import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { environment } from 'environments/environment';
import { validateEmail } from 'app/validators/validator';

import { CustomerAccount } from 'app/core/models/customeraccount/customeraccount.model';
import { IInviteRefereeRequest } from 'app/core/models/referrals/inviterefereesrequest.model';

import { CustomerAccountService } from 'app/core/CustomerAccount.service';
import { ReferralStore } from 'app/core/store/referralstore';

@Component({
  selector: 'mygexa-referral-options',
  templateUrl: './referral-options.component.html',
  styleUrls: ['./referral-options.component.scss']
})
export class ReferralOptionsComponent implements OnInit {

  @ViewChild('referralLink') referralLink;
  gexaShareUrl: string;
  friendsForm: FormGroup;
  customerAccount: CustomerAccount;
  isSubmitted = false;

  constructor(private FormBuilder: FormBuilder, private customerAccountService: CustomerAccountService, private referralStore: ReferralStore) {
  }

  ngOnInit() {

    const customerAccount$ = this.customerAccountService.CustomerAccountObservable.filter(activeServiceAccount => activeServiceAccount != null);
    customerAccount$.subscribe(result => {
      this.customerAccount = result;
      this.gexaShareUrl = environment.GexaShare_Url.concat(this.customerAccount.Id);
    });

    this.friendsForm = this.FormBuilder.group({
      FriendsList: this.FormBuilder.array([])
    });

    this.addFriend();
  }

  initFriend() {
    return this.FormBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      EmailAddress: ['', Validators.compose([Validators.required, validateEmail])]
    });
  }

  addFriend() {
    const control = <FormArray>this.friendsForm.controls['FriendsList'];
    control.push(this.initFriend());
  }

  removeFriend(i: number) {
    const control = <FormArray>this.friendsForm.controls['FriendsList'];
    control.removeAt(i);
  }

  onSubmit(friendsForm: FormGroup) {

    this.isSubmitted = false;

    const inviteRefereeRequest = {} as IInviteRefereeRequest;
    inviteRefereeRequest.Customer_Account_Id = this.customerAccount.Id;
    inviteRefereeRequest.FriendsList = friendsForm.get('FriendsList').value;

    this.referralStore.inviteReferees(inviteRefereeRequest).subscribe(result => {
      if (result) {
        console.log('Referees Invited');
        this.isSubmitted = true;
      }
    });

    if (this.isSubmitted) {
      this.friendsForm = this.FormBuilder.group({
        FriendsList: this.FormBuilder.array([])
      });
      this.addFriend();
    }
  }

  getReferralLink() {
    this.referralLink.nativeElement.select();
  }
}
