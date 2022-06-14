export type SessionMailer = {
  send(name: string, email: string, token: string): Promise<void>;
};
