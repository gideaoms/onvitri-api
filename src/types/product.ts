import { Picture } from './picture';

export declare namespace Product {
  type Status = 'active' | 'inactive';
}

export type Product = {
  id: string;
  storeId: string;
  title: string;
  description: string;
  price: number;
  pictures: Picture[];
  status: Product.Status;
};
