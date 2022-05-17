import { isLeft, left, right } from 'fp-either'
import { GuardianProvider } from '@/types/providers/guardian'
import { MultipartProvider } from '@/types/providers/multipart'

function PhotoService(guardianProvider: GuardianProvider, multipartProvider: MultipartProvider) {
  async function create(photoName: string, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token)
    if (isLeft(user)) return left(user.left)
    return right(await multipartProvider.create(photoName))
  }

  return {
    create,
  }
}

export default PhotoService
