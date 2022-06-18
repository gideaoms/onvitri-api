import { Either } from 'fp-either';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import { Product } from '@/types/product';
import { ListOf } from '@/utils';

export type StoreRepository = {
  findOne(storeId: string): Promise<Either<Error, Store & { city: City; products: ListOf<Product> }>>;
  findManyByCity(cityId: string, page: number): Promise<ListOf<Store & { city: City }>>;
};
