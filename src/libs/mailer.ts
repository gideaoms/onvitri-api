import path from 'path';
import EmailTemplates from 'email-templates';
import { config } from '@/config';

export function buildMailer<T>() {
  return new EmailTemplates<T>({
    views: {
      root: path.resolve(__dirname, '..', 'email-templates'),
      options: {
        extension: 'njk',
        map: {
          njk: 'nunjucks',
        },
      },
    },
    transport: {
      host: config.MAIL_HOST,
      port: config.MAIL_PORT,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    },
    send: true,
  });
}
