import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { equalityCheck } from 'app/validators/validator';

@Component({
  selector: 'mygexa-change-user-name',
  templateUrl: './change-user-name.component.html',
  styleUrls: ['./change-user-name.component.scss']
})
export class ChangeUserNameComponent {

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  changeUserNameForm: FormGroup = null;
  submitAttempt: boolean = null;

   constructor(
     FormBuilder: FormBuilder
   ) {
     this.changeUserNameForm = FormBuilder.group(
       {
         userName: [null, Validators.required],
         confirmUserName: [null, Validators.required]
       },
       {
         validator: equalityCheck('userName', 'confirmUserName')
       }
     );
   }

   submitForm() {
     this.submitAttempt = true;
     console.log('value', this.changeUserNameForm.value);
     console.log('valid', this.changeUserNameForm.valid);
     if (this.changeUserNameForm.valid) {
      /**send the form values to api */
     }
   }

   emitCancel() {
     this.onCancel.emit();
   }

}
