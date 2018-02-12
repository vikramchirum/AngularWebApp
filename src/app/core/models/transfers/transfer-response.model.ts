import { TransferStatus } from "app/core/models/enums/transferstatus";

export class TransferRecord {
    Service_Account_Id: string;
    Customer_Account_Id: string;
    Status: TransferStatus;

}