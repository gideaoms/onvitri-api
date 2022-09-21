import { ICityRepository } from '@/types/repositories/city';

export function CityService(cityRepository: ICityRepository) {
  function findMany(page: number) {
    return cityRepository.findMany(page);
  }

  return {
    findMany: findMany,
  };
}
