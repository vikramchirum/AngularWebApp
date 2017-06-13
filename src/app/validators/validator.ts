 /*
  Custom validators to use everywhere.
*/
import { FormGroup, FormControl } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

/**
* This patches the broken CustomValidators.creditCard validator.
* It was allowing allowing characters other than numbers, dashes and spaces.
* @param control
* @returns {any}
*/
export function validCreditCard(control: FormControl): any {

 const value: string = control.value;

 if (
   // Test for an empty string.
   !value
   // Test using the third-party validator.
   || CustomValidators.creditCard(control) !== null
   // Test if there are non-credit card characters (other than 0-9, spaces, and dashes)
   || /([^0-9 -])/g.test(value)
 ) {
   return { invalidCreditCard: true };
 }

 return null;

}

export function validateEmail(c: FormControl) {
  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}

// FORM GROUP VALIDATORS
export function equalityCheck (emailKey: string, confirmEmailKey: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const email = group.controls[emailKey];
    const confirmEmail = group.controls[confirmEmailKey];
    if (email.value !== confirmEmail.value) {
      return {
        equalityCheck: {
            valid: false
        }
      };
    }
  };
}
