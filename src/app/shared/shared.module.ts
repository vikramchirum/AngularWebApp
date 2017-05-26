import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeUserNameComponent } from './components/change-user-name/change-user-name.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        ChangeUserNameComponent,
        ChangePasswordComponent
    ],
    exports :[
        ChangeUserNameComponent,
        ChangePasswordComponent
    ]
  
})
export class SharedModule { }