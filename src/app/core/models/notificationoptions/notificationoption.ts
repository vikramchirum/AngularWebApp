/**
 * Created by vikram.chirumamilla on 7/21/2017.
 */


import {NotificationType} from '../enums/notificationtype';
import {ContactMethod} from '../enums/contactmethod';
import {NotificationStatus} from '../enums/notificationstatus';
import {IPhoneNumber} from '../address/phonenumber';
import {IAccountInfo} from '../accountinfo';

export interface INotificationOption {
  Type: NotificationType;
  Paperless: boolean;
  Preferred_Contact_Method: ContactMethod;
  Email: string;
  Status: NotificationStatus;
  Phone_Number: IPhoneNumber;
  Account_Info: IAccountInfo;
}
