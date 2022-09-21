import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/prisma';
import { CityMapper } from '@/mappers/city';
import { CityModel } from '@/models/city';
import { ICityRepository } from '@/types/repositories/city';

export function CityRepository(): ICityRepository {
  const cityMapper = CityMapper();

  async function findMany(page: number) {
    const limit = CityModel.ITEMS_BY_PAGE;
    const offset = limit * (page - 1);
    const orderBy: Prisma.CityOrderByWithRelationInput = {
      name: 'asc',
    };
    const cities = await prisma.city.findMany({
      orderBy: orderBy,
      take: limit,
      skip: offset,
    });
    const hasMore = await prisma.city.count({
      orderBy: orderBy,
      take: limit,
      skip: limit * page,
    });
    return {
      data: cities.map((city) => cityMapper.fromRecord(city)),
      hasMore: Boolean(hasMore),
    };
  }

  return {
    findMany: findMany,
  };
}
