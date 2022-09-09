export declare namespace StoreObject {
  type Phone = {
    country_code: string;
    area_code: string;
    number: string;
  };
  type Status = 'active' | 'inactive';
}

export type StoreObject = {
  id: string;
  fantasy_name: string;
  street: string;
  number: string;
  neighborhood: string;
  zip_code: string;
  phone: StoreObject.Phone;
  amount_active_products: number;
  status: StoreObject.Status;
};
