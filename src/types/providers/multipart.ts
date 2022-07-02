import { Picture } from '@/types/picture';

export type MultipartProvider = {
  create(picture: Picture): Promise<Picture>;
};
