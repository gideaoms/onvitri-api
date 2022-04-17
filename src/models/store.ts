import { StoreModel } from '@/types/models/store'

function StoreModel() {
  function isActive(store: StoreModel) {
    return store.status === 'active'
  }

  return {
    isActive,
  }
}

export default StoreModel
