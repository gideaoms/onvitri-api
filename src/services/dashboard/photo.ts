import { isLeft, left, right } from 'fp-either';
import { IGuardianProvider } from '@/types/providers/guardian';
import { IMultipartProvider } from '@/types/providers/multipart';

function PhotoService(guardianProvider: IGuardianProvider, multipartProvider: IMultipartProvider) {
  async function create(photoName: string, token?: string) {
    const user = await guardianProvider.passThrough('shopkeeper', token);
    if (isLeft(user)) return left(user.left);
    return right(await multipartProvider.create(photoName));
  }

  return {
    create,
  };
}

export default PhotoService;
