
export interface IUser {
  Email_Address: string;
  Zip_Code: string;
  Service_Account_Id: string;
  User_name: string;
  Password: string;
  Security_Question_Id: number;
  Security_Question_Answer: string;
}

export interface ISecurityQuestions {
  Id: number;
  Question: string;
}
