import { Photo } from '@/types/photo'

export type MultipartProvider = {
  create(filename: string): Promise<Photo>
}
