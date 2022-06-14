export type NewSessionJob = {
  prepare(): void;
  addToQueue(name: string, email: string, token: string): void;
};
