import { Types } from '@/types'

function Store(storeRepository: Types.Repositories.Store) {
  async function findOne(storeId: string) {
    const store = await storeRepository.findOne(storeId)
    return store
  }

  return {
    findOne,
  }
}

export { Store }
