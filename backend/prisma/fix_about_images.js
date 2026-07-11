const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.page.update({
    where: { slug: 'about-the-institution' },
    data: {
      images: JSON.stringify([
        '/images/scraped/facilities_1783446122402_gpp-library.jpg',
        '/images/scraped/facilities_1783446123064_gpp-ladies-hostel.jpg',
        '/images/scraped/facilities_1783446125199_gpp-multigym.jpg'
      ])
    }
  });
  console.log('Updated About page images');
}

main().finally(() => prisma.$disconnect());
