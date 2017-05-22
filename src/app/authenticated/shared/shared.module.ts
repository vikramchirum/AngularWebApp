import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeUserNameComponent } from './change-user-name/change-user-name.component'

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        ChangeUserNameComponent
    ],
    exports :[
        ChangeUserNameComponent
    ]
  
})
export class SharedModule { }