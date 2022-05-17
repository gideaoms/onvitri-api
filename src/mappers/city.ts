import { CityObject } from '@/types/objects/city';
import { City } from '@/types/city';
import { CityRecord } from '@/types/records/city';

function CityMapper() {
  function fromRecord(record: CityRecord) {
    const model: City = {
      id: record.id,
      name: record.name,
      initials: record.initials,
    };
    return model;
  }

  function toObject(city: City) {
    const object: CityObject = {
      id: city.id,
      name: city.name,
      initials: city.initials,
    };
    return object;
  }

  return {
    fromRecord,
    toObject,
  };
}

export default CityMapper;
