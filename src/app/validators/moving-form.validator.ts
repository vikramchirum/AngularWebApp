import { FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { clone } from 'lodash';


export function checkIfSunday(control: FormControl) {

    if (control.value) {
        const serviceDate = control.value.jsdate;
        const selectedDay = serviceDate.getDay();
        if (selectedDay == 0) {
            return {
                checkIfSunday: {
                    valid: false
                }
            };
        }
    }

}



export function checkIfNewYear(control:FormControl) {
    if(control.value) {
        const serviceDate = control.value.date;
        const selectedDay = serviceDate.day;
        const selectedMonth = serviceDate.month;
        if(selectedDay == 1 && selectedMonth == 1){
             return {
                checkIfNewYear: {
                    valid: false
                }
            };

        }
    }
}

export function checkIfChristmasEve(control:FormControl) {
    if(control.value) {
        const serviceDate = control.value.date;
        const selectedDay = serviceDate.day;
        const selectedMonth = serviceDate.month;
        if(selectedDay == 24 && selectedMonth == 12){
             return {
                checkIfChristmasEve: {
                    valid: false
                }
            };

        }
    }
}

export function checkIfChristmasDay(control:FormControl) {
    if(control.value) {
        const serviceDate = control.value.date;
        const selectedDay = serviceDate.day;
        const selectedMonth = serviceDate.month;
        if(selectedDay == 25 && selectedMonth == 12){
             return {
                checkIfChristmasDay: {
                    valid: false
                }
            };

        }
    }
}


export function checkIfJuly4th(control:FormControl) {
     if(control.value) {
        const serviceDate = control.value.date;
        const selectedDay = serviceDate.day;
        const selectedMonth = serviceDate.month;
        if(selectedDay == 4 && selectedMonth == 7){
             return {
                checkIfJuly4th: {
                    valid: false
                }
            };

        }
    }

}


export function validateMoveInDate(endDate, startDate) {
    return (group: FormGroup): { [key: string]: any } => {
        let serviceEndDate = group.controls[endDate].value;
        let serviceStartDate = group.controls[startDate].value;
        if (serviceEndDate && serviceStartDate) {
            serviceStartDate = serviceStartDate.jsdate;
            serviceEndDate = clone(serviceEndDate.jsdate);
            serviceEndDate = serviceEndDate.setDate(serviceEndDate.getDate() + 30);
            if (serviceStartDate > serviceEndDate) {
                return {
                    validateMoveInDate: {
                        valid: false
                    }
                };
            }

            // Let's check the case when end date is more than 30 days past start date
            serviceEndDate = group.controls[endDate].value;
            serviceEndDate = clone(serviceEndDate.jsdate);
            serviceEndDate = serviceEndDate.setDate(serviceEndDate.getDate() - 30);
            if (serviceEndDate > serviceStartDate) {
                return {
                    validateMoveInDate: {
                        valid: false
                    }
                };
            }
        }
    };
}

 export function tduCheck(currentTDU, newTDU) {
    return (control: FormControl) => {
      //If user is moving to same TDU, then user can keep the current plan or choose new one
      if (control.value === "Current Plan") {
        if (currentTDU !== newTDU) {
          return {
            tduCheck: true
          }
        }
      }
    };
  }

export function isTduDifferent(currentTDU, newTDU) {
  return (currentTDU !== newTDU);
}
