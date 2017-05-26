import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeUserNameComponent } from './components/change-user-name/change-user-name.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeEmailAddressComponent } from './components/change-email-address/change-email-address.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        ChangeUserNameComponent,
        ChangePasswordComponent,
        ChangeEmailAddressComponent
    ],
    exports :[
        ChangeUserNameComponent,
        ChangePasswordComponent,
        ChangeEmailAddressComponent
    ]
  
})
export class SharedModule { }