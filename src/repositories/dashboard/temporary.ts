import prisma from '@/libs/prisma'
import { TemporaryRepository } from '@/types/repositories/dashboard/temporary'
import { Temporary } from '@/types/temporary'
import { TimeProvider } from '@/types/providers/time'
import TemporaryMapper from '@/mappers/temporary'

function TemporaryRepository(timeProvider: TimeProvider): TemporaryRepository {
  const temporaryMapper = TemporaryMapper()

  async function create(temporary: Temporary) {
    console.log('\n\n\n\n', temporaryMapper.toRecord(temporary))

    const created = await prisma.temporary.create({
      data: temporaryMapper.toRecord(temporary),
    })
    return temporaryMapper.fromRecord(created)
  }

  async function findByExpired(daysConsideredExpired: number) {
    const twoDaysAgo = timeProvider.subtractDays(daysConsideredExpired)
    const temporaries = await prisma.temporary.findMany({
      where: {
        created_at: {
          lt: twoDaysAgo,
        },
      },
    })
    return temporaries.map((temporary) => temporaryMapper.fromRecord(temporary))
  }

  async function destroy(temporary: Temporary) {
    await prisma.temporary.delete({
      where: {
        id: temporary.id,
      },
    })
  }

  return {
    create,
    findByExpired,
    destroy,
  }
}

export default TemporaryRepository
