import { Store } from '@/types/store';

function StoreModel() {
  function isActive(store: Store) {
    return store.status === 'active';
  }

  return {
    isActive,
  };
}

StoreModel.itemsByPage = 12;

export default StoreModel;
