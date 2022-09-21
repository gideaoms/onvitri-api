export type ICryptoProvider = {
  compare(plain: string, hashed: string): Promise<boolean>;
  hash(plain: string, round?: number): Promise<string>;
  randomDigits(): string;
};
