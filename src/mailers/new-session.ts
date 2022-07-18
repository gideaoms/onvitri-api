import { NewSessionMailer } from '@/types/mailers/new-session';
import { buildMailer } from '@/libs/mailer';

export function NewSessionMailer(): NewSessionMailer {
  const mailer = buildMailer<{ name: string; email: string; validationCode: string }>();

  function send(name: string, email: string, validationCode: string) {
    return mailer.send({
      locals: {
        name: name,
        email: email,
        validationCode: validationCode,
      },
      message: {
        from: `Onvitri <no-replay@onvitri.com.br>`,
        to: `${name} <${email}>`,
      },
      template: 'new-session',
    });
  }

  return {
    send: send,
  };
}
