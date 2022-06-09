import { Store } from '@/types/store';

export function StoreModel() {
  function isActive(store: Store) {
    return store.status === 'active';
  }

  return {
    isActive: isActive,
  };
}

StoreModel.itemsByPage = 12;
