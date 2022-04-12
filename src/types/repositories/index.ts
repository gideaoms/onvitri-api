import { Product } from './product'
import { Store } from './store'
import { User } from './user'
import { Dashboard } from './dashboard'

declare module Repositories {
  export { Product, Store, User, Dashboard }
}

export { Repositories }
