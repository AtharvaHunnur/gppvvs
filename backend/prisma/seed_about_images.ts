import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding images for about page...');

  const images = [
    '/images/about_building.png',
    '/images/about_drama.png',
    '/images/about_group.png'
  ];

  const page = await prisma.page.update({
    where: { slug: 'about-the-institution' },
    data: {
      images: JSON.stringify(images)
    }
  });

  console.log('Page images seeded. Current Page record:', page);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
