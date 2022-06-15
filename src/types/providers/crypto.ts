export type CryptoProvider = {
  compare(plain: string, hashed: string): Promise<boolean>;
  hash(plain: string, round?: number): Promise<string>;
  random(size: number): string;
};
