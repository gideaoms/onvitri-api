import { Temporary } from '@/types/temporary'

export type TemporaryRepository = {
  create(temporary: Temporary): Promise<Temporary>
  findByExpired(daysConsideredExpired: number): Promise<Temporary[]>
  destroy(temporary: Temporary): Promise<void>
}
