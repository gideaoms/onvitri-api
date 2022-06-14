import path from 'path';
import Email from 'email-templates';
import config from '@/config';

export function makeMailer<TemplateVars>() {
  return new Email<TemplateVars>({
    views: {
      root: path.resolve(__dirname, '..', 'email-templates'),
      options: {
        extension: 'njk',
        map: {
          njk: 'nunjucks',
        },
      },
    },
    message: {
      from: 'no-replay@onvitri.com.br',
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
