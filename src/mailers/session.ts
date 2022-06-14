import { SessionMailer } from '@/types/mailers/session';
import { makeMailer } from '@/libs/mailer';

export function SessionMailer(): SessionMailer {
  const mailer = makeMailer<{ name: string; email: string; token: string }>();

  async function send(name: string, email: string, token: string) {
    await mailer.send({
      locals: {
        name: name,
        email: email,
        token: token,
      },
      message: {
        to: `${name} <${email}>`,
      },
      template: 'session',
    });
  }

  return {
    send: send,
  };
}
