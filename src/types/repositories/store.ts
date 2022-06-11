import { Either } from 'fp-either';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import { Product } from '@/types/product';

export type StoreRepository = {
  findOne(
    storeId: string,
  ): Promise<Either<Error, { data: Store & { city: City; products: Product[] }; hasMore: boolean }>>;
  exists(storeId: string, status: Store.Status): Promise<Either<Error, Store>>;
};
