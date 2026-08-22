const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.page.update({
    where: { slug: 'about-the-institution' },
    data: {
      images: JSON.stringify([
        "/images/about_college.jpg",
        "/images/about_drama1.jpg",
        "/images/about_drama2.jpg",
        "/images/about_drama3.jpg"
      ])
    }
  });
  console.log("DB Updated");
}

main().finally(() => prisma.$disconnect());
