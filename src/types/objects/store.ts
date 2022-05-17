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
  phone: StoreObject.Phone;
  status: StoreObject.Status;
};
