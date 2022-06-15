import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { CryptoProvider } from '@/types/providers/crypto';

export function CryptoProvider(): CryptoProvider {
  function compare(plain: string, hashed: string) {
    return bcryptjs.compare(plain, hashed);
  }

  function hash(plain: string, round = 8) {
    return bcryptjs.hash(plain, round);
  }

  function randomDigits() {
    return crypto.randomInt(100000, 999999).toString(); // 6 digits
  }

  return {
    compare: compare,
    hash: hash,
    randomDigits: randomDigits,
  };
}
