import { GuardianProvider } from '@/types/providers/guardian';
import { MultipartProvider } from '@/types/providers/multipart';

export function PhotoService(guardianProvider: GuardianProvider, multipartProvider: MultipartProvider) {
  async function create(photoName: string) {
    return multipartProvider.create(photoName);
  }

  return {
    create: create,
  };
}
