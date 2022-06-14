export type NewSessionMailer = {
  send(name: string, email: string, token: string): Promise<void>;
};
