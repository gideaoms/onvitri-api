import { isLeft, left, right } from 'fp-either'
import { GuardianProvider } from '@/types/providers/guardian'
import { ProductRepository } from '@/types/repositories/dashboard/product'
import { StoreRepository } from '@/types/repositories/dashboard/store'
import { Product } from '@/types/product'
import { TemporaryRepository } from '@/types/repositories/temporary'
import ProductModel from '@/models/product'
import BadRequestError from '@/errors/bad-request'

function ProductService(
  guardianProvider: GuardianProvider,
  productRepository: ProductRepository,
  storeRepository: StoreRepository,
  temporaryRepository: TemporaryRepository,
) {
  const productModel = ProductModel()

  async function findMany(page: number, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const products = await productRepository.findMany(ownerId, page)
    return right(products)
  }

  async function create(
    storeId: string,
    title: string,
    description: string,
    price: number,
    token?: string,
  ) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const store = await storeRepository.exists(storeId, ownerId)
    if (isLeft(store)) return left(store.left)
    const product: Product = {
      id: undefined!,
      storeId: storeId,
      title: title,
      description: description,
      price: price,
      photos: [],
      status: 'inactive',
    }
    return right(await productRepository.create(product))
  }

  async function findOne(productId: string, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const found = await productRepository.findOne(productId, ownerId)
    if (isLeft(found)) return left(found.left)
    return right(found.right)
  }

  async function update(
    productId: string,
    title: string,
    description: string,
    price: number,
    photos: string[],
    status: Product.Status,
    token?: string,
  ) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const userId = user.right.id
    const foundProduct = await productRepository.exists(productId, userId)
    if (isLeft(foundProduct)) return left(foundProduct.left)
    
    const product: Product = {
      id: productId,
      storeId: foundProduct.right.storeId,
      title: title,
      description: description,
      price: price,
      photos: photos,
      status: status,
    }
    if (productModel.isActive(product) && !productModel.hasPhotos(product))
      return left(
        new BadRequestError('You can not publish a product without a photo'),
      )
    const photosToRemove = productModel.findPhotosToRemove(product, photos)
    console.log({ photosToRemove })
    return right(await productRepository.update(product))
  }

  return {
    findMany,
    create,
    findOne,
    update,
  }
}

export default ProductService
