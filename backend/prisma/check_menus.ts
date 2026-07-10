import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMenus() {
  const menus = await prisma.menu.findMany({
    include: { children: true }
  });
  console.log('Total menus:', menus.length);
  if (menus.length > 0) {
    console.log('Sample top level:', menus.filter(m => !m.parentId).map(m => m.label));
  }
}

checkMenus()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
