import { FastifyInstance } from 'fastify';
import { CityRepository } from '@/repositories/city';
import { CityService } from '@/services/city';
import { CityMapper } from '@/mappers/city';
import { schemas } from '@/schemas';

const cityRepository = CityRepository();
const cityMapper = CityMapper();
const cityService = CityService(cityRepository);

async function City(fastify: FastifyInstance) {
  fastify.route<{
    Querystring: {
      page: number;
    };
  }>({
    url: '/cities',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: {
            type: 'number',
          },
        },
        required: ['page'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: schemas.city,
          },
        },
      },
    },
    async handler(request, replay) {
      const page = request.query.page;
      const cities = await cityService.findMany(page);
      return replay.header('x-has-more', cities.hasMore).send(cities.data.map(cityMapper.toObject));
    },
  });
}

export default City;
