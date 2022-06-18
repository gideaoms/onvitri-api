import { City } from '@/types/city';

export type CityRepository = {
  findAll(): Promise<City[]>;
};
