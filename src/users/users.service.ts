import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Verification } from './entities';
import { LoginInput, CreateAccountInput, EditProfileInput } from './dtos';
import { JwtService } from '../jwt/jwt.service';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService
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

      const user = await this.users.save(
        this.users.create({ email, password, role })
      );

      // 創建驗證碼
      const verification = await this.verification.create({ user });
      await this.verification.save(verification);
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
    try {
      // find the user with the email
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }

      // check if the password is correct
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Wrong password' };
      }

      // make a JWT and give it to the user
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }

  findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  // 編輯用戶資料
  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.findById(userId);

    if (email) {
      user.email = email;

      // 修改 email 需重置驗證碼
      user.verified = false;
      const verification = await this.verification.create({ user });
      await this.verification.save(verification);
    }
    if (password) user.password = password;

    // 使用 save 才會觸發 BeforeUpdate hook, 進行 hash password
    return this.users.save(user);
  }
}
