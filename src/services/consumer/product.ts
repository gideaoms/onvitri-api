import { ProductRepository } from '@/types/repositories/consumer/product';
import { User } from '@/types/user';

export function ProductService(productRepository: ProductRepository) {
  function findMany(page: number, user: User) {
    return productRepository.findMany(page, user);
  }

  return {
    findMany: findMany,
  };
}
