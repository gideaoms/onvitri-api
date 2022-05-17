import { Photo } from '@/types/photo'

export type MultipartProvider = {
  create(photoName: string): Promise<Photo>
}
