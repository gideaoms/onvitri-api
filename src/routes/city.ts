import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { CityRepository } from '@/repositories/city';
import { CityService } from '@/services/city';
import { CityMapper } from '@/mappers/city';
import { CitySchema } from '@/schemas';

const cityRepository = CityRepository();
const cityMapper = CityMapper();
const cityService = CityService(cityRepository);

export default async function City(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: '/cities',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        page: Type.Number(),
      }),
      response: {
        200: Type.Array(CitySchema),
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const cities = await cityService.findMany(page);
      return replay.header('x-has-more', cities.hasMore).send(cities.data.map(cityMapper.toObject));
    },
  });
}
