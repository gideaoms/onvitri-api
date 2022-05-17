export declare namespace Store {
  type Phone = {
    countryCode: string;
    areaCode: string;
    number: string;
  };
  type Status = 'active' | 'inactive';
}

export type Store = {
  id: string;
  fantasyName: string;
  street: string;
  number: string;
  neighborhood: string;
  phone: Store.Phone;
  status: Store.Status;
};
