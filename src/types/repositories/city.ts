import { City } from '@/types/city';
import { ListOf } from '@/utils';

export type ICityRepository = {
  findMany(page: number): Promise<ListOf<City>>;
};
