import { Types } from '@/types'

function Store() {
  function isActive(store: Types.Models.Store) {
    return store.status === 'active'
  }

  return {
    isActive,
  }
}

export { Store }
