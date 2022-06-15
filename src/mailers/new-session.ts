import { NewSessionMailer } from '@/types/mailers/new-session';
import { makeMailer } from '@/libs/mailer';

export function NewSessionMailer(): NewSessionMailer {
  const mailer = makeMailer<{ name: string; email: string; code: string }>();

  function send(name: string, email: string, code: string) {
    return mailer.send({
      locals: {
        name: name,
        email: email,
        code: code,
      },
      message: {
        to: `${name} <${email}>`,
      },
      template: 'new-session',
    });
  }

  return {
    send: send,
  };
}
