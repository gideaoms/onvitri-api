export type INewSessionMailer = {
  send(name: string, email: string, token: string): Promise<void>;
};
