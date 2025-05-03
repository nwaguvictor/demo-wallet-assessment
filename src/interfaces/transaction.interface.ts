export interface ITransaction {
  id?: string;
  amount: number;
  sender_wallet?: string;
  receiver_wallet?: string;
  type: TransactionType;
  status: TransactionStatus;
  created_at?: Date;
  updated_at?: Date;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionType {
  FUND = 'FUND',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
}
