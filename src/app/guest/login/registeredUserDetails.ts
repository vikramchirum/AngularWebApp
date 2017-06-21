export interface IRegisteredUser {
  Token: string;
  Profile: IUserProfile;
  AccountPermissions: IAccountPermissions[];
}

export interface IUserProfile {
  Email_Address: string;
  Username: string;
}

export interface IAccountPermissions {
  AccountType: string;
  AccountNumber: string;
}
