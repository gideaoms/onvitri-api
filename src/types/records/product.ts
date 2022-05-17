import { PhotoRecord } from './photo';

export declare namespace ProductRecord {
  type Status = 'active' | 'inactive';
}

export type ProductRecord = {
  id: string;
  store_id: string;
  title: string;
  description: string;
  price: number;
  status: ProductRecord.Status;
  photos: PhotoRecord[];
};
