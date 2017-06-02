import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { equalityCheck } from '../../../validators/validator'


@Component({
  selector: 'mygexa-change-user-name',
  templateUrl: './change-user-name.component.html',
  styleUrls: ['./change-user-name.component.scss']
})
export class ChangeUserNameComponent implements OnInit {
    @Output() changedUserName = new EventEmitter<string>();

  changeUserNameForm: FormGroup;
  submitAttempt: boolean = false;
   constructor(fb: FormBuilder) {
    
     this.changeUserNameForm = fb.group({
      'userName': [null, Validators.required],
      'confirmUserName': [null, Validators.required]
   }, {validator: equalityCheck('userName', 'confirmUserName')});
   }

  ngOnInit() {
   
  } 

   submitForm(value: any, valid:boolean) {
    this.submitAttempt = true;
    console.log("value", value);
     console.log("valid", valid);
     if(valid){
      /**send the form values to api */
     }  

  }

}
