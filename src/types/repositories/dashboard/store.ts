import { Either } from 'fp-either';
import { Store } from '@/types/store';
import { City } from '@/types/city';

export type StoreRepository = {
  exists(storeId: string, ownerId: string): Promise<Either<Error, Store>>;
  findAll(ownerId: string): Promise<(Store & { city: City })[]>;
};
