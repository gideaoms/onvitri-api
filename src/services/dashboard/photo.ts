import { MultipartProvider } from '@/types/providers/multipart';

export function PhotoService(multipartProvider: MultipartProvider) {
  async function create(photoName: string) {
    return multipartProvider.create(photoName);
  }

  return {
    create: create,
  };
}
