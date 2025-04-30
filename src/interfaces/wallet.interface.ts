export interface IWallet {
  id?: string;
  user_id: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface FundUserWalletDto {
  userId: string;
  amount: number;
}
