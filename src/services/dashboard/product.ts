import { isLeft, left, right } from 'fp-either';
import { ProductRepository } from '@/types/repositories/dashboard/product';
import { StoreRepository } from '@/types/repositories/dashboard/store';
import { Product } from '@/types/product';
import { Photo } from '@/types/photo';
import { ProductModel } from '@/models/product';
import { User } from '@/types/user';
import { BadRequestError } from '@/errors/bad-request';

export function ProductService(productRepository: ProductRepository, storeRepository: StoreRepository) {
  const productModel = ProductModel(productRepository);

  function findMany(page: number, user: User) {
    const ownerId = user.id;
    return productRepository.findMany(ownerId, page);
  }

  async function create(
    storeId: string,
    title: string,
    description: string,
    price: number,
    photos: Photo[],
    status: Product.Status,
    user: User,
  ) {
    const ownerId = user.id;
    const store = await storeRepository.exists(storeId, ownerId);
    if (isLeft(store)) return left(store.left);
    const product: Product = {
      id: undefined!,
      storeId: storeId,
      title: title,
      description: description,
      price: price,
      photos: photos,
      status: status,
    };
    if (productModel.isActive(product) && !productModel.hasPhotos(product))
      return left(new BadRequestError('Você não pode publicar um produto sem foto'));
    const reachedMaximumAmountOfActiveProducts = await productModel.reachedMaximumActiveByStore(storeId, ownerId);
    if (productModel.isActive(product) && reachedMaximumAmountOfActiveProducts) {
      const message = `Você não pode ter mais que ${ProductModel.maximumAmountActive} produtos publicados na mesma loja`;
      return left(new BadRequestError(message));
    }
    return right(await productRepository.create(product));
  }

  async function findOne(productId: string, user: User) {
    const ownerId = user.id;
    const found = await productRepository.findOne(productId, ownerId);
    if (isLeft(found)) return left(found.left);
    return right(found.right);
  }

  async function update(
    productId: string,
    title: string,
    description: string,
    price: number,
    photos: Photo[],
    status: Product.Status,
    user: User,
  ) {
    const ownerId = user.id;
    const foundProduct = await productRepository.exists(productId, ownerId);
    if (isLeft(foundProduct)) return left(foundProduct.left);
    const storeId = foundProduct.right.storeId;
    const product: Product = {
      id: productId,
      storeId: storeId,
      title: title,
      description: description,
      price: price,
      photos: photos,
      status: status,
    };
    if (productModel.isActive(product) && !productModel.hasPhotos(product))
      return left(new BadRequestError('Você não pode publicar um produto sem foto'));
    const reachedMaximumAmountOfActiveProducts = await productModel.reachedMaximumActiveByStore(storeId, ownerId);
    if (productModel.isActive(product) && reachedMaximumAmountOfActiveProducts) {
      const message = `Você não pode ter mais que ${ProductModel.maximumAmountActive} produtos publicados na mesma loja`;
      return left(new BadRequestError(message));
    }
    return right(await productRepository.update(product));
  }

  async function remove(productId: string, user: User) {
    const ownerId = user.id;
    const found = await productRepository.exists(productId, ownerId);
    if (isLeft(found)) return left(found.left);
    await productRepository.remove(productId);
    return right(found);
  }

  return {
    findMany: findMany,
    create: create,
    findOne: findOne,
    update: update,
    remove: remove,
  };
}
