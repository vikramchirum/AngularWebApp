
export interface IUser {
  Email_Address: string;
  Zip: string;
  Billing_Account_Id: string;
  User_name: string;
  Password: string;
  ConfirmPassword: string;

}

export interface ISecurityQuestions {
  Id: number;
  Question: string;
}
