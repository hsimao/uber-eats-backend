import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import {
  EmailModuleOptions,
  EmailVar,
  SendEmailInput
} from './email.interfaces';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Injectable()
export class EmailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: EmailModuleOptions
  ) {
    // this.sendEmail('標題', 'hello', '1234');
  }

  private async sendEmail({
    subject,
    to,
    template,
    emailVars
  }: SendEmailInput) {
    const form = new FormData();
    form.append(
      'from',
      `${subject} from User Eats<emailgun@${this.options.domain}>`
    );
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);

    // 變數陣列添加
    emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));

    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`
          ).toString('base64')}`
        },
        body: form
      });
    } catch (err) {
      console.log(err);
    }
  }

  sendVerificationEmail(email: string, username: string, code: string) {
    this.sendEmail({
      subject: 'Verify Your Email',
      to: email,
      template: 'verify-email',
      emailVars: [
        { key: 'code', value: code },
        { key: 'username', value: username }
      ]
    });
  }
}
