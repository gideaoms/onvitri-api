import { Either } from 'fp-either';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import NotFoundError from '@/errors/not-found';

export type IStoreRepository = {
  exists(storeId: string, ownerId: string): Promise<Either<NotFoundError, Store>>;
  findAll(ownerId: string): Promise<(Store & { city: City })[]>;
};
