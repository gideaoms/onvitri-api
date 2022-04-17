export declare namespace StoreModel {
  type Phone = {
    countryCode: string
    areaCode: string
    number: string
  }
  type Status = 'active' | 'inactive'
}

export type StoreModel = {
  id: string
  fantasyName: string
  street: string
  number: string
  neighborhood: string
  phone: StoreModel.Phone
  status: StoreModel.Status
}
