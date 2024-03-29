export declare namespace Picture {
  type Variant = {
    url: string;
    name: string;
    ext: string;
    width: number;
    height: number;
    size: 'sm' | 'md';
  };
}

export type Picture = {
  id: string;
  variants: Picture.Variant[];
};
