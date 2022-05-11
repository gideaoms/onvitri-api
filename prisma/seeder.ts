import prisma from '@/libs/prisma'
import CryptoProvider from '@/providers/crypto'

async function main() {
  const cryptoProvider = CryptoProvider()
  const city = await prisma.city.create({
    data: {
      id: 'b9bd02e7-7315-4df6-81b8-c3e150666c61',
      name: 'Quinta do Sol',
      initials: 'PR',
    },
  })
  const user = await prisma.user.create({
    data: {
      id: '14028895-0d43-416a-8c8e-30b0cde42460',
      name: 'João da Silva',
      email: 'joao@mail.com',
      roles: ['shopkeeper'],
      status: 'active',
      password: await cryptoProvider.hash('123456'),
    },
  })
  await prisma.store.create({
    data: {
      id: '37bb3c9d-4cb7-40fd-95f2-37b768c605db',
      owner_id: user.id,
      city_id: city.id,
      fantasy_name: 'Loja Vende Bem',
      phone: {
        country_code: '55',
        area_code: '44',
        number: '984999999',
      },
      neighborhood: 'Centro',
      number: '546',
      street: 'Rua Três Marias',
      zip_code: '87265000',
      status: 'active',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
