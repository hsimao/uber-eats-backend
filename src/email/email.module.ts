import { EmailService } from './email.service';
import { EmailModuleOptions } from './email.interfaces';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Module({})
@Global()
export class EmailModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options
        },
        EmailService
      ],
      exports: [EmailService]
    };
  }
}
