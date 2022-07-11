import { CityRepository } from '@/types/repositories/city';

export function CityService(cityRepository: CityRepository) {
  function findMany(page: number) {
    return cityRepository.findMany(page);
  }

  return {
    findMany: findMany,
  };
}
