export declare namespace StoreRecord {
  type Phone = {
    country_code: string;
    area_code: string;
    number: string;
  };
  type Status = 'active' | 'inactive';
}

export type StoreRecord = {
  id: string;
  fantasy_name: string;
  street: string;
  number: string;
  neighborhood: string;
  zip_code: string;
  phone: StoreRecord.Phone;
  amount_active_products: number;
  status: StoreRecord.Status;
};
