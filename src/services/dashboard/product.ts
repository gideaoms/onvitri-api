import { isLeft, left, right } from 'fp-either';
import { IGuardianProvider } from '@/types/providers/guardian';
import { IProductRepository } from '@/types/repositories/dashboard/product';
import { IStoreRepository } from '@/types/repositories/dashboard/store';
import { Product } from '@/types/product';
import { Photo } from '@/types/photo';
import ProductModel from '@/models/product';
import BadRequestError from '@/errors/bad-request';

function ProductService(
  guardianProvider: IGuardianProvider,
  productRepository: IProductRepository,
  storeRepository: IStoreRepository,
) {
  const productModel = ProductModel(productRepository);

  async function findMany(page: number, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    const ownerId = user.right.id;
    const products = await productRepository.findMany(ownerId, page);
    return right(products);
  }

  async function create(
    storeId: string,
    title: string,
    description: string,
    price: number,
    photos: Photo[],
    status: Product.Status,
    token?: string,
  ) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    const ownerId = user.right.id;
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
    const reachedMaximumQuantityPublished = await productModel.reachedMaximumQuantityPublished(ownerId);
    if (productModel.isActive(product) && reachedMaximumQuantityPublished) {
      const message = `Você não pode ter mais que ${ProductModel.maximumQuantityPublished} produtos publicados ao mesmo tempo`;
      return left(new BadRequestError(message));
    }
    return right(await productRepository.create(product));
  }

  async function findOne(productId: string, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    const ownerId = user.right.id;
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
    token?: string,
  ) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    const ownerId = user.right.id;
    const foundProduct = await productRepository.exists(productId, ownerId);
    if (isLeft(foundProduct)) return left(foundProduct.left);
    const product: Product = {
      id: productId,
      storeId: foundProduct.right.storeId,
      title: title,
      description: description,
      price: price,
      photos: photos,
      status: status,
    };
    if (productModel.isActive(product) && !productModel.hasPhotos(product))
      return left(new BadRequestError('Você não pode publicar um produto sem foto'));
    const reachedMaximumQuantityPublished = await productModel.reachedMaximumQuantityPublished(ownerId);
    if (productModel.isActive(product) && reachedMaximumQuantityPublished) {
      const message = `Você não pode ter mais que ${ProductModel.maximumQuantityPublished} produtos publicados ao mesmo tempo`;
      return left(new BadRequestError(message));
    }
    return right(await productRepository.update(product));
  }

  async function destroy(productId: string, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    const ownerId = user.right.id;
    const found = await productRepository.exists(productId, ownerId);
    if (isLeft(found)) return left(found.left);
    await productRepository.destroy(productId);
    return right(null);
  }

  return {
    findMany,
    create,
    findOne,
    update,
    destroy,
  };
}

export default ProductService;
