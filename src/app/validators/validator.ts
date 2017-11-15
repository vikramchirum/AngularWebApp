/*
 Custom validators to use everywhere.
 */

import { FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
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
    value
    // Test if the card type is Mastercard or not
    && (/^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/g.test(value)
    // Test if the card type is Visa or not
    || /^4[0-9]{12}(?:[0-9]{3})?$/g.test(value)
    // Test if the card type is Discover or not
    || /^6(?:011|5[0-9]{2})[0-9]{12}$/g.test(value)
    )) {
      return null;
    }
  return {invalidCreditCard: true};
}

export function validMoneyAmount(control: FormControl): any {

  const value: string = control.value;

  if (
    // Test for non-string types.
  typeof value !== 'string'
  // Test for an empty string.
  || !value
  || value === ''
  // Test using regex.
  || !/^\$?[0-9]+(\.[0-9][0-9])?$/.test(value)
  ) {
    return {invalidMoneyAmount: true};
  }

  return null;

}

export function minimumMoneyAmount(amount: number) {
  return (control: FormControl) => {

    // Test for a valid money amount:
    const isValidMoneyAmount = validMoneyAmount(control);
    if (isValidMoneyAmount !== null) {
      // If not valid, return so.
      return isValidMoneyAmount;
    }

    // Get the money value with decimals if it's a whole number:
    const value = control.value.indexOf('.') < 0 ? `${control.value}.00` : control.value;

    // Test if the money value is less than the specified amount:
    if (Number(value.replace(/[^0-9]+/g, '')) < amount) {
      return {minimumMoneyAmount: true};
    }

    return null;

  };
}


export function validateCardName(c: FormControl) {
  // const CARDNAME_REGEXP = /^(?![0-9]*$)[a-zA-Z0-9 ' ']+$/;
  const CARDNAME_REGEXP = /^(?![0-9]*$)[a-zA-Z0-9' ']+$/;
  return CARDNAME_REGEXP.test(c.value) ? null : {
    validateCardName: {
      valid: false
    }
  };
}

export function validateName(c: FormControl) {
  let inputArray: string[];
  let inputArrayLength: number;
  inputArray = (c.value.trim()).split(' ');
  inputArrayLength = inputArray.length;
    return inputArrayLength > 1 ? null : {
      validateName: {
        valid: false
      }
    };
}

export function validateNameOnCard(c: FormControl) {
  const value = (c.value.trim()).replace(/\s+/g, '');
  return parseInt(value, 10) ? { validateNameOnCard : { valid: false } } : null;
}

export function validateInteger(c: FormControl) {
  const INTEGER_REGEXP = /^[0-9]*$/;
  return INTEGER_REGEXP.test(c.value) ? null : {
    validateInteger: {
      valid: false
    }
  };
}

export function validateEmail(c: FormControl) {
  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
      valid: false
    }
  };
}


export function validatePassword(c: FormControl) {
  // const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,10}$/;
  // const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  // At least one digit, one upper case, one lower case. (Special characters optional and are pre- defined as below.
  const PASSWORD_REGEXP = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(^[a-zA-Z0-9@\$=!:.#%&*~^()_]+$)/;
  return PASSWORD_REGEXP.test(c.value) ? null : {
    validatePassword: {
      valid: false
    }
  };
}


// FORM GROUP VALIDATORS
export function equalityCheck(emailKey: string, confirmEmailKey: string) {
  return (group: FormGroup): { [key: string]: any } => {
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

export function equalCheck(Key: string, confirmKey: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const entry = group.controls[Key];
    const confirmEntry = group.controls[confirmKey];
    if (entry.value !== confirmEntry.value) {
      return {
        equalCheck: {
          valid: false
        }
      };
    }
  };
}


export function validatePhone(c: FormControl) {
  const PHONE_REGEXP = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return PHONE_REGEXP.test(c.value) ? null : {
    validatePhone: {
      valid: false
    }
  };
}

export function minimumValueValidator(param: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value < param) {
      return {'minimumValue': true};
    }
    return null;
  };
}
