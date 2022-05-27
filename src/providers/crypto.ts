import bcryptjs from 'bcryptjs';
import { ICryptoProvider } from '@/types/providers/crypto';

function CryptoProvider(): ICryptoProvider {
  function compare(plain: string, hashed: string) {
    return bcryptjs.compare(plain, hashed);
  }

  function hash(plain: string, round = 8) {
    return bcryptjs.hash(plain, round);
  }

  return {
    compare,
    hash,
  };
}

export default CryptoProvider;
