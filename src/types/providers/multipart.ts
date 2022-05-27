import { Photo } from '@/types/photo';

export type IMultipartProvider = {
  create(photoName: string): Promise<Photo>;
};
