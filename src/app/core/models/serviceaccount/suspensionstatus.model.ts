export interface ISuspensionStatusResponse {
  status_code: number;
  description: string;
  reject_reason: string;
  requested_date: Date;
}

export enum SuspensionStatusEnum {
  PendingDisconnect = 67,
  Disconnected = 82,
  PendingReconnect = 68,
  ReconnectRejected = 89
}
