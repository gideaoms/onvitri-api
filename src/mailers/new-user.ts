import { NewUserMailer } from '@/types/mailers/new-user';
import { makeMailer } from '@/libs/mailer';

export function NewUserMailer(): NewUserMailer {
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
      template: 'new-user',
    });
  }

  return {
    send: send,
  };
}
