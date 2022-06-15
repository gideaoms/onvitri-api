export type NewUserJob = {
  prepare(): void;
  addToQueue(name: string, email: string, code: string): void;
};
