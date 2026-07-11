const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(await prisma.galleryImage.findMany({take: 2}));
  console.log(await prisma.galleryAlbum.findMany({take: 2}));
}
main().finally(() => prisma.$disconnect());
