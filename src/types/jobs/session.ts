export type SessionJob = {
  prepare(): void;
  addToQueue(name: string, email: string, token: string): void;
};
