import { prisma } from '@/libs/prisma';
import { CityMapper } from '@/mappers/city';
import { CityRepository } from '@/types/repositories/city';

export function CityRepository(): CityRepository {
  const cityMapper = CityMapper();

  async function findAll() {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return cities.map(cityMapper.fromRecord);
  }

  return {
    findAll: findAll,
  };
}
