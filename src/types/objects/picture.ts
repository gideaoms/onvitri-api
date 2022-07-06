export type VariantObject = {
  url: string;
  name: string;
  ext: string;
  width: number;
  height: number;
  size: 'sm' | 'md';
};

export type PictureObject = {
  id: string;
  variants: VariantObject[];
};
