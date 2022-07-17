import { prisma } from '@/libs/prisma';

async function main() {
  const city = await prisma.city.create({
    data: {
      id: 'b9bd02e7-7315-4df6-81b8-c3e150666c61',
      name: 'City 1',
      initials: 'AA',
    },
  });
  const user = await prisma.user.create({
    data: {
      id: '14028895-0d43-416a-8c8e-30b0cde42460',
      name: 'Shopkeeper 1',
      email: 'shopkeeper1@mail.com',
      roles: ['shopkeeper'],
      status: 'active',
    },
  });
  await prisma.store.create({
    data: {
      id: '37bb3c9d-4cb7-40fd-95f2-37b768c605db',
      owner_id: user.id,
      city_id: city.id,
      fantasy_name: 'Store 1',
      phone: {
        country_code: '55',
        area_code: '44',
        number: '333333333',
      },
      neighborhood: 'Any neighborhood',
      number: '546',
      street: 'Any street',
      zip_code: '87265000',
      status: 'active',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(prisma.$disconnect);
