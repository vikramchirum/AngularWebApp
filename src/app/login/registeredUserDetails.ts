export interface IRegisteredUser {
  Token: string;
  Email_Address: string;
  AccountPermissions: IAccountPermissions[];
}

export interface IAccountPermissions {
  AccountType: string;
  AccountNumber: string;
}
