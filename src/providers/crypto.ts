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

  function random(size: number) {
    return crypto.randomBytes(size).toString('hex').substring(size).toUpperCase();
  }

  return {
    compare: compare,
    hash: hash,
    random: random,
  };
}
