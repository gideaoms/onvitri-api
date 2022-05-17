import { PhotoObject } from './photo';

export declare namespace ProductObject {
  type Status = 'active' | 'inactive';
}

export type ProductObject = {
  id: string;
  store_id: string;
  title: string;
  description: string;
  price: number;
  status: ProductObject.Status;
  photos: PhotoObject[];
};
