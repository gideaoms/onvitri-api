import { CityRepository } from '@/types/repositories/city';

export function CityService(cityRepository: CityRepository) {
  function findAll() {
    return cityRepository.findAll();
  }

  return {
    findAll: findAll,
  };
}
