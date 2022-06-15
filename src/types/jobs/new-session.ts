export type NewSessionJob = {
  prepare(): void;
  addToQueue(name: string, email: string, code: string): void;
};
