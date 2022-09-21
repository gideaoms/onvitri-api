export type INewSessionJob = {
  prepare(): void;
  addToQueue(name: string, email: string, code: string): void;
};
