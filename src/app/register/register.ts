
export interface IUser {
  Email_Address: string;
  Zip: string;
  Billing_Account_Id: string;
  User_name: string;
  Password: string;
}

export interface ISecurityQuestions {
  Security_Id: number;
  Security_Question: string;
}
