import { db } from '../config';

export class AuthService {
  async register() {
    const users = await db('users');
    return 1;
  }
}
