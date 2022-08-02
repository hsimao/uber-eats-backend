import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>
  ) {}

  async createAccount({
    email,
    password,
    role
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      // 檢查 email 是否已經存在
      const exists = await this.users.findOneBy({ email });

      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({
    email,
    password
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // find the user with the email
    // check if the password is correct
    // make a JWT and give it to the user

    try {
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Wrong password' };
      }
      return { ok: true, token: 'lalalala' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
