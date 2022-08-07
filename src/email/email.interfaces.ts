export interface EmailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
}

export interface EmailVar {
  key: string;
  value: string;
}

export interface SendEmailInput {
  subject: string;
  to: string;
  template: string;
  emailVars: EmailVar[];
}
