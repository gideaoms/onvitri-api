import { isFailure, failure, success } from '@/either';
import { ProductRepository } from '@/types/repositories/shopkeeper/product';
import { StoreRepository } from '@/types/repositories/shopkeeper/store';
import { Product } from '@/types/product';
import { Picture } from '@/types/picture';
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
    pictures: Picture[],
    status: Product.Status,
    user: User,
  ) {
    const ownerId = user.id;
    const store = await storeRepository.exists(storeId, ownerId);
    if (isFailure(store)) return failure(store.failure);
    const product: Product = {
      id: undefined!,
      storeId: storeId,
      title: title,
      description: description,
      price: price,
      pictures: pictures,
      status: status,
    };
    if (productModel.isActive(product) && !productModel.isValidPrice(product))
      return failure(new BadRequestError('Você não pode publicar um produto sem preço'));
    if (productModel.isActive(product) && !productModel.hasPictures(product))
      return failure(new BadRequestError('Você não pode publicar um produto sem foto'));
    const reachedMaximumAmountOfActiveProducts = await productModel.reachedMaximumActiveByStore(storeId, ownerId);
    if (productModel.isActive(product) && reachedMaximumAmountOfActiveProducts) {
      const message = `Você não pode ter mais que ${ProductModel.MAXIMUM_ACTIVE_BY_STORE} produtos publicados na mesma loja`;
      return failure(new BadRequestError(message));
    }
    return success(await productRepository.create(product));
  }

  async function findOne(productId: string, user: User) {
    const ownerId = user.id;
    const found = await productRepository.findOne(productId, ownerId);
    if (isFailure(found)) return failure(found.failure);
    return success(found.success);
  }

  async function update(
    productId: string,
    title: string,
    description: string,
    price: number,
    pictures: Picture[],
    status: Product.Status,
    user: User,
  ) {
    const ownerId = user.id;
    const foundProduct = await productRepository.exists(productId, ownerId);
    if (isFailure(foundProduct)) return failure(foundProduct.failure);
    const storeId = foundProduct.success.storeId;
    const product: Product = {
      id: productId,
      storeId: storeId,
      title: title,
      description: description,
      price: price,
      pictures: pictures,
      status: status,
    };
    if (productModel.isActive(product) && !productModel.isValidPrice(product))
      return failure(new BadRequestError('Você não pode publicar um produto sem preço'));
    if (productModel.isActive(product) && !productModel.hasPictures(product))
      return failure(new BadRequestError('Você não pode publicar um produto sem foto'));
    const reachedMaximumAmountOfActiveProducts = await productModel.reachedMaximumActiveByStore(storeId, ownerId);
    if (productModel.isActive(product) && reachedMaximumAmountOfActiveProducts) {
      const message = `Você não pode ter mais que ${ProductModel.MAXIMUM_ACTIVE_BY_STORE} produtos publicados na mesma loja`;
      return failure(new BadRequestError(message));
    }
    return success(await productRepository.update(product));
  }

  async function remove(productId: string, user: User) {
    const ownerId = user.id;
    const found = await productRepository.exists(productId, ownerId);
    if (isFailure(found)) return failure(found.failure);
    await productRepository.remove(productId);
    return success(found);
  }

  return {
    findMany: findMany,
    create: create,
    findOne: findOne,
    update: update,
    remove: remove,
  };
}
