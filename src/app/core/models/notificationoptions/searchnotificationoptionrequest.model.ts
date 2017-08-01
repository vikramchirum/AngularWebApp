/**
 * Created by vikram.chirumamilla on 7/21/2017.
 */
import {IAccountInfo} from '../accountinfo.model';
import {NotificationType} from '../enums/notificationtype';
import {ContactMethod} from '../enums/contactmethod';
import {NotificationStatus} from '../enums/notificationstatus';

export interface ISearchNotificationOptionRequest {
  Account_Info: IAccountInfo;
  Type?: NotificationType;
  Paperless?: boolean;
  Preferred_Contact_Method?: ContactMethod;
  Status?: NotificationStatus;
}
