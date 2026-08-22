const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menus = await prisma.menu.findMany({
    orderBy: { position: 'asc' },
  });
  console.log(`Found ${menus.length} menus in DB`);
  menus.forEach(m => console.log(`${m.label} - href: ${m.href} - parentId: ${m.parentId} - isVisible: ${m.isVisible}`));
  await prisma.$disconnect();
}
main();
