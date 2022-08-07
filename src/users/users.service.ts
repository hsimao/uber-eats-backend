import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Verification } from './entities';
import {
  LoginInput,
  LoginOutput,
  UserProfileOutput,
  CreateAccountInput,
  CreateAccountOutput,
  EditProfileInput,
  EditProfileOutput,
  VerifyEmailOutput
} from './dtos';
import { JwtService } from '../jwt/jwt.service';
import { EmailService } from './../email/email.service';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async createAccount({
    email,
    password,
    role
  }: CreateAccountInput): Promise<CreateAccountOutput> {
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

      // 發送驗證碼到 email
      this.emailService.sendVerificationEmail(
        user.email,
        'Mars', // 尚未有 user name 暫時先寫死
        verification.code
      );

      return { ok: true };
    } catch (err) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // find the user with the email
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'] // 因為預設 password 設定 false, 若需要取得需要在此設定
      });

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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneBy({ id });
      return {
        ok: true,
        user
      };
    } catch (err) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  // 編輯用戶資料
  async editProfile(
    userId: number,
    { email, password }: EditProfileInput
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOneBy({ id: userId });

      if (email) {
        user.email = email;

        // 修改 email 需重置驗證碼, 刪除後重新創建
        user.verified = false;
        await this.verification.delete({ user: { id: user.id } });
        const verification = await this.verification.create({ user });
        await this.verification.save(verification);

        // 發送驗證碼到 email
        this.emailService.sendVerificationEmail(
          user.email,
          'Mars', // 尚未有 user name 暫時先寫死
          verification.code
        );
      }
      if (password) user.password = password;

      // 使用 save 才會觸發 BeforeUpdate hook, 進行 hash password
      await this.users.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verification.findOne({
        where: { code },
        relations: ['user']
      });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verification.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
