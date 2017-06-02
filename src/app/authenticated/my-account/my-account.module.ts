import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { my_account_routes } from "./my-account-routing.module";
import { ProfileComponent } from './profile/profile.component';
import { MyAccountComponent } from './my-account.component';
import { SecurityInformationComponent } from './profile/security-information/security-information.component';
import { PaperlessSettingsComponent } from './profile/paperless-settings/paperless-settings.component';
import { MdCardModule, MaterialModule } from '@angular/material';
import { PersonalInformationComponent } from './profile/personal-information/personal-information.component';
import { SharedModule } from '../../shared/shared.module';
import { SecurityQuestionComponent } from './profile/security-information/security-question/security-question.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { ContactFormComponent } from './message-center/contact-form/contact-form.component';
// import { MyRewardsComponent } from './refer-friend/my-rewards/my-rewards.component';
// import { ReferFriendComponent } from "./refer-friend/refer-friend.component";
// import { ReferralOptionsComponent } from './refer-friend/referral-options/referral-options.component';

@NgModule({
  imports: [
    my_account_routes,
    CommonModule,
    MdCardModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ProfileComponent,
    // ReferFriendComponent,
    // MyRewardsComponent,
    // ReferralOptionsComponent,    
    MyAccountComponent, 
    SecurityInformationComponent, 
    PaperlessSettingsComponent, 
    PersonalInformationComponent, 
    SecurityQuestionComponent, 
    MessageCenterComponent, 
    ContactFormComponent]
})
export class MyAccountModule { }
