import { EmailModuleOptions } from './email.interfaces';
import { Module, DynamicModule } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Module({})
export class EmailModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options
        }
      ],
      exports: []
    };
  }
}
