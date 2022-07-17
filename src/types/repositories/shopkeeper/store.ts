import { Either } from '@/either';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import { ListOf } from '@/utils';

export type StoreRepository = {
  exists(storeId: string, ownerId: string): Promise<Either<Error, Store>>;
  findMany(page: number, ownerId: string): Promise<ListOf<Store & { city: City }>>;
};
