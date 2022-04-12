import { Store } from './store'
import { Product } from './product'
import { City } from './city'
import { User } from './user'

declare module Models {
  export { Store, Product, City, User }
}

export { Models }
