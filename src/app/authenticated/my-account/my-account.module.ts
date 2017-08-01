import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdCardModule, MaterialModule } from '@angular/material';

import { my_account_routes } from './my-account-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MyAccountComponent } from './my-account.component';
import { SecurityInformationComponent } from './profile/security-information/security-information.component';
import { PaperlessSettingsComponent } from './profile/paperless-settings/paperless-settings.component';
import { PersonalInformationComponent } from './profile/personal-information/personal-information.component';
import { SharedModule } from 'app/shared/shared.module';
import { SecurityQuestionComponent } from './profile/security-information/security-question/security-question.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { ContactFormComponent } from './message-center/contact-form/contact-form.component';

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
    MyAccountComponent,
    SecurityInformationComponent,
    PaperlessSettingsComponent,
    PersonalInformationComponent,
    SecurityQuestionComponent,
    MessageCenterComponent,
    ContactFormComponent
  ]
})
export class MyAccountModule { }
