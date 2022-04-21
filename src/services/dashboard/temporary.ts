import { isLeft, left, right } from 'fp-either'
import { TemporaryRepository } from '@/types/repositories/dashboard/temporary'
import { MultipartProvider } from '@/types/providers/multipart'
import { ProductRepository } from '@/types/repositories/dashboard/product'
import { Temporary } from '@/types/temporary'
import { Photo } from '@/types/photo'
import { GuardianProvider } from '@/types/providers/guardian'

function TemporaryService(
  guardianProvider: GuardianProvider,
  temporaryRepository: TemporaryRepository,
  productRepository: ProductRepository,
  multipartProvider: MultipartProvider,
) {
  async function create(productId: string, filename: string, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    const ownerId = user.right.id
    const found = await productRepository.exists(productId, ownerId)
    if (isLeft(found)) return left(found.left)
    const photo: Photo = {
      id: undefined!,
      url: filename,
    }
    const createdPhoto = await multipartProvider.create(photo)
    const temporary: Temporary = {
      id: undefined!,
      productId: productId,
      url: createdPhoto.url,
    }
    return right(temporaryRepository.create(temporary))
  }

  async function destroyMany() {
    const daysConsideredExpired = 2
    const expiredTemporaries = await temporaryRepository.findByExpired(
      daysConsideredExpired,
    )
    await Promise.all(
      expiredTemporaries.map((temporary) =>
        temporaryRepository.destroy(temporary),
      ),
    )
    await Promise.all(
      expiredTemporaries.map((temporary) => {
        const photo: Photo = {
          id: temporary.id,
          url: temporary.url,
        }
        return multipartProvider.destroy(photo)
      }),
    )
  }

  return {
    create,
    destroyMany,
  }
}

export default TemporaryService
