import { Crypto } from './crypto'
import { Token } from './token'
import { Guardian } from './guardian'

declare module Providers {
  export { Crypto, Token, Guardian }
}

export { Providers }
