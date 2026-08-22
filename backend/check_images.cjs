const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({ where: { slug: 'about-the-institution' } });
  console.log("PAGE IMAGES:", page?.images);
}

main().finally(() => prisma.$disconnect());
