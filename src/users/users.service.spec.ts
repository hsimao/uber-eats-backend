import { User, Verification } from './entities';
import { EmailService } from './../email/email.service';
import { JwtService } from './../jwt/jwt.service';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn()
};

const mockEmailService = {
  sendVerificationEmail: jest.fn()
};

// 將 Repository 所有內建方法 mock
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: EmailService,
          useValue: mockEmailService
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      // mock findOne 返回值
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'mock@gmail.com'
      });

      const result = await service.createAccount({
        email: '',
        password: '',
        role: 0
      });

      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already'
      });
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
