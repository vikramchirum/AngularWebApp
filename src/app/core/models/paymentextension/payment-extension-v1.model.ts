export interface IPaymentExtensionV1 {
    ServiceAccountId: string,
    DisconnectletterInfo: IDisconnectletterInfo,
    PastDue: number,
    DepositBalance: number,
    Status: string,
    EligibilityResult: string
    Message: string;
    FollowupDate: string;
  }

  export interface IDisconnectletterInfo {
    LetterInfoId: number,
    RequestDate: Date,
    DisconnectNoticeSentDate: Date,
    DisconnectActionDate: Date
  }