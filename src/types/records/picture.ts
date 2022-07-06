export declare namespace PictureRecord {
  type Variant = {
    url: string;
    name: string;
    ext: string;
    width: number;
    height: number;
    size: 'sm' | 'md';
  };
}

export type PictureRecord = {
  id: string;
  variants: PictureRecord.Variant[];
};
