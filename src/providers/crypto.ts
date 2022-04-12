import bcryptjs from 'bcryptjs'
import { Types } from '@/types'

function Crypto(): Types.Providers.Crypto {
  function compare(plain: string, hashed: string) {
    return bcryptjs.compare(plain, hashed)
  }

  function hash(plain: string, round = 8) {
    return bcryptjs.hash(plain, round)
  }

  return {
    compare,
    hash,
  }
}

export { Crypto }
