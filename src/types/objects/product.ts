import { PictureObject } from './picture';

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
  pictures: PictureObject[];
};
