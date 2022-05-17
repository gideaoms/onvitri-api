import { Either } from 'fp-either';
import NotFoundError from '@/errors/not-found';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import { Product } from '@/types/product';

export type StoreRepository = {
  findOne(storeId: string): Promise<
    Either<
      NotFoundError,
      {
        data: Store & { city: City; products: Product[] };
        hasMore: boolean;
      }
    >
  >;
};
