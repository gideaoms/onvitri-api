import { Temporary } from '@/types/temporary'
import { TemporaryRecord } from '@/types/records/temporary'
import { TemporaryObject } from '@/types/objects/temporary'

function TemporaryMapper() {
  function toRecord(temporary: Temporary) {
    const record: TemporaryRecord = {
      id: temporary.id,
      product_id: temporary.productId,
      url: temporary.url,
    }
    return record
  }

  function fromRecord(record: TemporaryRecord) {
    const temporary: Temporary = {
      id: record.id,
      productId: record.product_id,
      url: record.url,
    }
    return temporary
  }

  function toObject(temporary: Temporary) {
    const object: TemporaryObject = {
      id: temporary.id,
      product_id: temporary.productId,
      url: temporary.url,
    }
    return object
  }

  return {
    toRecord,
    fromRecord,
    toObject,
  }
}

export default TemporaryMapper
