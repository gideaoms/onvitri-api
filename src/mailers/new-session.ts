import { NewSessionMailer } from '@/types/mailers/new-session';
import { makeMailer } from '@/libs/mailer';

export function NewSessionMailer(): NewSessionMailer {
  const mailer = makeMailer<{ name: string; email: string; token: string }>();

  function send(name: string, email: string, token: string) {
    return mailer.send({
      locals: {
        name: name,
        email: email,
        token: token,
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
