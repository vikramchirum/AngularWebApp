 /*
  Custom validators to use everywhere.
*/
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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
