export type NewUserMailer = {
  send(name: string, email: string, token: string): Promise<void>;
};
