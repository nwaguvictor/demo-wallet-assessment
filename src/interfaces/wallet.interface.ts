export interface IWallet {
  id?: string;
  user_id: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}
