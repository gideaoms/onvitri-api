import { FastifyInstance } from 'fastify';
import { CityRepository } from '@/repositories/city';
import { CityService } from '@/services/city';
import { CityMapper } from '@/mappers/city';
import { schemas } from '@/schemas';

const cityRepository = CityRepository();
const cityMapper = CityMapper();
const cityService = CityService(cityRepository);

async function City(fastify: FastifyInstance) {
  fastify.route({
    url: '/cities',
    method: 'GET',
    schema: {
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
    async handler(_request, replay) {
      const cities = await cityService.findAll();
      return replay.send(cities.map(cityMapper.toObject));
    },
  });
}

export default City;
