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


export function validateMoveInDate(endDate, startDate) {
    return (group: FormGroup): { [key: string]: any } => {
        const serviceEndDate = group.controls[endDate].value;
        const serviceStartDate = group.controls[startDate].value;
        if (serviceEndDate && serviceStartDate) {
            let moveInDate = serviceStartDate.jsdate;
            let moveOutDate = clone(serviceEndDate.jsdate);
            moveOutDate = moveOutDate.setDate(moveOutDate.getDate() + 30);
            if (moveInDate > moveOutDate) {
                return {
                    validateMoveInDate: {
                        valid: false
                    }
                };
            }
        }
    };
}