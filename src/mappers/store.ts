import { StoreRecord } from '@/types/records/store';
import { Store } from '@/types/store';
import { StoreObject } from '@/types/objects/store';

export function StoreMapper() {
  function fromRecord(record: StoreRecord) {
    const store: Store = {
      id: record.id,
      fantasyName: record.fantasy_name,
      street: record.street,
      number: record.number,
      neighborhood: record.neighborhood,
      phone: {
        countryCode: record.phone.country_code,
        areaCode: record.phone.area_code,
        number: record.phone.number,
      },
      zipCode: record.zip_code,
      amountActiveProducts: record.amount_active_products,
      status: record.status,
    };
    return store;
  }

  function toObject(store: Store) {
    const object: StoreObject = {
      id: store.id,
      fantasy_name: store.fantasyName,
      street: store.street,
      number: store.number,
      neighborhood: store.neighborhood,
      phone: {
        country_code: store.phone.countryCode,
        area_code: store.phone.areaCode,
        number: store.phone.number,
      },
      zip_code: store.zipCode,
      amount_active_products: store.amountActiveProducts,
      status: store.status,
    };
    return object;
  }

  return {
    fromRecord: fromRecord,
    toObject: toObject,
  };
}
