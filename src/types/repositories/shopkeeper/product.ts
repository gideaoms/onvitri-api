import { Either } from '@/either';
import { Product } from '@/types/product';
import { Store } from '@/types/store';
import { City } from '@/types/city';
import { ListOf } from '@/utils';

export type ProductRepository = {
  findMany(
    ownerId: string,
    page: number,
    storeId: string,
  ): Promise<ListOf<Product & { store: Store & { city: City } }>>;
  create(product: Product): Promise<Product & { store: Store & { city: City } }>;
  exists(productId: string, ownerId: string): Promise<Either<Error, Product>>;
  update(product: Product, store: Store): Promise<Product & { store: Store & { city: City } }>;
  findOne(
    productId: string,
    ownerId: string,
  ): Promise<Either<Error, Product & { store: Store & { city: City } }>>;
  remove(product: Product): Promise<void>;
  countActiveByStore(storeId: string, ownerId: string): Promise<number>;
};
