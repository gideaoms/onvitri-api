import { Store } from '@/types/store';

export function StoreModel() {
  function isActive(store: Store) {
    return store.status === 'active';
  }

  function hasMaximumActiveProductsReached(store: Store) {
    return StoreModel.MAXIMUM_ACTIVE_PRODUCTS <= store.amountActiveProducts;
  }

  return {
    isActive: isActive,
    hasMaximumActiveProductsReached: hasMaximumActiveProductsReached,
  };
}

StoreModel.MAXIMUM_ACTIVE_PRODUCTS = 30;

StoreModel.ITEMS_BY_PAGE = 12;
