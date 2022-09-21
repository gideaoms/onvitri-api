import { Picture } from '@/types/picture';

export type IMultipartProvider = {
  create(picture: Picture): Promise<Picture>;
};
