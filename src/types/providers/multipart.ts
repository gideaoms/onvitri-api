import { Photo } from '@/types/photo'

export type MultipartProvider = {
  create(photo: Photo): Promise<Photo>
  destroy(photo: Photo): Promise<void>
}
