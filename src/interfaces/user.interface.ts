export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}
