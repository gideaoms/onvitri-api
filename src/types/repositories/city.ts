import { City } from '@/types/city';
import { ListOf } from '@/utils';

export type CityRepository = {
  findMany(page: number): Promise<ListOf<City>>;
};
