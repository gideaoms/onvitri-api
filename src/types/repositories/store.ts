import { Either } from 'fp-either';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import { Product } from '@/types/product';
import { NotFoundError } from '@/errors/not-found';

export type StoreRepository = {
  findOne(
    storeId: string,
  ): Promise<Either<NotFoundError, { data: Store & { city: City; products: Product[] }; hasMore: boolean }>>;
};
