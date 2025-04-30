export interface IWallet {
  id?: string;
  user_id: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface FundOrWithdrawUserWalletDto {
  userId: string;
  amount: number;
}

export interface TransferFundDto {
  userId: string;
  receiverId: string;
  amount: number;
}
