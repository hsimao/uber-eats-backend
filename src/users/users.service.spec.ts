import { User, Verification } from './entities';
import { EmailService } from './../email/email.service';
import { JwtService } from './../jwt/jwt.service';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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

describe('UserService', () => {
  let service: UsersService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
