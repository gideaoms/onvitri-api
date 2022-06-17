import { Product } from '@/types/product';
import { Store } from '@/types/store';
import { User } from '@/types/user';

export type ProductRepository = {
  findMany(page: number, user: User): Promise<{ data: (Product & { store: Store })[]; hasMore: boolean }>;
};
