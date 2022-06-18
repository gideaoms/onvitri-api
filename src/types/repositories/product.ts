import { Either } from 'fp-either';
import { Product } from '@/types/product';
import { Store } from '@/types/store';
import { ListOf } from '@/utils';

export type ProductRepository = {
  findManyByCity(cityId: string, page: number): Promise<ListOf<Product & { store: Store }>>;
  findOne(productId: string): Promise<Either<Error, Product & { store: Store }>>;
  findManyByStore(storeId: string, page: number): Promise<ListOf<Product>>;
};
